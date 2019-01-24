export interface AgencyServiceLevel {
  id?: string;
  name?: string;
  electronicFee?: number;
  paperFee?: number;
  stateCode?: string;
  serviceLevel?: string;
  agencyElectronicFeePercent?: number;
  agencyPaperFeePercent?: number;
  active?: boolean;
  activeChangeDate?: string;
  createdDate?:	string;
}
