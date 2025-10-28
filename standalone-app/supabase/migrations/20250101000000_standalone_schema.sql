-- Create tables for Gulf Unified Platform Standalone App
-- Using 'standalone_' prefix to avoid conflicts with main app

-- Chalets table
CREATE TABLE IF NOT EXISTS public.standalone_chalets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  country_code TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  default_price DECIMAL(10,2) NOT NULL,
  images TEXT[] DEFAULT '{}',
  provider_id TEXT,
  verified BOOLEAN DEFAULT false,
  amenities TEXT[] DEFAULT '{}',
  capacity INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Shipping carriers table
CREATE TABLE IF NOT EXISTS public.standalone_shipping_carriers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  country_code TEXT NOT NULL,
  services TEXT[] NOT NULL,
  contact TEXT,
  website TEXT,
  logo_path TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Providers table
CREATE TABLE IF NOT EXISTS public.standalone_providers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  country_code TEXT NOT NULL,
  verified BOOLEAN DEFAULT false,
  trust_score INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Links table (microsite links)
CREATE TABLE IF NOT EXISTS public.standalone_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  country_code TEXT NOT NULL,
  provider_id TEXT,
  payload JSONB NOT NULL,
  microsite_url TEXT NOT NULL,
  payment_url TEXT NOT NULL,
  signature TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Payments table
CREATE TABLE IF NOT EXISTS public.standalone_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id UUID REFERENCES public.standalone_links(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  otp TEXT,
  attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMPTZ,
  receipt_url TEXT,
  cardholder_name TEXT,
  last_four TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.standalone_chalets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.standalone_shipping_carriers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.standalone_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.standalone_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.standalone_payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Public read for microsites)
CREATE POLICY "Anyone can view standalone chalets" ON public.standalone_chalets FOR SELECT USING (true);
CREATE POLICY "Anyone can view standalone carriers" ON public.standalone_shipping_carriers FOR SELECT USING (true);
CREATE POLICY "Anyone can view standalone providers" ON public.standalone_providers FOR SELECT USING (true);
CREATE POLICY "Anyone can view standalone links" ON public.standalone_links FOR SELECT USING (true);
CREATE POLICY "Anyone can view standalone payments" ON public.standalone_payments FOR SELECT USING (true);

-- Insert policies for links and payments
CREATE POLICY "Anyone can create standalone links" ON public.standalone_links FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can create standalone payments" ON public.standalone_payments FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update standalone payments" ON public.standalone_payments FOR UPDATE USING (true);

-- Seed data - Chalets
INSERT INTO public.standalone_chalets (id, name, country_code, city, address, default_price, images, provider_id, verified, amenities, capacity) VALUES
('standalone-ae-001', 'Nakheel Beach Chalet', 'AE', 'Dubai', 'Jumeirah Beach', 350, ARRAY['/placeholder.svg'], 'standalone-prov-101', true, ARRAY['WiFi', 'Beach Access', 'BBQ Area', 'Pool'], 8),
('standalone-ae-002', 'Dubai Marina View', 'AE', 'Dubai', 'Dubai Marina', 450, ARRAY['/placeholder.svg'], 'standalone-prov-101', true, ARRAY['WiFi', 'City View', 'Pool', 'Gym'], 6),
('standalone-sa-001', 'Riyadh Desert Chalet', 'SA', 'Riyadh', 'AlUla', 450, ARRAY['/placeholder.svg'], 'standalone-prov-201', false, ARRAY['WiFi', 'Desert View', 'Campfire Area'], 10),
('standalone-sa-002', 'Jeddah Seaside Retreat', 'SA', 'Jeddah', 'North Obhur', 400, ARRAY['/placeholder.svg'], 'standalone-prov-201', true, ARRAY['Beach Access', 'Pool', 'BBQ Area', 'WiFi'], 12),
('standalone-kw-001', 'Kuwait Sea Chalet', 'KW', 'Kuwait City', 'Salmiya', 300, ARRAY['/placeholder.svg'], 'standalone-prov-301', true, ARRAY['Sea View', 'WiFi', 'Pool'], 8),
('standalone-qa-001', 'Doha Dunes Chalet', 'QA', 'Doha', 'The Pearl', 400, ARRAY['/placeholder.svg'], 'standalone-prov-401', true, ARRAY['WiFi', 'Pool', 'Beach Access', 'Restaurant'], 10),
('standalone-om-001', 'Muscat View Chalet', 'OM', 'Muscat', 'Qurum', 280, ARRAY['/placeholder.svg'], 'standalone-prov-501', false, ARRAY['Mountain View', 'WiFi', 'BBQ Area'], 6),
('standalone-bh-001', 'Bahrain Bay Chalet', 'BH', 'Manama', 'Seef', 320, ARRAY['/placeholder.svg'], 'standalone-prov-601', true, ARRAY['Bay View', 'WiFi', 'Pool', 'Gym'], 8)
ON CONFLICT (id) DO NOTHING;

