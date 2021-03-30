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



}
