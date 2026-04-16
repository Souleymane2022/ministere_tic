import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Lock, Mail, Shield, Eye, EyeOff } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import Logo from '@/components/Logo';

export default function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [totpCode, setTotp] = useState('');
  const [need2FA, setNeed2FA] = useState(false);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', {
        email, password, totpCode: totpCode || undefined,
      });

      if (data.twoFactorRequired) {
        setNeed2FA(true);
        toast('Veuillez saisir votre code 2FA', { icon: '🔐' });
      } else {
        setAuth(data);
        toast.success(`Bienvenue, ${data.user.prenom} !`);
        navigate('/');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  }

  function fill(acc, pwd) {
    setEmail(acc); setPassword(pwd);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sht-primary via-sht-primary-light to-sht-secondary p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex justify-center mb-6">
            <Logo size={56} />
          </div>

          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-sht-primary">Portail SHT</h1>
            <p className="text-sm text-gray-500 mt-1">Société des Hydrocarbures du Tchad</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="email"
                  required
                  className="input pl-10"
                  placeholder="votre.email@sht-td.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={need2FA}
                />
              </div>
            </div>

            <div>
              <label className="label">Mot de passe</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type={show ? 'text' : 'password'}
                  required
                  className="input pl-10 pr-10"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={need2FA}
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {need2FA && (
              <div>
                <label className="label">Code 2FA</label>
                <div className="relative">
                  <Shield size={16} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    maxLength={6}
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    autoFocus
                    className="input pl-10 font-mono tracking-widest text-center"
                    placeholder="123 456"
                    value={totpCode}
                    onChange={(e) => setTotp(e.target.value)}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Code à 6 chiffres de votre application d'authentification
                </p>
              </div>
            )}

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Connexion...' : (need2FA ? 'Vérifier le code' : 'Se connecter')}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t">
            <p className="text-xs text-center text-gray-500 mb-2 font-medium">Comptes de démonstration</p>
            <div className="grid grid-cols-3 gap-1 text-[10px]">
              <button
                onClick={() => fill('admin@sht-td.com', 'Admin@SHT2025')}
                className="p-2 border rounded hover:bg-gray-50 text-center"
              >
                <div className="font-bold text-red-600">Admin</div>
                <div className="text-gray-500 truncate">admin@sht-td.com</div>
              </button>
              <button
                onClick={() => fill('dg@sht-td.com', 'DG@SHT2025')}
                className="p-2 border rounded hover:bg-gray-50 text-center"
              >
                <div className="font-bold text-blue-600">DG</div>
                <div className="text-gray-500 truncate">dg@sht-td.com</div>
              </button>
              <button
                onClick={() => fill('agent@sht-td.com', 'Agent@SHT2025')}
                className="p-2 border rounded hover:bg-gray-50 text-center"
              >
                <div className="font-bold text-green-600">Agent</div>
                <div className="text-gray-500 truncate">agent@sht-td.com</div>
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-white/70 text-xs mt-4">
          © {new Date().getFullYear()} Société des Hydrocarbures du Tchad
        </p>
      </div>
    </div>
  );
}
