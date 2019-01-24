import { Pipe, PipeTransform } from '@angular/core';
import { AddressInfo } from '../models';

@Pipe({
  name: 'addressInline'
})
export class AddressInlinePipe implements PipeTransform {

  transform(value: AddressInfo, args?: string): any {
    // if(args) console.log(args)
    let inlineAddress: string = value.address1;
    if(value.address2) inlineAddress += ' '+value.address2;
    inlineAddress += ', '+value.city+' '+value.state+', '+value.zip;
    if(args && args === 'full') {
      return inlineAddress;
    } else if(inlineAddress.length > 75) {
      return inlineAddress.substr(0, 72)+'...';
    } else {
      return inlineAddress;
    }
  }

}
