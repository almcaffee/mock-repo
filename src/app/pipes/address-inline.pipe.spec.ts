import { AddressInlinePipe } from './address-inline.pipe';
import { AddressInfo } from '../models';

describe('AddressInlinePipe', () => {

  let address: AddressInfo = {
    address1:"12345 Any Street",
    address2:null,
  	city:"Macon",
   	suite:null,
  	state:"GA",
  	zip:"00000"
  };

  let adressInline = '12345 Any Street, Macon GA 00000';


  it('create an instance', () => {
    const pipe = new AddressInlinePipe();
    expect(pipe).toBeTruthy();
  });

  it('should return address as string', () => {
    const pipe = new AddressInlinePipe();
    let inlineAddress = pipe.transform(address);
    expect(inlineAddress).toEqual('12345 Any Street, Macon GA, 00000');
  });
});
