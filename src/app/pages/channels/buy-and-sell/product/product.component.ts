import { User } from './../../../../models/User';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import constants from 'src/app/helpers/constants';
import { ToastService } from './../../../../services/toast.service';
import { ProductService } from './../../../../services/product.service';
import { Product } from './../../../../models/Product';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Route, Router, ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';

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
  user: User;

  constructor(private productService: ProductService, private route: ActivatedRoute,
              private toastService: ToastService, private alertCtrl: AlertController,
              private router: Router, private nativeStorage: NativeStorage) { }

  ngOnInit() {}

  ionViewWillEnter(){
    this.getProductId();
  }

  getProductId(){
    this.route.paramMap
    .subscribe(
      params => {
        this.productId = params.get('id');
        this.nativeStorage.getItem('user')
        .then(
          user => {
            this.user = new User(user)
            this.getProduct();
          }
        )
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

  removeProduct(){
    this.productService.remove(this.product.id)
    .then(
      (resp: any) => {
        console.log(resp);
        this.toastService.presentSuccessToastr(resp.message);
        this.router.navigateByUrl('/channels/buy-and-sell/products/sell')
      },
      err => {
        console.log(err);
        this.toastService.presentErrorToastr(err);
      }
    )
  }

  async removeConfirmation(){
    const alert = await this.alertCtrl.create({
      message: 'Do you really want to delete this product ?',
      header: 'Delete Product',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Yes',
          cssClass: 'yes-btn',
          handler: () => {
            this.removeProduct();
          }
        }
      ]
    });

    await alert.present();
  }

  markAsSold(){
    this.pageLoading = true;
    this.productService.disable(this.product.id)
    .then(
      (resp: any) => {
        this.toastService.presentStdToastr(resp.message)
        this.product.enabled = false;
        console.log(resp);
        this.pageLoading = false;

      },
      err => {
        this.toastService.presentStdToastr(err)
        console.log(err);
        this.pageLoading = false;

      }
    )
  }
}
