import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'NOME'
})
export class FormatarNome implements PipeTransform {
  transform(value: String, ...args: any[]): any {
    if(value != null)
    return value.toLowerCase().replace(/(?:^|\s)\S/g, function(a) {
      return a.toUpperCase();
    });
  }
}
