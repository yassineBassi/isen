import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'extractDate'
})
export class ExtractDatePipe implements PipeTransform {

  transform(value: string): string {
    if(value) return value.slice(0, 10)
    return value
  }

}
