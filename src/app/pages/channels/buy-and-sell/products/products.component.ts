import { ActivatedRoute } from '@angular/router';
import { ToastService } from './../../../../services/toast.service';
import { ProductService } from './../../../../services/product.service';
import { Product } from './../../../../models/Product';
import { Component, OnInit } from '@angular/core';
import constants from 'src/app/helpers/constants';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {

  pageLoading = false;
  products: Product[];
  domain = constants.DOMAIN_URL;
  page: number;
  searchQuery: string;
  type: string;

  constructor(private productService: ProductService, private toastService: ToastService,
              private route: ActivatedRoute) { }

  ngOnInit() {}

  ionViewWillEnter(){
    this.pageLoading = true;
    this.searchQuery = "";
    this.page = 0;
    this.getPageType();
  }

  getPageType(){
    this.route.paramMap
    .subscribe(
      param => {
        this.type = param.get('type');
        this.getProducts(null);
      }
    )
  }

  search(){
    this.page = 0;
    this.getProducts(null);
  }

  handleResponse(event, resp: any){
    if(!event) this.products = [];

    resp.data.forEach(prd => {
      const product = new Product(prd);
      this.products.push(product);
    })

    if(event) event.target.complete();
    this.pageLoading = false;
    console.log(this.products);
  }

  handleError(err){
    console.log(err);
    this.pageLoading = false;
    this.toastService.presentErrorToastr(err);
  }

  getProducts(event){
    if(this.type == 'sell'){
      this.productService.posted(this.page++, this.searchQuery)
      .then(
        resp => this.handleResponse(event, resp),
        err => this.handleError(err)
      );
    }else{
      this.productService.available(this.page++, this.searchQuery)
      .then(
        resp => this.handleResponse(event, resp),
        err => this.handleError(err)
      );
    }

  }

}
