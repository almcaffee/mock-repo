import { AddressInfo } from './AddressInfo';
import { Reason } from './Reason';

export interface Agency {
  active?: boolean;
  activeChangeDate?: string;
  createdDate?:	number;
  alias?: string;
  email?: string;
  id?: string;
  name?: string;
	ori?: string;
  privacyId: string;
	stateCode?: string;
  status?: string;
  address?: AddressInfo;
  reasons?: Reason[];
}
