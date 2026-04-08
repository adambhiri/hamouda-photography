
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  phone?: string;
}

export interface Pack {
  id: string;
  name: string;
  price: string;
  features: string[];
  popularity: boolean;
}

export interface Booking {
  id: number | string; // Khalliha te9bel zouz
  user_id?: string; // Salla7na hethi
  clientName: string; // SALLA7NA HETHI
  date: string;
  time?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  pack_id?: string; // Salla7na hethi
  description?: string; 
  team: string;
  priceOverride?: string;
}

export type PortfolioType = 'image' | 'video';

export interface PortfolioItem {
  id: number;
  url: string;
  thumbnail?: string;
  category: string;
  type: PortfolioType;
  title?: string;
  width?: number; // Optional execution for grid layout
  height?: number; // Optional execution for grid layout
}

export interface Slide {
  id: string;
  url: string;
  title: string;
  posY?: number;
}

export interface ContactInfo {
  phone: string;
  instagram: string;
  facebook: string;
  email: string;
}

