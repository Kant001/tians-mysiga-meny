import { supabase } from '@/integrations/supabase/client';

interface AnalyticsEvent {
  page: string;
  timestamp: Date;
  userAgent: string;
  referrer: string;
  sessionId: string;
}

// Generate a session ID for tracking unique visitors
export const getSessionId = (): string => {
  let sessionId = localStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
};

// Detect device type
export const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

// Get traffic source
export const getTrafficSource = (): string => {
  const referrer = document.referrer;
  if (!referrer) return 'Direct';
  
  const hostname = new URL(referrer).hostname;
  if (hostname.includes('google')) return 'Google';
  if (hostname.includes('facebook')) return 'Facebook';
  if (hostname.includes('instagram')) return 'Instagram';
  if (hostname.includes('twitter') || hostname.includes('t.co')) return 'Twitter';
  if (hostname.includes('linkedin')) return 'LinkedIn';
  
  return hostname;
};

// Track page visit
export const trackPageVisit = async (page: string) => {
  try {
    const sessionId = getSessionId();
    const deviceType = getDeviceType();
    const trafficSource = getTrafficSource();
    
    const visitData = {
      page,
      session_id: sessionId,
      device_type: deviceType,
      traffic_source: trafficSource,
      user_agent: navigator.userAgent,
      referrer: document.referrer,
      timestamp: new Date().toISOString(),
      ip_address: null // Will be handled by Supabase/server
    };

    // Insert into page_visits table
    const { error } = await supabase
      .from('page_visits')
      .insert([visitData]);

    if (error) {
      console.error('Error tracking page visit:', error);
    }
  } catch (error) {
    console.error('Error in trackPageVisit:', error);
  }
};

// Hook to track page visits automatically
export const usePageTracking = () => {
  const trackCurrentPage = () => {
    const currentPage = window.location.pathname;
    trackPageVisit(currentPage);
  };

  return { trackCurrentPage };
};