import { ProductComponent } from './product/product.component';
import { SellComponent } from './sell/sell.component';
import { BuyComponent } from './buy/buy.component';
import { HomeComponent } from './home/home.component';
import { BuyAndSellComponent } from './buy-and-sell/buy-and-sell.component';
import { SmallBusinessComponent } from './small-business/small-business.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChannelsPageRoutingModule } from './channels-routing.module';

import { ChannelsPage } from './channels.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChannelsPageRoutingModule
  ],
  declarations: [
    ChannelsPage,
    SmallBusinessComponent,
    BuyAndSellComponent,
    HomeComponent,
    BuyComponent,
    SellComponent,
    ProductComponent
  ]
})
export class ChannelsPageModule {}
