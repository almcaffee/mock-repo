import { AddressInfo } from './AddressInfo';

export interface PrintSite {
  active?:	boolean;
  activeChangeDate?: string;
  address?: AddressInfo;
  companyWebSiteUrl?: string;
  createdDate?:	number;
  id?: string;
  latitude?: number;
  longitude?: number;
  name?: string;
  operationHour?: string;
  schedulerSiteLink?: string;
  stateCode?: string;
}
