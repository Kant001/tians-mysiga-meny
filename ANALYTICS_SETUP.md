# Analytics Setup för Tian's Grill Admin Panel

## Steg 1: Skapa Supabase-tabeller

Kör följande SQL i din Supabase SQL Editor för att skapa alla nödvändiga tabeller:

```sql
-- Create analytics tables for the admin panel

-- Table for storing individual page visits
CREATE TABLE page_visits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page TEXT NOT NULL,
    session_id TEXT NOT NULL,
    device_type TEXT NOT NULL CHECK (device_type IN ('mobile', 'tablet', 'desktop')),
    traffic_source TEXT NOT NULL,
    user_agent TEXT,
    referrer TEXT,
    ip_address INET,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table for daily analytics summary
CREATE TABLE analytics_daily (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL UNIQUE,
    unique_visitors INTEGER NOT NULL DEFAULT 0,
    page_views INTEGER NOT NULL DEFAULT 0,
    bounce_rate DECIMAL(5,2),
    avg_session_duration INTERVAL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table for weekly analytics summary
CREATE TABLE analytics_weekly (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    week_start DATE NOT NULL UNIQUE,
    unique_visitors INTEGER NOT NULL DEFAULT 0,
    page_views INTEGER NOT NULL DEFAULT 0,
    bounce_rate DECIMAL(5,2),
    avg_session_duration INTERVAL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table for monthly analytics summary
CREATE TABLE analytics_monthly (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    month_start DATE NOT NULL UNIQUE,
    unique_visitors INTEGER NOT NULL DEFAULT 0,
    page_views INTEGER NOT NULL DEFAULT 0,
    bounce_rate DECIMAL(5,2),
    avg_session_duration INTERVAL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table for page-specific analytics
CREATE TABLE analytics_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page TEXT NOT NULL UNIQUE,
    visits INTEGER NOT NULL DEFAULT 0,
    unique_visitors INTEGER NOT NULL DEFAULT 0,
    bounce_rate DECIMAL(5,2),
    avg_time_on_page INTERVAL,
    last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table for traffic source analytics
CREATE TABLE analytics_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source TEXT NOT NULL UNIQUE,
    visits INTEGER NOT NULL DEFAULT 0,
    unique_visitors INTEGER NOT NULL DEFAULT 0,
    conversion_rate DECIMAL(5,2),
    last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table for device analytics
CREATE TABLE analytics_devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device TEXT NOT NULL UNIQUE CHECK (device IN ('mobile', 'tablet', 'desktop')),
    visits INTEGER NOT NULL DEFAULT 0,
    unique_visitors INTEGER NOT NULL DEFAULT 0,
    bounce_rate DECIMAL(5,2),
    last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_page_visits_timestamp ON page_visits(timestamp);
CREATE INDEX idx_page_visits_session ON page_visits(session_id);
CREATE INDEX idx_page_visits_page ON page_visits(page);
CREATE INDEX idx_page_visits_device ON page_visits(device_type);
CREATE INDEX idx_page_visits_source ON page_visits(traffic_source);

-- Function to update analytics summaries
CREATE OR REPLACE FUNCTION update_analytics_summaries()
RETURNS TRIGGER AS $$
BEGIN
    -- Update daily analytics
    INSERT INTO analytics_daily (date, unique_visitors, page_views)
    VALUES (
        DATE(NEW.timestamp),
        1,
        1
    )
    ON CONFLICT (date) DO UPDATE SET
        unique_visitors = analytics_daily.unique_visitors + 
            CASE WHEN NOT EXISTS (
                SELECT 1 FROM page_visits 
                WHERE session_id = NEW.session_id 
                AND DATE(timestamp) = DATE(NEW.timestamp)
                AND id != NEW.id
            ) THEN 1 ELSE 0 END,
        page_views = analytics_daily.page_views + 1,
        updated_at = NOW();
    
    -- Update page analytics
    INSERT INTO analytics_pages (page, visits, unique_visitors)
    VALUES (
        NEW.page,
        1,
        1
    )
    ON CONFLICT (page) DO UPDATE SET
        visits = analytics_pages.visits + 1,
        unique_visitors = analytics_pages.unique_visitors + 
            CASE WHEN NOT EXISTS (
                SELECT 1 FROM page_visits 
                WHERE session_id = NEW.session_id 
                AND page = NEW.page
                AND id != NEW.id
            ) THEN 1 ELSE 0 END,
        last_updated = NOW();
    
    -- Update traffic source analytics
    INSERT INTO analytics_sources (source, visits, unique_visitors)
    VALUES (
        NEW.traffic_source,
        1,
        1
    )
    ON CONFLICT (source) DO UPDATE SET
        visits = analytics_sources.visits + 1,
        unique_visitors = analytics_sources.unique_visitors + 
            CASE WHEN NOT EXISTS (
                SELECT 1 FROM page_visits 
                WHERE session_id = NEW.session_id 
                AND traffic_source = NEW.traffic_source
                AND id != NEW.id
            ) THEN 1 ELSE 0 END,
        last_updated = NOW();
    
    -- Update device analytics
    INSERT INTO analytics_devices (device, visits, unique_visitors)
    VALUES (
        NEW.device_type,
        1,
        1
    )
    ON CONFLICT (device) DO UPDATE SET
        visits = analytics_devices.visits + 1,
        unique_visitors = analytics_devices.unique_visitors + 
            CASE WHEN NOT EXISTS (
                SELECT 1 FROM page_visits 
                WHERE session_id = NEW.session_id 
                AND device_type = NEW.device_type
                AND id != NEW.id
            ) THEN 1 ELSE 0 END,
        last_updated = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update analytics summaries
CREATE TRIGGER trigger_update_analytics_summaries
    AFTER INSERT ON page_visits
    FOR EACH ROW
    EXECUTE FUNCTION update_analytics_summaries();

-- Enable Row Level Security on all tables
ALTER TABLE page_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_weekly ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_monthly ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_devices ENABLE ROW LEVEL SECURITY;

-- Policies for page_visits (allow insert for anyone, select only for authenticated users)
CREATE POLICY "Allow anonymous inserts" ON page_visits
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated selects" ON page_visits
    FOR SELECT USING (auth.role() = 'authenticated');

-- Policies for analytics tables (read-only for authenticated users)
CREATE POLICY "Allow authenticated selects" ON analytics_daily
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated selects" ON analytics_weekly
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated selects" ON analytics_monthly
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated selects" ON analytics_pages
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated selects" ON analytics_sources
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated selects" ON analytics_devices
    FOR SELECT USING (auth.role() = 'authenticated');
```

