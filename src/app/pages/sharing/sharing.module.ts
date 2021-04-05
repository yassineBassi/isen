import { ListSearchComponent } from './../list-search/list-search.component';
import { LoaderComponent } from './../loader/loader.component';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from './../header/header.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [
    HeaderComponent,
    LoaderComponent,
    ListSearchComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    HeaderComponent,
    LoaderComponent,
    ListSearchComponent
  ]
})
export class SharingModule { }
