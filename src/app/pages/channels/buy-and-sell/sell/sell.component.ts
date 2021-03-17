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
  url = constants.DOMAIN_URL;

  constructor(private productService: ProductService, private toastService: ToastService) { }

  ngOnInit() {}

  ionViewWillEnter(){
    this.getProducts();
  }

  getProducts(){
    this.pageLoading = true;
    this.productService.index()
    .then(
      (resp: any) => {
        console.log(resp);
        this.products = [];
        resp.data.forEach(prd => {
          const product = new Product();
          product.initialize(prd);
          this.products.push(product);
        })
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
