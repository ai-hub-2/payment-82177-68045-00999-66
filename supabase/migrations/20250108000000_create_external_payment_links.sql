-- Create external_payment_links table
CREATE TABLE IF NOT EXISTS external_payment_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  external_id VARCHAR(8) UNIQUE NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('shipping', 'chalet')),
  country_code VARCHAR(2) NOT NULL,
  payload JSONB NOT NULL,
  external_url TEXT NOT NULL,
  payment_url TEXT NOT NULL,
  signature TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'expired')),
  expires_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_external_payment_links_external_id ON external_payment_links(external_id);
CREATE INDEX IF NOT EXISTS idx_external_payment_links_type ON external_payment_links(type);
CREATE INDEX IF NOT EXISTS idx_external_payment_links_country_code ON external_payment_links(country_code);
CREATE INDEX IF NOT EXISTS idx_external_payment_links_status ON external_payment_links(status);
CREATE INDEX IF NOT EXISTS idx_external_payment_links_created_at ON external_payment_links(created_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_external_payment_links_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER trigger_update_external_payment_links_updated_at
  BEFORE UPDATE ON external_payment_links
  FOR EACH ROW
  EXECUTE FUNCTION update_external_payment_links_updated_at();

-- Enable RLS (Row Level Security)
ALTER TABLE external_payment_links ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (adjust as needed for your security requirements)
CREATE POLICY "Allow all operations on external_payment_links" ON external_payment_links
  FOR ALL USING (true);