-- Seed data - Shipping Carriers
INSERT INTO public.standalone_shipping_carriers (id, name, country_code, services, contact, website, logo_path) VALUES
('standalone-car-aramex', 'Aramex', 'AE', ARRAY['standard', 'express', 'cod'], '+971-4-XXXXXXX', 'https://www.aramex.com', '/placeholder.svg'),
('standalone-car-fedex-ae', 'FedEx', 'AE', ARRAY['express', 'standard'], '+971-4-XXXXXXX', 'https://www.fedex.com', '/placeholder.svg'),
('standalone-car-ups-ae', 'UPS', 'AE', ARRAY['express', 'standard'], '+971-4-XXXXXXX', 'https://www.ups.com', '/placeholder.svg'),
('standalone-car-dhl-sa', 'DHL', 'SA', ARRAY['express', 'standard'], '+966-11-XXXXXXX', 'https://www.dhl.com', '/placeholder.svg'),
('standalone-car-smsa', 'SMSA', 'SA', ARRAY['standard', 'express', 'cod'], '+966-11-XXXXXXX', 'https://www.smsaexpress.com', '/placeholder.svg'),
('standalone-car-zajil', 'Zajil', 'SA', ARRAY['standard', 'express'], '+966-XX-XXXXXXX', 'https://www.zajil.com', '/placeholder.svg'),
('standalone-car-naqel', 'Naqel', 'SA', ARRAY['standard', 'express', 'cod'], '+966-XX-XXXXXXX', 'https://www.naqel.com', '/placeholder.svg'),
('standalone-car-dhl-kw', 'DHL', 'KW', ARRAY['express', 'standard'], '+965-XXXXXXX', 'https://www.dhl.com', '/placeholder.svg'),
('standalone-car-qpost', 'Qatar Post', 'QA', ARRAY['standard'], '+974-XXXXXXX', 'https://www.qatarpost.qa', '/placeholder.svg'),
('standalone-car-omanpost', 'Oman Post', 'OM', ARRAY['standard'], '+968-XXXXXXX', 'https://www.post.om', '/placeholder.svg'),
('standalone-car-bahrainpost', 'Bahrain Post', 'BH', ARRAY['standard'], '+973-XXXXXXX', 'https://www.bahrainpost.gov.bh', '/placeholder.svg')
ON CONFLICT (id) DO NOTHING;

-- Seed data - Providers
INSERT INTO public.standalone_providers (id, name, type, country_code, verified, trust_score) VALUES
('standalone-prov-101', 'Dubai Properties', 'chalet', 'AE', true, 95),
('standalone-prov-201', 'Riyadh Estates', 'chalet', 'SA', true, 90),
('standalone-prov-301', 'Kuwait Leisure', 'chalet', 'KW', true, 92),
('standalone-prov-401', 'Doha Hospitality', 'chalet', 'QA', true, 94),
('standalone-prov-501', 'Muscat Retreats', 'chalet', 'OM', false, 85),
('standalone-prov-601', 'Bahrain Stays', 'chalet', 'BH', true, 93)
ON CONFLICT (id) DO NOTHING;