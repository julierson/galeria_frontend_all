import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
@Pipe({
  name: 'DATA'
})
export class FormatarData implements PipeTransform {
  transform(value: Date, ...args: any[]): any {
    return new DatePipe('pt-BR').transform(value, 'dd/MM/yyyy');
  }
}
