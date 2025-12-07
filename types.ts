
export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export interface Yishuv {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  long_description: string;
  region: string;
  main_image: string;
  gallery: string[];
  map_location: Location;
  synagogues: string[];
  mikve: ('נשים' | 'גברים' | 'כלים')[];
  gmach: boolean;
  playgrounds: boolean;
  grass_area: boolean;
  // Old fields kept for backward compatibility if needed, but we are moving to arrays below
  attractions_nearby: string; 
  supermarket_nearby: string;
  public_transport: string;
  
  // New structured fields
  nearby_hikes?: string[];
  nearby_graves?: string[];
  nearby_attractions?: string[];
  nearby_restaurants?: string[];

  created_at: string;
}

export interface StoredCard {
  token: string;
  last4: string;
  brand: 'visa' | 'mastercard' | 'amex' | 'isracard';
  exp_month: string;
  exp_year: string;
  holder_name: string;
}

export interface Unit {
  id: string;
  yishuv_id: string;
  name: string;
  description: string;
  address: string;
  main_image: string;
  gallery: string[];
  
  // Living & Kitchen
  living_room: boolean;
  extra_mattresses: number;
  bookshelf_kodesh: boolean;
  kitchen: boolean;
  kitchen_details: string[]; // "כיור חלבי","כיור בשרי", etc.
  dining_area: boolean;
  table_count: number;
  chair_count: number;

  // Rooms & Bath
  rooms: number;
  room_description: string;
  ac: boolean;
  bathrooms: string[];

  // Extras
  wifi: boolean;
  tv: boolean;
  baby_crib: boolean;
  shabbat_equipment: string[];
  yard: boolean;
  pool: boolean;
  jacuzzi: boolean;
  sport_facilities: boolean;
  kids_games: boolean;

  // Availability & Location
  availability: string[];
  map_location: Location;

  // Payment & Contact
  payment_terms: string;
  payment_methods: string[];
  whatsapp_link: string;
  phone_number: string;
  website_link: string;

  // Counters
  page_views: number;
  total_clicks: number;
  clicks_whatsapp: number;
  clicks_phone: number;
  clicks_website: number;

  // Billing
  last_payment_date?: string;
  created_at: string;
  credit_card?: StoredCard;
}

export type LeadType = 'WhatsApp' | 'Phone' | 'Website';

export interface Lead {
  id: string;
  unit_id: string;
  affiliate_id?: string; // New: attribution
  type: LeadType;
  timestamp: string;
  ip_address: string;
  device: string;
  cost: number;
}

export interface InvoiceSummary {
  id: string;
  unit_id: string;
  month: string; // YYYY-MM-01
  leads_count: number;
  total_cost: number;
  status: 'Pending' | 'Paid';
  invoice_url?: string;
  payment_method?: string;
}

export interface KPI {
  totalLeads: number;
  whatsapp: number;
  phone: number;
  website: number;
  revenue: number;
}

export interface Affiliate {
  id: string;
  name: string;
  code: string; // The slug used in ?aff=code
  phone: string;
  total_views: number;
  total_leads: number;
  created_at: string;
}
