import { SellComponent } from './sell/sell.component';
import { BuyComponent } from './buy/buy.component';
import { BuyAndSellComponent } from './buy-and-sell/buy-and-sell.component';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChannelsPage } from './channels.page';

const routes: Routes = [
  {
    path: '',
    component: ChannelsPage,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'buy-and-sell',
        component: BuyAndSellComponent
      },
      {
        path: 'small-business',
        component: BuyAndSellComponent
      },
      {
        path: 'buy',
        component: BuyComponent
      },
      {
        path: 'sell',
        component: SellComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChannelsPageRoutingModule {}
