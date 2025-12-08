import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Layout } from './components/Layout';
import { Heart } from 'lucide-react';

// Lazy Load Pages for Performance
const Home = lazy(() => import('./pages/Home'));
const Volunteer = lazy(() => import('./pages/Volunteer'));
const Donate = lazy(() => import('./pages/Donate'));
const Campaigns = lazy(() => import('./pages/Campaigns'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

const LoadingScreen = () => (
  <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50">
    <div className="animate-pulse">
        <Heart size={48} className="text-primary-500 fill-primary-500" />
    </div>
    <span className="mt-4 text-slate-400 font-medium">Loading OpenHearts...</span>
  </div>
);

// ScrollToTop component to reset scroll on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App = () => {
  return (
    <HashRouter>
      <ScrollToTop />
      <Layout>
        <Suspense fallback={<LoadingScreen />}>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/volunteer" element={<Volunteer />} />
              <Route path="/donate" element={<Donate />} />
              <Route path="/campaigns" element={<Campaigns />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </Layout>
    </HashRouter>
  );
};

export default App;