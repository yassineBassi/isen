import { FilePath } from '@ionic-native/file-path/ngx';
import { File } from '@ionic-native/file/ngx';
import { UploadFileService } from './../../../services/upload-file.service';
import { Camera } from '@ionic-native/camera/ngx';
import { ProductComponent } from './product/product.component';
import { ProductFormComponent } from './product-form/product-form.component';
import { SharingModule } from './../../sharing/sharing.module';
import { SelectComponent } from './select/select.component';
import { SellComponent } from './sell/sell.component';
import { BuyComponent } from './buy/buy.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BuyAndSellPageRoutingModule } from './buy-and-sell-routing.module';

import { BuyAndSellPage } from './buy-and-sell.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    BuyAndSellPageRoutingModule,
    SharingModule
  ],
  declarations: [
    BuyAndSellPage,
    BuyComponent,
    SellComponent,
    SelectComponent,
    ProductFormComponent,
    ProductComponent
  ],
  providers: [
    Camera,
    FormBuilder,
    UploadFileService,
    File,
    FilePath
  ]
})
export class BuyAndSellPageModule {}