## Steg 2: Skapa admin-användare

1. Gå till Authentication i din Supabase dashboard
2. Skapa en ny användare med e-post och lösenord
3. Denna användare kommer kunna logga in på `/admin`

## Steg 3: Uppdatera Supabase-konfiguration

Uppdatera `src/integrations/supabase/client.ts` med dina riktiga Supabase-uppgifter:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ditt-projekt-id.supabase.co'
const supabaseAnonKey = 'din-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

## Funktioner

### Automatisk tracking
- Systemet spårar automatiskt alla sidvisningar
- Session-baserad tracking för unika besökare
- Enhetsdetektering (mobil, surfplatta, dator)
- Trafikkälla-detektering

### Admin-panel funktioner
- Lösenordsskyddad inloggning
- Dashboard med realtidsstatistik
- Grafer och visualiseringar
- Responsiv design

### Analytics data
- Daglig, veckovis och månadsvis statistik
- Mest besökta sidor
- Trafikkällor (Google, Facebook, direkt, etc.)
- Enhetsstatistik
- Besökartrender

## Säkerhet

- Row Level Security är aktiverat på alla tabeller
- Endast autentiserade användare kan läsa analytics-data
- Anonyma användare kan endast skicka in besöksdata

## Prestandaoptimering

- Automatiska triggers uppdaterar sammanfattningstabeller
- Indexering för snabba queries
- Minimal påverkan på användarupplevelsen