import constants from 'src/app/helpers/constants';
import { ToastService } from './../../../../services/toast.service';
import { ProductService } from './../../../../services/product.service';
import { Product } from './../../../../models/Product';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Route, Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {

  pageLoading = false;
  product: Product
  productId: string;
  domain = constants.DOMAIN_URL;
  page: number = 1;

  constructor(private productService: ProductService, private route: ActivatedRoute,
              private toastService: ToastService) { }

  ngOnInit() {}

  ionViewWillEnter(){
    this.getProductId();
  }

  getProductId(){
    this.route.paramMap
    .subscribe(
      params => {
        this.productId = params.get('id');
        this.getProduct();
      }
    )
  }

  getProduct(){
    this.pageLoading = true;
    this.productService.get(this.productId)
    .then(
      (resp: any) => {
        this.pageLoading = false;
        this.product = new Product(resp.data);
        this.page++;
        console.log(this.product);
      },
      err => {
        this.pageLoading = false;
        console.log(err);
        this.toastService.presentErrorToastr(err)
      }
    )
  }
}
