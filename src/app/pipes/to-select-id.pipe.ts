import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toSelectId'
})
export class ToSelectIdPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value ? value.uid : null;
  }

}
