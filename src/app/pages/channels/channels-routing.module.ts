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
        path: 'small-business',
        loadChildren: () => import('./small-business/small-business.module').then( m => m.SmallBusinessPageModule)
      },
      {
        path: 'buy-and-sell',
        loadChildren: () => import('./buy-and-sell/buy-and-sell.module').then( m => m.BuyAndSellPageModule)
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChannelsPageRoutingModule {}
