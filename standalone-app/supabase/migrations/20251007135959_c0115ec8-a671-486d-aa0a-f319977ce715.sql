-- Create tables for Gulf Unified Platform

-- Chalets table
CREATE TABLE IF NOT EXISTS public.chalets (
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
CREATE TABLE IF NOT EXISTS public.shipping_carriers (
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
CREATE TABLE IF NOT EXISTS public.providers (
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
CREATE TABLE IF NOT EXISTS public.links (
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
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id UUID REFERENCES public.links(id) ON DELETE CASCADE,
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
ALTER TABLE public.chalets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_carriers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Public read for microsites)
CREATE POLICY "Anyone can view chalets" ON public.chalets FOR SELECT USING (true);
CREATE POLICY "Anyone can view carriers" ON public.shipping_carriers FOR SELECT USING (true);
CREATE POLICY "Anyone can view providers" ON public.providers FOR SELECT USING (true);
CREATE POLICY "Anyone can view links" ON public.links FOR SELECT USING (true);
CREATE POLICY "Anyone can view payments" ON public.payments FOR SELECT USING (true);

-- Insert policies for links and payments
CREATE POLICY "Anyone can create links" ON public.links FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can create payments" ON public.payments FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update payments" ON public.payments FOR UPDATE USING (true);

-- Seed data - Chalets
INSERT INTO public.chalets (id, name, country_code, city, address, default_price, images, provider_id, verified, amenities, capacity) VALUES
('ae-001', 'Nakheel Beach Chalet', 'AE', 'Dubai', 'Jumeirah Beach', 350, ARRAY['/placeholder.svg'], 'prov-101', true, ARRAY['WiFi', 'Beach Access', 'BBQ Area', 'Pool'], 8),
('ae-002', 'Dubai Marina View', 'AE', 'Dubai', 'Dubai Marina', 450, ARRAY['/placeholder.svg'], 'prov-101', true, ARRAY['WiFi', 'City View', 'Pool', 'Gym'], 6),
('sa-001', 'Riyadh Desert Chalet', 'SA', 'Riyadh', 'AlUla', 450, ARRAY['/placeholder.svg'], 'prov-201', false, ARRAY['WiFi', 'Desert View', 'Campfire Area'], 10),
('sa-002', 'Jeddah Seaside Retreat', 'SA', 'Jeddah', 'North Obhur', 400, ARRAY['/placeholder.svg'], 'prov-201', true, ARRAY['Beach Access', 'Pool', 'BBQ Area', 'WiFi'], 12),
('kw-001', 'Kuwait Sea Chalet', 'KW', 'Kuwait City', 'Salmiya', 300, ARRAY['/placeholder.svg'], 'prov-301', true, ARRAY['Sea View', 'WiFi', 'Pool'], 8),
('qa-001', 'Doha Dunes Chalet', 'QA', 'Doha', 'The Pearl', 400, ARRAY['/placeholder.svg'], 'prov-401', true, ARRAY['WiFi', 'Pool', 'Beach Access', 'Restaurant'], 10),
('om-001', 'Muscat View Chalet', 'OM', 'Muscat', 'Qurum', 280, ARRAY['/placeholder.svg'], 'prov-501', false, ARRAY['Mountain View', 'WiFi', 'BBQ Area'], 6),
('bh-001', 'Bahrain Bay Chalet', 'BH', 'Manama', 'Seef', 320, ARRAY['/placeholder.svg'], 'prov-601', true, ARRAY['Bay View', 'WiFi', 'Pool', 'Gym'], 8)
ON CONFLICT (id) DO NOTHING;

-- Seed data - Shipping Carriers
INSERT INTO public.shipping_carriers (id, name, country_code, services, contact, website, logo_path) VALUES
('car-aramex', 'Aramex', 'AE', ARRAY['standard', 'express', 'cod'], '+971-4-XXXXXXX', 'https://www.aramex.com', '/placeholder.svg'),
('car-fedex-ae', 'FedEx', 'AE', ARRAY['express', 'standard'], '+971-4-XXXXXXX', 'https://www.fedex.com', '/placeholder.svg'),
('car-ups-ae', 'UPS', 'AE', ARRAY['express', 'standard'], '+971-4-XXXXXXX', 'https://www.ups.com', '/placeholder.svg'),
('car-dhl-sa', 'DHL', 'SA', ARRAY['express', 'standard'], '+966-11-XXXXXXX', 'https://www.dhl.com', '/placeholder.svg'),
('car-smsa', 'SMSA', 'SA', ARRAY['standard', 'express', 'cod'], '+966-11-XXXXXXX', 'https://www.smsaexpress.com', '/placeholder.svg'),
('car-zajil', 'Zajil', 'SA', ARRAY['standard', 'express'], '+966-XX-XXXXXXX', 'https://www.zajil.com', '/placeholder.svg'),
('car-naqel', 'Naqel', 'SA', ARRAY['standard', 'express', 'cod'], '+966-XX-XXXXXXX', 'https://www.naqel.com', '/placeholder.svg'),
('car-dhl-kw', 'DHL', 'KW', ARRAY['express', 'standard'], '+965-XXXXXXX', 'https://www.dhl.com', '/placeholder.svg'),
('car-qpost', 'Qatar Post', 'QA', ARRAY['standard'], '+974-XXXXXXX', 'https://www.qatarpost.qa', '/placeholder.svg'),
('car-omanpost', 'Oman Post', 'OM', ARRAY['standard'], '+968-XXXXXXX', 'https://www.post.om', '/placeholder.svg'),
('car-bahrainpost', 'Bahrain Post', 'BH', ARRAY['standard'], '+973-XXXXXXX', 'https://www.bahrainpost.gov.bh', '/placeholder.svg')
ON CONFLICT (id) DO NOTHING;

-- Seed data - Providers
INSERT INTO public.providers (id, name, type, country_code, verified, trust_score) VALUES
('prov-101', 'Dubai Properties', 'chalet', 'AE', true, 95),
('prov-201', 'Riyadh Estates', 'chalet', 'SA', true, 90),
('prov-301', 'Kuwait Leisure', 'chalet', 'KW', true, 92),
('prov-401', 'Doha Hospitality', 'chalet', 'QA', true, 94),
('prov-501', 'Muscat Retreats', 'chalet', 'OM', false, 85),
('prov-601', 'Bahrain Stays', 'chalet', 'BH', true, 93)
ON CONFLICT (id) DO NOTHING;