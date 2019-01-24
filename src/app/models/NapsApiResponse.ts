import { Error } from './Error';

export interface NapsApiResponse {
  errorCode?: string;
  errors?: Error[];
  message?: string;
  result?: any | any[];
  jwt?: string;
}
