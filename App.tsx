import React, { Suspense, lazy, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Navigation from './components/Navigation';
import { getStateSurface } from './data/states';
import { PhaseRoute } from './types';

const StateSurface = lazy(() => import('./components/StateSurface'));
const Roadmap = lazy(() => import('./components/Roadmap'));

const LoadingFallback = () => (
  <div className="flex h-[50vh] w-full items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--ps-border-subtle)] border-t-[var(--ps-brand)]" />
      <span className="ps-type-brand ps-subtle">LOADING</span>
    </div>
  </div>
);

const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<PhaseRoute>(PhaseRoute.LOW_ENERGY);
  const currentState = getStateSurface(currentRoute);

  return (
    <div className="ps-app-shell">
      <main className="ps-shell">
        <Navigation currentRoute={currentRoute} onNavigate={setCurrentRoute} />
        <Suspense fallback={<LoadingFallback />}>
          <AnimatePresence mode="wait">
            {currentRoute === PhaseRoute.ROADMAP || !currentState ? (
              <Roadmap key={PhaseRoute.ROADMAP} />
            ) : (
              <StateSurface key={currentRoute} state={currentState} />
            )}
          </AnimatePresence>
        </Suspense>
      </main>
    </div>
  );
};

export default App;
