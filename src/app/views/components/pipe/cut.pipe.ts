import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'CUT' })
export class CutPipe implements PipeTransform {
    transform (value, wordwise, max, tail): any {

      value = value.substr(0, max);
      if (wordwise) {
          let lastspace = value.lastIndexOf(' ');
          if (lastspace !== -1) {
            // Also remove . and , so its gives a cleaner result.
            if (value.charAt(lastspace - 1) === '.' || value.charAt(lastspace - 1) === ',') {
              lastspace = lastspace - 1;
            }
            value = value.substr(0, lastspace);
          }
      }

      return value + (tail || ' …');
  }
}