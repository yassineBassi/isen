import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'extractDate'
})
export class ExtractDatePipe implements PipeTransform {

  transform(value: string): string {
    if(value) return value.slice(3, 10).split(' ').reverse().join(' ') + value.slice(10, 15)
    return value
  }

}
