import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'method'
})
export class MethodPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if(value) {
      let arr = value.split('_');
      let arr2: string[] = [];
      arr.forEach(v=> {
        let vv = v.charAt(0)+v.substr(1).toLowerCase();
        arr2.push(vv);
      });
      return arr2.join(' ');
    } else {
      return null;
    }
  }

}
