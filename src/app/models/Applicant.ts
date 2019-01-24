import { AddressInfo } from './AddressInfo';
import { PaymentInfo } from './PaymentInfo';
import { PersonInfo } from './PersonInfo';
import { TransactionInfo } from './TransactionInfo';

export interface Applicant {
  id?: string;
  confirmation?: string;
  name?: string;
  qrCode?: string;
  status?: string;
  subStatus?: string;
  stateCode?: string;
  transaction: TransactionInfo;
  person?: PersonInfo;
  address?: AddressInfo;
  payment?: PaymentInfo;
}
