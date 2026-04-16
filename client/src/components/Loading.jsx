import { Loader2 } from 'lucide-react';

export default function Loading({ text = 'Chargement...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
      <Loader2 size={36} className="animate-spin text-sht-primary mb-3" />
      <p className="text-sm">{text}</p>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, subtitle, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && <Icon size={48} className="text-gray-300 mb-3" />}
      <div className="font-medium text-gray-600">{title}</div>
      {subtitle && <div className="text-sm text-gray-400 mt-1">{subtitle}</div>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
