import { useState } from 'react';
import { Shield, CheckCircle2, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import PageHeader from '@/components/PageHeader';

export default function TwoFactorSetup() {
  const user = useAuthStore((s) => s.user);
  const [step, setStep] = useState(user?.twoFactorEnabled ? 'active' : 'initial');
  const [qrData, setQrData] = useState(null);
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');

  async function start() {
    try {
      const { data } = await api.post('/auth/2fa/setup');
      setQrData(data);
      setStep('verify');
    } catch (err) {
      toast.error('Erreur lors de la génération du QR code');
    }
  }

  async function verify() {
    try {
      await api.post('/auth/2fa/verify', { token: code });
      toast.success('2FA activée avec succès');
      setStep('active');
    } catch {
      toast.error('Code invalide');
    }
  }

  async function disable() {
    if (!password) return toast.error('Mot de passe requis');
    try {
      await api.post('/auth/2fa/disable', { password });
      toast.success('2FA désactivée');
      setStep('initial');
      setPassword('');
    } catch {
      toast.error('Mot de passe incorrect');
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader title="Authentification à deux facteurs" subtitle="Ajoutez un niveau de sécurité supplémentaire à votre compte" />

      <div className="card">
        {step === 'initial' && (
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <AlertTriangle size={20} className="text-yellow-600 mt-0.5" />
              <div>
                <div className="font-medium text-yellow-900">2FA non activée</div>
                <p className="text-sm text-yellow-800 mt-1">
                  L'authentification à deux facteurs protège votre compte même si votre mot de passe est compromis.
                </p>
              </div>
            </div>
            <button onClick={start} className="btn-primary">
              <Shield size={16} /> Activer la 2FA
            </button>
          </div>
        )}

        {step === 'verify' && qrData && (
          <div className="space-y-4">
            <h3 className="font-semibold">1. Scannez le QR code avec Google Authenticator, Authy, ou Microsoft Authenticator</h3>
            <div className="flex justify-center p-4 bg-gray-50 rounded-lg">
              <img src={qrData.qrCode} alt="QR Code 2FA" className="w-64 h-64" />
            </div>
            <details className="text-sm">
              <summary className="cursor-pointer text-gray-600 hover:text-gray-900">Impossible de scanner ?</summary>
              <div className="mt-2 p-3 bg-gray-100 rounded font-mono text-xs break-all">
                {qrData.secret}
              </div>
            </details>

            <h3 className="font-semibold">2. Saisissez le code à 6 chiffres affiché</h3>
            <input
              type="text"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="123 456"
              className="input font-mono text-center text-lg tracking-widest"
            />
            <button onClick={verify} className="btn-primary w-full">Vérifier et activer</button>
          </div>
        )}

        {step === 'active' && (
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle2 size={20} className="text-green-600 mt-0.5" />
              <div>
                <div className="font-medium text-green-900">2FA activée</div>
                <p className="text-sm text-green-800 mt-1">
                  Votre compte est protégé par l'authentification à deux facteurs.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="font-medium mb-2">Désactiver la 2FA</div>
              <p className="text-sm text-gray-500 mb-3">Saisissez votre mot de passe pour désactiver.</p>
              <div className="flex gap-2">
                <input
                  type="password"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input"
                />
                <button onClick={disable} className="btn-danger">Désactiver</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
