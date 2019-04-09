import * as moment from 'moment';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fromNow',
  pure: false
})
export class FromNowPipe implements PipeTransform {

  transform(value: number | null, args?: any): any {
    if (value == null) {
      return 'N/A';
    }
    return moment.unix(value).fromNow();
  }

}
