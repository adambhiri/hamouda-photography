
import { Pack, Booking, Slide, ContactInfo, User } from '../types.ts';

const STORAGE_KEYS = {
  PACKS: 'hamouda_packs',
  BOOKINGS: 'hamouda_bookings',
  SLIDES: 'hamouda_slides',
  CONTACT: 'hamouda_contact',
  USERS: 'hamouda_users'
};

export const storage = {
  save: (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  },
  load: <T>(key: string, defaultValue: T): T => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  },
  clear: () => localStorage.clear()
};

export { STORAGE_KEYS };
