import React from 'react';
import { BatteryLow, Brain, CloudLightning, Map, Moon, Sparkles, Sunrise } from 'lucide-react';
import { motion } from 'framer-motion';
import { STATE_SURFACES } from '../data/states';
import { PhaseRoute } from '../types';

interface NavigationProps {
  currentRoute: PhaseRoute;
  onNavigate: (route: PhaseRoute) => void;
}

const routeIcons = {
  [PhaseRoute.LOW_ENERGY]: BatteryLow,
  [PhaseRoute.OVERSTIMULATED]: CloudLightning,
  [PhaseRoute.MENTALLY_FATIGUED]: Brain,
  [PhaseRoute.DEEP_WORK]: Sparkles,
  [PhaseRoute.PRE_SLEEP]: Moon,
  [PhaseRoute.POST_WAKE]: Sunrise,
  [PhaseRoute.ROADMAP]: Map
};

const Navigation: React.FC<NavigationProps> = ({ currentRoute, onNavigate }) => {
  const navItems = [
    ...STATE_SURFACES.map((state) => ({
      route: state.route,
      label: state.label,
      shortLabel: state.shortLabel,
      icon: routeIcons[state.route]
    })),
    {
      route: PhaseRoute.ROADMAP,
      label: 'Roadmap',
      shortLabel: 'Roadmap',
      icon: routeIcons[PhaseRoute.ROADMAP]
    }
  ];

  return (
    <nav className="sticky top-0 z-50 -mx-6 mb-5 border-b border-stone-800/80 bg-[#0c0a09]/95 px-6 pt-4 pb-3 backdrop-blur-xl">
      <div className="mb-3 flex items-end justify-between gap-4">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-orange-300/80">PhaseShift</div>
          <div className="text-xs text-stone-500">Shift state. Start now.</div>
        </div>
        <div className="rounded-full border border-stone-800 bg-stone-900/70 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-stone-400">
          Offline
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin" aria-label="State navigation">
        {navItems.map((item) => {
          const isActive = currentRoute === item.route;
          const Icon = item.icon;
          return (
            <button
              key={item.route}
              type="button"
              onClick={() => onNavigate(item.route)}
              className={`relative flex min-w-fit items-center gap-2 rounded-full border px-3 py-2 text-sm transition-all ${
                isActive
                  ? 'border-orange-500/50 text-stone-100'
                  : 'border-stone-800 bg-stone-900/40 text-stone-500 hover:border-stone-700 hover:text-stone-300'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="state-rail-pill"
                  className="absolute inset-0 rounded-full bg-stone-800"
                  transition={{ type: 'spring', stiffness: 340, damping: 32 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Icon size={15} className={isActive ? 'text-orange-300' : 'text-stone-500'} />
                <span className="whitespace-nowrap">{item.label}</span>
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
