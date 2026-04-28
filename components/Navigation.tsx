import React, { CSSProperties } from 'react';
import { BatteryLow, Brain, CloudLightning, Map, Moon, Sparkles, Sunrise } from 'lucide-react';
import { motion } from 'framer-motion';
import { getStateSurface, STATE_SURFACES } from '../data/states';
import { STATE_THEME } from '../data/stateTheme';
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

const quickSwitches = [
  { label: 'Too much', route: PhaseRoute.OVERSTIMULATED },
  { label: 'Need focus', route: PhaseRoute.DEEP_WORK },
  { label: 'Wind down', route: PhaseRoute.PRE_SLEEP },
  { label: 'Wake up', route: PhaseRoute.POST_WAKE }
];

const Navigation: React.FC<NavigationProps> = ({ currentRoute, onNavigate }) => {
  const currentState = getStateSurface(currentRoute);
  const currentTheme = currentState ? STATE_THEME[currentState.accent] : undefined;
  const railStyle = currentTheme ? ({ '--ps-state-rgb': currentTheme.rgb } as CSSProperties) : undefined;
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
    <nav className="ps-state-rail ps-state-scope" style={railStyle}>
      <div className="mb-3 flex items-end justify-between gap-4">
        <div>
          <div className="ps-type-brand text-[var(--ps-brand)]">PhaseShift</div>
          <div className="ps-type-meta">Shift state. Start now.</div>
        </div>
        <div className="ps-pill px-3 py-1 ps-type-brand">
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
              className={`ps-pill relative flex min-w-fit items-center gap-2 px-3 py-2 text-sm transition-all ${
                isActive
                  ? 'ps-pill-accent text-[var(--ps-text-primary)]'
                  : 'hover:border-[var(--ps-border-strong)] hover:text-[var(--ps-text-secondary)]'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="state-rail-pill"
                  className="absolute inset-0 rounded-full bg-[var(--ps-state-soft)]"
                  transition={{ type: 'spring', stiffness: 340, damping: 32 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Icon size={15} className={isActive ? 'ps-accent-text' : 'ps-muted'} />
                <span className="whitespace-nowrap">{item.label}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1" aria-label="Quick switch actions">
        {quickSwitches.map((item) => {
          const isActive = currentRoute === item.route;
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => onNavigate(item.route)}
              className={`ps-quick-switch ${isActive ? 'ps-pill-accent' : ''}`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
