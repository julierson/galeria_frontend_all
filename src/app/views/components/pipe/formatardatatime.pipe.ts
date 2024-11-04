import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
@Pipe({
  name: 'DATATIME'
})
export class FormatarDataTime implements PipeTransform {
  transform(value: Date, ...args: any[]): any {
    return new DatePipe('pt-BR').transform(value, 'dd/MM/yyyy HH:mm:ss');
  }
}
