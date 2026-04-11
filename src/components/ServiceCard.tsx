'use client';

import {
  Radio,
  TrendingUp,
  Building2,
  Mail,
  BookOpen,
  ShieldCheck,
} from 'lucide-react';
import { Service } from '@/data/services';

const iconMap: Record<string, React.ElementType> = {
  Radio,
  TrendingUp,
  Building2,
  Mail,
  BookOpen,
  ShieldCheck,
};

interface ServiceCardProps {
  service: Service;
  index: number;
}

export default function ServiceCard({ service, index }: ServiceCardProps) {
  const Icon = iconMap[service.icon] || Radio;
  const isEven = index % 2 === 0;

  return (
    <div className={`group bg-white rounded-2xl p-6 card-hover border border-gris-100 h-full relative overflow-hidden shine-effect ${
      isEven ? '' : ''
    }`}>
      {/* Decorative corner */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-bleu/5 to-transparent rounded-bl-full" />

      {/* Numero */}
      <div className="absolute top-3 right-4 text-5xl font-bold text-gris-100 group-hover:text-bleu/5 transition-colors">
        {String(index + 1).padStart(2, '0')}
      </div>

      {/* Icon */}
      <div className="w-14 h-14 rounded-xl bg-bleu/10 flex items-center justify-center mb-5 group-hover:bg-bleu group-hover:text-white transition-all duration-300">
        <Icon size={26} className="text-bleu group-hover:text-white transition-colors" />
      </div>

      {/* Titre */}
      <h3 className="font-bold text-lg text-gris-800 mb-3 group-hover:text-bleu transition-colors">
        {service.titre}
      </h3>

      {/* Description */}
      <p className="text-gris-600 text-sm leading-relaxed mb-4">
        {service.description.substring(0, 120)}...
      </p>

      {/* Details */}
      <ul className="space-y-2">
        {service.details.slice(0, 3).map((detail, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gris-600">
            <div className="w-1 h-1 rounded-full bg-jaune mt-2 shrink-0" />
            {detail}
          </li>
        ))}
      </ul>

      {/* Bottom accent */}
      <div className="mt-5 flex gap-1">
        <div className="h-1 w-8 rounded-full bg-bleu" />
        <div className="h-1 w-4 rounded-full bg-jaune" />
        <div className="h-1 w-2 rounded-full bg-rouge" />
      </div>
    </div>
  );
}
