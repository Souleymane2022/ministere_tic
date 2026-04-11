'use client';

import { useRef, useEffect, useState } from 'react';
import { useInView } from 'framer-motion';
import { Smartphone, Cable, Monitor, Users } from 'lucide-react';
import AnimatedSection from './AnimatedSection';

const iconMap: Record<string, React.ElementType> = {
  Smartphone,
  Cable,
  Monitor,
  Users,
};

interface StatItemProps {
  label: string;
  valeur: number;
  suffix: string;
  icon: string;
  delay: number;
}

function StatItem({ label, valeur, suffix, icon, delay }: StatItemProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  const Icon = iconMap[icon] || Monitor;

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000;
    const steps = 60;
    const increment = valeur / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= valeur) {
        setCount(valeur);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isInView, valeur]);

  return (
    <AnimatedSection delay={delay} className="text-center group">
      <div ref={ref} className="relative">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-jaune/20 transition-colors duration-300">
          <Icon size={28} className="text-jaune" />
        </div>
        <div className="text-4xl md:text-5xl font-bold text-white mb-2">
          {count.toLocaleString('fr-FR')}
          <span className="text-jaune text-2xl ml-1">{suffix === 'km' || suffix === '+' ? suffix : ''}</span>
        </div>
        <div className="text-white/70 text-sm font-medium uppercase tracking-wider">
          {label}
        </div>
      </div>
    </AnimatedSection>
  );
}

export default function StatsCounter() {
  const stats = [
    { label: 'Abonnes Mobiles', valeur: 8500000, suffix: '+', icon: 'Smartphone' },
    { label: 'Km de Fibre Optique', valeur: 7200, suffix: 'km', icon: 'Cable' },
    { label: 'Services Digitalises', valeur: 45, suffix: '+', icon: 'Monitor' },
    { label: 'Jeunes Formes en TIC', valeur: 25000, suffix: '+', icon: 'Users' },
  ];

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 hero-gradient" />
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2l2-1 2 1v2h16v2H24v2.5l-2 1.5-2-1.5zM0 0h2v18H0V0zm4 0h2v18H4V0zm4 0h2v18H8V0zm4 0h2v18h-2V0zm4 0h2v18h-2V0zm4 4.205L18 0H0v20h20V0h-4zM6 0h2v18H6V0z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <AnimatedSection className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Le Tchad en <span className="text-jaune">Chiffres</span>
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Les indicateurs cles du developpement numerique et des telecommunications au Tchad
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <StatItem key={stat.label} {...stat} delay={index * 0.15} />
          ))}
        </div>
      </div>
    </section>
  );
}
