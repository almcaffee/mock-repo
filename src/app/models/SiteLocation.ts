import { AddressInfo } from './AddressInfo';

export interface SiteLocation {
  id?: string;
  region?: string;
  company?: string;
  city?: string;
  state?: string;
  county?: string;
  mobile?: boolean;
  ahca?: boolean;
  phone?: string;
  hours?: string;
  address?: string;
  openDays?: string[];
}
