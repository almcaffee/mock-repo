import { Reason } from './Reason';
import { AgencyServiceLevel } from './AgencyServiceLevel';

export interface TransactionInfo {
  reviewingAgencyId?: string;
  reviewingAgency?: string;
  requestingAgencyId?: string;
  reviewingAgencyServiceLevel?: AgencyServiceLevel;
  reason?: Reason;
	appliedPosition?: string;
	paymentType?: string;
  promotion?: string;
}
