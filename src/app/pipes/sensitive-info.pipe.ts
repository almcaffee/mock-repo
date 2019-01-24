import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sensitiveInfo'
})
export class SensitiveInfoPipe implements PipeTransform {

  transform(value: string, format?: string): any {
    if(value) {
      let hiddenInfo: string = '';
      let valArr: any[] = [];
      let mask: string = '*';
      let maskAll = format && format === 'all' ? true : false;
      let length = maskAll ? value.length : 1;

      if(value && format && format === 'date') {
        return 'XX/XX/XXXX';
      } else if(value && format && format === 'all') {
        for(let i = 0; i < length; i++) hiddenInfo += mask;
        return hiddenInfo;
      } else if(value && format && format === 'long') {
        for(let i = 0; i < value.length - 4; i++) hiddenInfo += mask;
        hiddenInfo += value.substr(value.length - 4);
        return hiddenInfo;
      } else {
        hiddenInfo = '*'+value.substr(value.length - 4);
        return hiddenInfo;
      }
    } else {
      return 'N/A';
    }
  }
}
