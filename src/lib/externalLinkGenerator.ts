import { supabase } from "@/integrations/supabase/client";

export interface ExternalPaymentLink {
  id: string;
  externalId: string;
  type: 'shipping' | 'chalet';
  countryCode: string;
  payload: any;
  externalUrl: string;
  paymentUrl: string;
  signature: string;
  status: 'active' | 'inactive' | 'expired';
  expiresAt?: string;
  createdAt: string;
  metadata?: {
    title?: string;
    description?: string;
    amount?: number;
    currency?: string;
  };
}

export interface CreateExternalLinkData {
  type: 'shipping' | 'chalet';
  countryCode: string;
  payload: any;
  expiresInDays?: number;
  metadata?: {
    title?: string;
    description?: string;
    amount?: number;
    currency?: string;
  };
}

/**
 * Generate a unique external ID for payment links
 * This creates a shorter, more user-friendly ID than UUID
 */
export function generateExternalId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Create a secure signature for external links
 */
export function createExternalSignature(payload: any, externalId: string): string {
  const data = JSON.stringify({ payload, externalId, timestamp: Date.now() });
  return btoa(encodeURIComponent(data));
}

/**
 * Verify external link signature
 */
export function verifyExternalSignature(signature: string, payload: any, externalId: string): boolean {
  try {
    const decoded = decodeURIComponent(atob(signature));
    const data = JSON.parse(decoded);
    return data.externalId === externalId && JSON.stringify(data.payload) === JSON.stringify(payload);
  } catch {
    return false;
  }
}

/**
 * Create an external payment link
 */
export async function createExternalPaymentLink(data: CreateExternalLinkData): Promise<ExternalPaymentLink> {
  const externalId = generateExternalId();
  const signature = createExternalSignature(data.payload, externalId);
  
  // Calculate expiration date
  const expiresAt = data.expiresInDays 
    ? new Date(Date.now() + data.expiresInDays * 24 * 60 * 60 * 1000).toISOString()
    : undefined;

  // Generate external URLs
  const baseUrl = window.location.origin;
  const externalUrl = `${baseUrl}/external/${externalId}`;
  const paymentUrl = `${baseUrl}/external/pay/${externalId}`;

  const linkData = {
    external_id: externalId,
    type: data.type,
    country_code: data.countryCode,
    payload: data.payload,
    external_url: externalUrl,
    payment_url: paymentUrl,
    signature,
    status: 'active' as const,
    expires_at: expiresAt,
    metadata: data.metadata || {}
  };

  const { data: result, error } = await (supabase as any)
    .from('external_payment_links')
    .insert(linkData)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create external payment link: ${error.message}`);
  }

  return {
    id: result.id,
    externalId: result.external_id,
    type: result.type,
    countryCode: result.country_code,
    payload: result.payload,
    externalUrl: result.external_url,
    paymentUrl: result.payment_url,
    signature: result.signature,
    status: result.status,
    expiresAt: result.expires_at,
    createdAt: result.created_at,
    metadata: result.metadata
  };
}

/**
 * Get external payment link by external ID
 */
export async function getExternalPaymentLink(externalId: string): Promise<ExternalPaymentLink | null> {
  const { data, error } = await (supabase as any)
    .from('external_payment_links')
    .select('*')
    .eq('external_id', externalId)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    externalId: data.external_id,
    type: data.type,
    countryCode: data.country_code,
    payload: data.payload,
    externalUrl: data.external_url,
    paymentUrl: data.payment_url,
    signature: data.signature,
    status: data.status,
    expiresAt: data.expires_at,
    createdAt: data.created_at,
    metadata: data.metadata
  };
}

/**
 * Update external payment link status
 */
export async function updateExternalLinkStatus(
  externalId: string, 
  status: 'active' | 'inactive' | 'expired'
): Promise<void> {
  const { error } = await (supabase as any)
    .from('external_payment_links')
    .update({ status })
    .eq('external_id', externalId);

  if (error) {
    throw new Error(`Failed to update link status: ${error.message}`);
  }
}

/**
 * Check if external link is expired
 */
export function isLinkExpired(link: ExternalPaymentLink): boolean {
  if (!link.expiresAt) return false;
  return new Date(link.expiresAt) < new Date();
}

/**
 * Get all external payment links (for management)
 */
export async function getAllExternalLinks(): Promise<ExternalPaymentLink[]> {
  const { data, error } = await (supabase as any)
    .from('external_payment_links')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch external links: ${error.message}`);
  }

  return data.map((item: any) => ({
    id: item.id,
    externalId: item.external_id,
    type: item.type,
    countryCode: item.country_code,
    payload: item.payload,
    externalUrl: item.external_url,
    paymentUrl: item.payment_url,
    signature: item.signature,
    status: item.status,
    expiresAt: item.expires_at,
    createdAt: item.created_at,
    metadata: item.metadata
  }));
}

/**
 * Delete external payment link
 */
export async function deleteExternalLink(externalId: string): Promise<void> {
  const { error } = await (supabase as any)
    .from('external_payment_links')
    .delete()
    .eq('external_id', externalId);

  if (error) {
    throw new Error(`Failed to delete external link: ${error.message}`);
  }
}