import { initiales } from '@/lib/utils';

export default function Avatar({ user, size = 36, className = '' }) {
  const style = { width: size, height: size, fontSize: size / 2.5 };
  if (user?.avatar) {
    return (
      <img
        src={user.avatar}
        alt={`${user.prenom || ''} ${user.nom || ''}`}
        className={`rounded-full object-cover ${className}`}
        style={style}
      />
    );
  }
  return (
    <div
      className={`rounded-full bg-sht-secondary text-white flex items-center justify-center font-semibold ${className}`}
      style={style}
    >
      {initiales(user?.nom, user?.prenom) || '?'}
    </div>
  );
}
