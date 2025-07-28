import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageVisit } from '@/lib/analytics';

export const useAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page visit when location changes
    trackPageVisit(location.pathname);
  }, [location.pathname]);

  return null;
};