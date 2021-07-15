import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubscriptionPageRoutingModule } from './subscription-routing.module';

import { SubscriptionPage } from './subscription.page';
import { SharingModule } from '../sharing/sharing.module';
import { PaymentComponent } from './payment/payment.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubscriptionPageRoutingModule,
    SharingModule
  ],
  declarations: [
    SubscriptionPage,
    PaymentComponent
  ]
})
export class SubscriptionPageModule {}
