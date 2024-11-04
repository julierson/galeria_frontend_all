import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'TELEFONE'
})
export class FormatarTelefone implements PipeTransform {
  transform(value: string, ...args: any[]): any {
    if (value !== null) {

      if (value.length === 11) {
        return value.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/g, '(\$1\) \$2\ \$3\-\$4');
      }
    }
    return value;
  }
}
