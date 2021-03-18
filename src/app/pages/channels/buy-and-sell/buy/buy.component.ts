import { ToastService } from './../../../../services/toast.service';
import { ProductService } from './../../../../services/product.service';
import { Product } from './../../../../models/Product';
import { Component, OnInit } from '@angular/core';
import constants from 'src/app/helpers/constants';

@Component({
  selector: 'app-buy',
  templateUrl: './buy.component.html',
  styleUrls: ['./buy.component.scss'],
})
export class BuyComponent implements OnInit {

  pageLoading = false;
  products: Product[];
  domain = constants.DOMAIN_URL;
  page;
  searchQuery;

  constructor(private productService: ProductService, private toastService: ToastService) { }

  ngOnInit() {}

  ionViewWillEnter(){
    this.pageLoading = true;
    this.searchQuery = "";
    this.page = 0;
    this.getProducts(null);
  }

  search(){
    this.page = 0;
    this.getProducts(null);
  }

  getProducts(event){
    console.log(event);
    this.productService.index(this.page++, this.searchQuery)
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
