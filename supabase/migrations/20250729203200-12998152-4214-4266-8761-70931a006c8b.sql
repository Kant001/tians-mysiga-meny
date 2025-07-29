-- Fix function search path security issue
CREATE OR REPLACE FUNCTION public.update_analytics_summaries()
RETURNS TRIGGER
SET search_path = ''
LANGUAGE plpgsql AS $$
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
    total_visits = public.analytics_daily.total_visits + 1,
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
    total_visits = public.analytics_weekly.total_visits + 1,
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
    total_visits = public.analytics_monthly.total_visits + 1,
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
    visit_count = public.analytics_pages.visit_count + 1,
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
    visit_count = public.analytics_sources.visit_count + 1,
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
    visit_count = public.analytics_devices.visit_count + 1,
    unique_visitors = (
      SELECT COUNT(DISTINCT session_id)
      FROM public.page_visits
      WHERE device_type = NEW.device_type
    ),
    last_visit = NEW.timestamp,
    updated_at = now();

  RETURN NEW;
END;
$$;