-- Create page_visits table for storing individual page visits
CREATE TABLE public.page_visits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page TEXT NOT NULL,
  session_id TEXT NOT NULL,
  device_type TEXT NOT NULL,
  traffic_source TEXT NOT NULL,
  user_agent TEXT,
  referrer TEXT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create analytics summary tables
CREATE TABLE public.analytics_daily (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  total_visits INTEGER NOT NULL DEFAULT 0,
  unique_visitors INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.analytics_weekly (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  week_start DATE NOT NULL UNIQUE,
  total_visits INTEGER NOT NULL DEFAULT 0,
  unique_visitors INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.analytics_monthly (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  month_start DATE NOT NULL UNIQUE,
  total_visits INTEGER NOT NULL DEFAULT 0,
  unique_visitors INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.analytics_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page TEXT NOT NULL UNIQUE,
  visit_count INTEGER NOT NULL DEFAULT 0,
  unique_visitors INTEGER NOT NULL DEFAULT 0,
  last_visit TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.analytics_sources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source TEXT NOT NULL UNIQUE,
  visit_count INTEGER NOT NULL DEFAULT 0,
  unique_visitors INTEGER NOT NULL DEFAULT 0,
  last_visit TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.analytics_devices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  device_type TEXT NOT NULL UNIQUE,
  visit_count INTEGER NOT NULL DEFAULT 0,
  unique_visitors INTEGER NOT NULL DEFAULT 0,
  last_visit TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.page_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_weekly ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_monthly ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_devices ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users only
CREATE POLICY "Allow authenticated users to view page_visits" ON public.page_visits FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to insert page_visits" ON public.page_visits FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated users to view analytics_daily" ON public.analytics_daily FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to view analytics_weekly" ON public.analytics_weekly FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to view analytics_monthly" ON public.analytics_monthly FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to view analytics_pages" ON public.analytics_pages FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to view analytics_sources" ON public.analytics_sources FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to view analytics_devices" ON public.analytics_devices FOR SELECT USING (auth.role() = 'authenticated');

-- Create indexes for better performance
CREATE INDEX idx_page_visits_timestamp ON public.page_visits(timestamp);
CREATE INDEX idx_page_visits_page ON public.page_visits(page);
CREATE INDEX idx_page_visits_session_id ON public.page_visits(session_id);
CREATE INDEX idx_page_visits_device_type ON public.page_visits(device_type);
CREATE INDEX idx_page_visits_traffic_source ON public.page_visits(traffic_source);

-- Create function to update analytics summaries
CREATE OR REPLACE FUNCTION public.update_analytics_summaries()
RETURNS TRIGGER AS $$
DECLARE
  visit_date DATE;
  week_start_date DATE;
  month_start_date DATE;
BEGIN
  visit_date := DATE(NEW.timestamp);
  week_start_date := DATE_TRUNC('week', NEW.timestamp)::DATE;
  month_start_date := DATE_TRUNC('month', NEW.timestamp)::DATE;

  -- Update daily analytics
  INSERT INTO public.analytics_daily (date, total_visits, unique_visitors)
  VALUES (visit_date, 1, 1)
  ON CONFLICT (date) DO UPDATE SET
    total_visits = analytics_daily.total_visits + 1,
    unique_visitors = (
      SELECT COUNT(DISTINCT session_id)
      FROM public.page_visits
      WHERE DATE(timestamp) = visit_date
    ),
    updated_at = now();

  -- Update weekly analytics
  INSERT INTO public.analytics_weekly (week_start, total_visits, unique_visitors)
  VALUES (week_start_date, 1, 1)
  ON CONFLICT (week_start) DO UPDATE SET
    total_visits = analytics_weekly.total_visits + 1,
    unique_visitors = (
      SELECT COUNT(DISTINCT session_id)
      FROM public.page_visits
      WHERE DATE(timestamp) >= week_start_date
        AND DATE(timestamp) < week_start_date + INTERVAL '7 days'
    ),
    updated_at = now();

  -- Update monthly analytics
  INSERT INTO public.analytics_monthly (month_start, total_visits, unique_visitors)
  VALUES (month_start_date, 1, 1)
  ON CONFLICT (month_start) DO UPDATE SET
    total_visits = analytics_monthly.total_visits + 1,
    unique_visitors = (
      SELECT COUNT(DISTINCT session_id)
      FROM public.page_visits
      WHERE DATE_TRUNC('month', timestamp) = month_start_date
    ),
    updated_at = now();

  -- Update page analytics
  INSERT INTO public.analytics_pages (page, visit_count, unique_visitors, last_visit)
  VALUES (NEW.page, 1, 1, NEW.timestamp)
  ON CONFLICT (page) DO UPDATE SET
    visit_count = analytics_pages.visit_count + 1,
    unique_visitors = (
      SELECT COUNT(DISTINCT session_id)
      FROM public.page_visits
      WHERE page = NEW.page
    ),
    last_visit = NEW.timestamp,
    updated_at = now();

  -- Update traffic source analytics
  INSERT INTO public.analytics_sources (source, visit_count, unique_visitors, last_visit)
  VALUES (NEW.traffic_source, 1, 1, NEW.timestamp)
  ON CONFLICT (source) DO UPDATE SET
    visit_count = analytics_sources.visit_count + 1,
    unique_visitors = (
      SELECT COUNT(DISTINCT session_id)
      FROM public.page_visits
      WHERE traffic_source = NEW.traffic_source
    ),
    last_visit = NEW.timestamp,
    updated_at = now();

  -- Update device analytics
  INSERT INTO public.analytics_devices (device_type, visit_count, unique_visitors, last_visit)
  VALUES (NEW.device_type, 1, 1, NEW.timestamp)
  ON CONFLICT (device_type) DO UPDATE SET
    visit_count = analytics_devices.visit_count + 1,
    unique_visitors = (
      SELECT COUNT(DISTINCT session_id)
      FROM public.page_visits
      WHERE device_type = NEW.device_type
    ),
    last_visit = NEW.timestamp,
    updated_at = now();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update analytics summaries
CREATE TRIGGER update_analytics_summaries_trigger
  AFTER INSERT ON public.page_visits
  FOR EACH ROW
  EXECUTE FUNCTION public.update_analytics_summaries();