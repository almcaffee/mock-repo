import { AgencyServiceLevel } from './AgencyServiceLevel';
import { AgencySubGroup } from './AgencySubGroup';

export interface AgencyProfile {
  id?: string;
  stateCode?: string;
	agencyGroup?: string;
	agencySubGroups?: AgencySubGroup;
  agencyServiceLevels: AgencyServiceLevel;
}
