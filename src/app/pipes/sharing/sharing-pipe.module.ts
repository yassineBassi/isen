import { ExtractDatePipe } from './../extract-date.pipe';
import { ExtractTimePipe } from '../extract-time.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [
    ExtractTimePipe,
    ExtractDatePipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ExtractTimePipe,
    ExtractDatePipe
  ]
})
export class SharingPipeModule { }
