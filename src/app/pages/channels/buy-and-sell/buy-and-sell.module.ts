import { Camera } from '@ionic-native/camera/ngx';
import { ProductComponent } from './product/product.component';
import { ProductFormComponent } from './product-form/product-form.component';
import { SharingModule } from './../../sharing/sharing.module';
import { SelectComponent } from './select/select.component';
import { SellComponent } from './sell/sell.component';
import { BuyComponent } from './buy/buy.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BuyAndSellPageRoutingModule } from './buy-and-sell-routing.module';

import { BuyAndSellPage } from './buy-and-sell.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
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
    Camera
  ]
})
export class BuyAndSellPageModule {}
