import { ToastService } from './../../../../services/toast.service';
import { Product } from './../../../../models/Product';
import { ProductService } from './../../../../services/product.service';
import { Component, OnInit } from '@angular/core';
import constants from 'src/app/helpers/constants';

@Component({
  selector: 'app-sell',
  templateUrl: './sell.component.html',
  styleUrls: ['./sell.component.scss'],
})
export class SellComponent implements OnInit {

  pageLoading = false;
  products: Product[];
  domain = constants.DOMAIN_URL;
  page = 0;

  constructor(private productService: ProductService, private toastService: ToastService) { }

  ngOnInit() {}

  ionViewWillEnter(){
    this.getProducts(null);
  }

  getProducts(event){
    console.log(event);
    if(!event) this.pageLoading = true;
    this.productService.index(this.page++)
    .then(
      (resp: any) => {
        if(!event) this.products = [];

        resp.data.forEach(prd => {
          const product = new Product(prd);
          this.products.push(product);
        })
        if(event) event.target.complete();
        this.pageLoading = false;
        console.log(this.products);
      },
      err => {
        console.log(err);
        this.pageLoading = false;
        this.toastService.presentErrorToastr(err);
      }
    )
  }

}
