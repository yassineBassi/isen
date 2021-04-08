import { ExtractDiffTimePipe } from './../extract-diff-time.pipe';
import { ExtractDatePipe } from './../extract-date.pipe';
import { ExtractTimePipe } from '../extract-time.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    ExtractTimePipe,
    ExtractDatePipe,
    ExtractDiffTimePipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ExtractTimePipe,
    ExtractDatePipe,
    ExtractDiffTimePipe
  ]
})
export class SharingPipeModule { }
