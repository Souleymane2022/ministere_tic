export default function Logo({ size = 40, light = false }) {
  return (
    <div className="flex items-center gap-3">
      <svg width={size} height={size} viewBox="0 0 64 64" className="shrink-0">
        <circle cx="22" cy="32" r="18" fill="#2E7D32"/>
        <ellipse cx="40" cy="34" rx="10" ry="14" fill={light ? '#FFFFFF' : '#1A2B3C'}/>
      </svg>
      <div className={light ? 'text-white' : 'text-sht-primary'}>
        <div className="font-extrabold text-lg leading-tight tracking-tight">SHT</div>
        <div className={`text-[10px] leading-tight ${light ? 'text-white/70' : 'text-gray-500'}`}>
          Portail de Gestion
        </div>
      </div>
    </div>
  );
}
