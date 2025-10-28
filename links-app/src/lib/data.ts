export interface Chalet {
  id: string;
  name: string;
  countryCode: string;
  city: string;
  address: string;
  defaultPrice: number;
  images: string[];
  providerId: string;
  verified: boolean;
  amenities?: string[];
  capacity?: number;
}

export interface ShippingCarrier {
  id: string;
  name: string;
  countryCode: string;
  services: string[];
  contact: string;
  website: string;
  logoPath: string;
}

export interface Provider {
  id: string;
  name: string;
  type: string;
  countryCode: string;
  verified: boolean;
  trustScore: number;
}

// Seed data - Chalets
export const CHALETS: Chalet[] = [
  {
    id: "ae-001",
    name: "Nakheel Beach Chalet",
    countryCode: "AE",
    city: "Dubai",
    address: "Jumeirah Beach",
    defaultPrice: 350,
    images: ["/placeholder.svg"],
    providerId: "prov-101",
    verified: true,
    amenities: ["WiFi", "Beach Access", "BBQ Area", "Pool"],
    capacity: 8,
  },
  {
    id: "ae-002",
    name: "Dubai Marina View",
    countryCode: "AE",
    city: "Dubai",
    address: "Dubai Marina",
    defaultPrice: 450,
    images: ["/placeholder.svg"],
    providerId: "prov-101",
    verified: true,
    amenities: ["WiFi", "City View", "Pool", "Gym"],
    capacity: 6,
  },
  {
    id: "sa-001",
    name: "Riyadh Desert Chalet",
    countryCode: "SA",
    city: "Riyadh",
    address: "AlUla",
    defaultPrice: 450,
    images: ["/placeholder.svg"],
    providerId: "prov-201",
    verified: false,
    amenities: ["WiFi", "Desert View", "Campfire Area"],
    capacity: 10,
  },
  {
    id: "sa-002",
    name: "Jeddah Seaside Retreat",
    countryCode: "SA",
    city: "Jeddah",
    address: "North Obhur",
    defaultPrice: 400,
    images: ["/placeholder.svg"],
    providerId: "prov-201",
    verified: true,
    amenities: ["Beach Access", "Pool", "BBQ Area", "WiFi"],
    capacity: 12,
  },
  {
    id: "kw-001",
    name: "Kuwait Sea Chalet",
    countryCode: "KW",
    city: "Kuwait City",
    address: "Salmiya",
    defaultPrice: 300,
    images: ["/placeholder.svg"],
    providerId: "prov-301",
    verified: true,
    amenities: ["Sea View", "WiFi", "Pool"],
    capacity: 8,
  },
  {
    id: "qa-001",
    name: "Doha Dunes Chalet",
    countryCode: "QA",
    city: "Doha",
    address: "The Pearl",
    defaultPrice: 400,
    images: ["/placeholder.svg"],
    providerId: "prov-401",
    verified: true,
    amenities: ["WiFi", "Pool", "Beach Access", "Restaurant"],
    capacity: 10,
  },
  {
    id: "om-001",
    name: "Muscat View Chalet",
    countryCode: "OM",
    city: "Muscat",
    address: "Qurum",
    defaultPrice: 280,
    images: ["/placeholder.svg"],
    providerId: "prov-501",
    verified: false,
    amenities: ["Mountain View", "WiFi", "BBQ Area"],
    capacity: 6,
  },
  {
    id: "bh-001",
    name: "Bahrain Bay Chalet",
    countryCode: "BH",
    city: "Manama",
    address: "Seef",
    defaultPrice: 320,
    images: ["/placeholder.svg"],
    providerId: "prov-601",
    verified: true,
    amenities: ["Bay View", "WiFi", "Pool", "Gym"],
    capacity: 8,
  },
];

// Seed data - Shipping Carriers
export const SHIPPING_CARRIERS: ShippingCarrier[] = [
  {
    id: "car-aramex",
    name: "Aramex",
    countryCode: "AE",
    services: ["standard", "express", "cod"],
    contact: "+971-4-XXXXXXX",
    website: "https://www.aramex.com",
    logoPath: "/placeholder.svg",
  },
  {
    id: "car-fedex-ae",
    name: "FedEx",
    countryCode: "AE",
    services: ["express", "standard"],
    contact: "+971-4-XXXXXXX",
    website: "https://www.fedex.com",
    logoPath: "/placeholder.svg",
  },
  {
    id: "car-ups-ae",
    name: "UPS",
    countryCode: "AE",
    services: ["express", "standard"],
    contact: "+971-4-XXXXXXX",
    website: "https://www.ups.com",
    logoPath: "/placeholder.svg",
  },
  {
    id: "car-dhl-sa",
    name: "DHL",
    countryCode: "SA",
    services: ["express", "standard"],
    contact: "+966-11-XXXXXXX",
    website: "https://www.dhl.com",
    logoPath: "/placeholder.svg",
  },
  {
    id: "car-smsa",
    name: "SMSA",
    countryCode: "SA",
    services: ["standard", "express", "cod"],
    contact: "+966-11-XXXXXXX",
    website: "https://www.smsaexpress.com",
    logoPath: "/placeholder.svg",
  },
  {
    id: "car-zajil",
    name: "Zajil",
    countryCode: "SA",
    services: ["standard", "express"],
    contact: "+966-XX-XXXXXXX",
    website: "https://www.zajil.com",
    logoPath: "/placeholder.svg",
  },
  {
    id: "car-naqel",
    name: "Naqel",
    countryCode: "SA",
    services: ["standard", "express", "cod"],
    contact: "+966-XX-XXXXXXX",
    website: "https://www.naqel.com",
    logoPath: "/placeholder.svg",
  },
  {
    id: "car-dhl-kw",
    name: "DHL",
    countryCode: "KW",
    services: ["express", "standard"],
    contact: "+965-XXXXXXX",
    website: "https://www.dhl.com",
    logoPath: "/placeholder.svg",
  },
  {
    id: "car-qpost",
    name: "Qatar Post",
    countryCode: "QA",
    services: ["standard"],
    contact: "+974-XXXXXXX",
    website: "https://www.qatarpost.qa",
    logoPath: "/placeholder.svg",
  },
  {
    id: "car-omanpost",
    name: "Oman Post",
    countryCode: "OM",
    services: ["standard"],
    contact: "+968-XXXXXXX",
    website: "https://www.post.om",
    logoPath: "/placeholder.svg",
  },
  {
    id: "car-bahrainpost",
    name: "Bahrain Post",
    countryCode: "BH",
    services: ["standard"],
    contact: "+973-XXXXXXX",
    website: "https://www.bahrainpost.gov.bh",
    logoPath: "/placeholder.svg",
  },
];

export const getChaletsByCountry = (countryCode: string): Chalet[] => {
  return CHALETS.filter((c) => c.countryCode === countryCode);
};

export const getCarriersByCountry = (countryCode: string): ShippingCarrier[] => {
  return SHIPPING_CARRIERS.filter((c) => c.countryCode === countryCode);
};

export const getChaletById = (id: string): Chalet | undefined => {
  return CHALETS.find((c) => c.id === id);
};
