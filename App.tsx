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
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-stone-800 border-t-orange-300" />
      <span className="text-xs font-medium tracking-widest text-stone-600">LOADING</span>
    </div>
  </div>
);

const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<PhaseRoute>(PhaseRoute.LOW_ENERGY);
  const currentState = getStateSurface(currentRoute);

  return (
    <div className="min-h-screen bg-[#0c0a09] text-stone-200 selection:bg-orange-900/30 selection:text-orange-100">
      <main className="mx-auto min-h-screen max-w-md px-6">
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
