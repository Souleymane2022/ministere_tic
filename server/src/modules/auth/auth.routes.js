const router = require('express').Router();
const Joi = require('joi');
const rateLimit = require('express-rate-limit');

const controller = require('./auth.controller');
const { authenticate } = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const asyncHandler = require('../../utils/asyncHandler');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Trop de tentatives, réessayez plus tard' },
  standardHeaders: true,
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  totpCode: Joi.string().length(6).optional(),
});

const refreshSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

const verify2FASchema = Joi.object({
  token: Joi.string().length(6).required(),
});

const disable2FASchema = Joi.object({
  password: Joi.string().required(),
});

const changePasswordSchema = Joi.object({
  ancienMotDePasse: Joi.string().required(),
  nouveauMotDePasse: Joi.string().min(8).required(),
});

router.post('/login', loginLimiter, validate(loginSchema), asyncHandler(controller.login));
router.post('/refresh', validate(refreshSchema), asyncHandler(controller.refresh));
router.post('/logout', authenticate, asyncHandler(controller.logout));
router.get('/me', authenticate, asyncHandler(controller.me));

router.post('/2fa/setup', authenticate, asyncHandler(controller.setup2FA));
router.post('/2fa/verify', authenticate, validate(verify2FASchema), asyncHandler(controller.verify2FA));
router.post('/2fa/disable', authenticate, validate(disable2FASchema), asyncHandler(controller.disable2FA));

router.post('/change-password', authenticate, validate(changePasswordSchema), asyncHandler(controller.changePassword));

module.exports = router;
