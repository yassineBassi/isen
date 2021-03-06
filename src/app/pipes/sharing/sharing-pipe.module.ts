import { ExtractTimePipe } from '../extract-time.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [
    ExtractTimePipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ExtractTimePipe
  ]
})
export class SharingPipeModule { }
