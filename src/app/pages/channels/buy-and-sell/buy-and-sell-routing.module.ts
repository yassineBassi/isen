import { ProductFormComponent } from './product-form/product-form.component';
import { ProductComponent } from './product/product.component';
import { SelectComponent } from './select/select.component';
import { SellComponent } from './sell/sell.component';
import { BuyComponent } from './buy/buy.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BuyAndSellPage } from './buy-and-sell.page';

const routes: Routes = [
  {
    path: '',
    component: BuyAndSellPage,
    children: [
      {
        path: '',
        redirectTo: 'select',
        pathMatch: 'full'
      },
      {
        path: 'select',
        component: SelectComponent
      },
      {
        path: 'buy',
        component: BuyComponent
      },
      {
        path: 'sell',
        component: SellComponent
      },
      {
        path: 'product/:id',
        component: ProductComponent
      },
      {
        path: 'product/form',
        component: ProductFormComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BuyAndSellPageRoutingModule {}
