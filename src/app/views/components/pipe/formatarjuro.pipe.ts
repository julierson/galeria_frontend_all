import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'JURO'
})
export class FormatarJuro implements PipeTransform {
  transform(value: string, ...args: any[]): any {
    value = value + '%';
    return value;
  }
}
