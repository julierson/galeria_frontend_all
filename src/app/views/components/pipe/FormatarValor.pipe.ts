import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'VALOR'
})
export class FormatarValor implements PipeTransform {
  transform(value: number, ...args: any[]): any {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  }
}
