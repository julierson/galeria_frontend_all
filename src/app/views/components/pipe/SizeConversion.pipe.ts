import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'SIZE'
})
export class SizeConversionPipe implements PipeTransform {
  transform(value: number, targetUnit: string): string {
    if (isNaN(value)) {
      return '';
    }

    if (value === null || isNaN(value)) {
      return '0 B';
    }

    if (value < 1024) {
      return value + ' B';
    } else if (value < 1024 * 1024) {
      return (value / 1024).toFixed(2) + ' KB';
    } else if (value < 1024 * 1024 * 1024) {
      return (value / (1024 * 1024)).toFixed(2) + ' MB';
    } else {
      return (value / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
    }
  }
}
