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
  page;
  searchQuery;

  constructor(private productService: ProductService, private toastService: ToastService) { }

  ngOnInit() {}

}
