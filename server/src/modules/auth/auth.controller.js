const bcrypt = require('bcrypt');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const prisma = require('../../config/prisma');
const env = require('../../config/env');
const ApiError = require('../../utils/ApiError');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../../utils/jwt');
const { auditLog } = require('../../middlewares/audit');

/**
 * POST /api/auth/login
 */
async function login(req, res) {
  const { email, password, totpCode } = req.body;

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    include: { direction: true },
  });

  if (!user) throw ApiError.unauthorized('Identifiants invalides');
  if (!user.actif) throw ApiError.forbidden('Compte désactivé');

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    await auditLog(req, 'LOGIN_FAILED', 'User', user.id, { email });
    throw ApiError.unauthorized('Identifiants invalides');
  }

  // 2FA
  if (user.twoFactorEnabled) {
    if (!totpCode) {
      return res.json({
        success: true,
        twoFactorRequired: true,
        tempUserId: user.id,
        message: 'Code 2FA requis',
      });
    }
    const valid = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: totpCode,
      window: 1,
    });
    if (!valid) {
      await auditLog(req, 'LOGIN_2FA_FAILED', 'User', user.id);
      throw ApiError.unauthorized('Code 2FA invalide');
    }
  }

  const payload = { sub: user.id, role: user.role, email: user.email };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken({ sub: user.id });

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  await auditLog(req, 'LOGIN_SUCCESS', 'User', user.id);

  const { password: _, twoFactorSecret: __, refreshToken: ___, ...safeUser } = user;
  res.json({ success: true, accessToken, refreshToken, user: safeUser });
}

/**
 * POST /api/auth/refresh
 */
async function refresh(req, res) {
  const { refreshToken } = req.body;
  if (!refreshToken) throw ApiError.badRequest('Refresh token manquant');

  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    throw ApiError.unauthorized('Refresh token invalide');
  }

  const user = await prisma.user.findUnique({ where: { id: decoded.sub } });
  if (!user || user.refreshToken !== refreshToken) {
    throw ApiError.unauthorized('Refresh token révoqué');
  }

  const payload = { sub: user.id, role: user.role, email: user.email };
  const accessToken = signAccessToken(payload);
  const newRefreshToken = signRefreshToken({ sub: user.id });

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: newRefreshToken },
  });

  res.json({ success: true, accessToken, refreshToken: newRefreshToken });
}

/**
 * POST /api/auth/logout
 */
async function logout(req, res) {
  if (req.user) {
    await prisma.user.update({ where: { id: req.user.id }, data: { refreshToken: null } });
    await auditLog(req, 'LOGOUT', 'User', req.user.id);
  }
  res.json({ success: true, message: 'Déconnecté' });
}

/**
 * GET /api/auth/me
 */
async function me(req, res) {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: { direction: true },
  });
  const { password, twoFactorSecret, refreshToken, ...safe } = user;
  res.json({ success: true, user: safe });
}

/**
 * POST /api/auth/2fa/setup - génère un secret et un QR code
 */
async function setup2FA(req, res) {
  const secret = speakeasy.generateSecret({
    name: `${env.TOTP_ISSUER} (${req.user.email})`,
    issuer: env.TOTP_ISSUER,
  });

  await prisma.user.update({
    where: { id: req.user.id },
    data: { twoFactorSecret: secret.base32 },
  });

  const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);
  res.json({
    success: true,
    secret: secret.base32,
    qrCode: qrCodeUrl,
    otpauthUrl: secret.otpauth_url,
  });
}

/**
 * POST /api/auth/2fa/verify - active la 2FA après vérification du code
 */
async function verify2FA(req, res) {
  const { token } = req.body;
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!user.twoFactorSecret) throw ApiError.badRequest('2FA non initialisée');

  const valid = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: 'base32',
    token,
    window: 1,
  });
  if (!valid) throw ApiError.unauthorized('Code 2FA invalide');

  await prisma.user.update({
    where: { id: user.id },
    data: { twoFactorEnabled: true },
  });
  await auditLog(req, '2FA_ENABLED', 'User', user.id);
  res.json({ success: true, message: '2FA activée' });
}

/**
 * POST /api/auth/2fa/disable
 */
async function disable2FA(req, res) {
  const { password } = req.body;
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  const ok = await bcrypt.compare(password || '', user.password);
  if (!ok) throw ApiError.unauthorized('Mot de passe incorrect');

  await prisma.user.update({
    where: { id: user.id },
    data: { twoFactorEnabled: false, twoFactorSecret: null },
  });
  await auditLog(req, '2FA_DISABLED', 'User', user.id);
  res.json({ success: true, message: '2FA désactivée' });
}

/**
 * POST /api/auth/change-password
 */
async function changePassword(req, res) {
  const { ancienMotDePasse, nouveauMotDePasse } = req.body;
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  const ok = await bcrypt.compare(ancienMotDePasse, user.password);
  if (!ok) throw ApiError.unauthorized('Ancien mot de passe incorrect');

  const hashed = await bcrypt.hash(nouveauMotDePasse, env.BCRYPT_ROUNDS);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashed, refreshToken: null },
  });
  await auditLog(req, 'PASSWORD_CHANGED', 'User', user.id);
  res.json({ success: true, message: 'Mot de passe modifié' });
}

module.exports = {
  login, refresh, logout, me,
  setup2FA, verify2FA, disable2FA,
  changePassword,
};
