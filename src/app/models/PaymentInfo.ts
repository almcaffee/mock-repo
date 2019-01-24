import { AddressInfo } from './AddressInfo';
import { CreditCardInfo } from './CreditCardInfo';

export interface PaymentInfo {
  amount?: number;
  paymentMethod?: string;
  paymentType?: string;
	creditCard?: CreditCardInfo;
	billingAddress?: AddressInfo;
  hashCC?: string;
  eCheck?: boolean;
  verifyTransaction?: string;
}
