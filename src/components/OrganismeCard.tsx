'use client';

import Image from 'next/image';
import { Organisme } from '@/data/organismes';

interface OrganismeCardProps {
  organisme: Organisme;
}

export default function OrganismeCard({ organisme }: OrganismeCardProps) {
  return (
    <div className="group bg-white rounded-2xl p-6 card-hover border border-gris-100 h-full flex flex-col shine-effect">
      {/* Logo & Sigle */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 transition-transform group-hover:scale-110 duration-300 bg-gris-50 flex items-center justify-center p-1">
          <Image
            src={organisme.logo}
            alt={`Logo ${organisme.sigle}`}
            width={56}
            height={56}
            className="object-contain"
          />
        </div>
        <div>
          <h3 className="font-bold text-xl text-gris-800 group-hover:text-bleu transition-colors">
            {organisme.sigle}
          </h3>
          <p className="text-xs text-gris-500 leading-tight mt-0.5">{organisme.nom}</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-gris-600 text-sm leading-relaxed mb-4 flex-1">
        {organisme.description.substring(0, 150)}...
      </p>

      {/* Missions preview */}
      <div className="space-y-1.5">
        {organisme.missions.slice(0, 3).map((mission, i) => (
          <div key={i} className="flex items-start gap-2">
            <div
              className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
              style={{ backgroundColor: organisme.couleur }}
            />
            <span className="text-xs text-gris-600">{mission}</span>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div
        className="mt-5 h-1 rounded-full opacity-20 group-hover:opacity-60 transition-opacity"
        style={{ backgroundColor: organisme.couleur }}
      />
    </div>
  );
}
