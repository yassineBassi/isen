import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Stripe, StripeCardTokenParams } from '@ionic-native/stripe/ngx';
// declare var Stripe;
import constants from 'src/app/helpers/constants';
import { User } from 'src/app/models/User';
import { SubscriptionService } from 'src/app/services/subscription.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {

  // testCrad "4242424242424242"


  cardNumber;
  cardMonth;
  cardYear;
  cardCVV;
  cardUserName;

  months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  years = [];

  price = '0';
  duration: string;
  subscriptionId: string;

  pageLoading = false;
  success = false;

  constructor(private stripe: Stripe, private toastService: ToastService, private route: ActivatedRoute, private subscriptionService:
              SubscriptionService, private nativeStorage: NativeStorage) { }


  ionViewWillEnter(){
    this.getQueryParams();
    this.initYearsValues();
    this.stripe.setPublishableKey(constants.STRIPE_PUBLIC_KEY);
    this.success = false;
  }

  ngOnInit() {
  }

  initYearsValues(){
    for(let i = new Date().getFullYear(); i < new Date().getFullYear() + 20; i++) this.years.push(i);
  }

  getQueryParams(){
    this.pageLoading = true;
    this.route.queryParamMap.subscribe(
      query => {
        this.pageLoading = false;
        this.price = query.get('price')
        this.duration = query.get('duration')
        this.subscriptionId = query.get('subscription_id')
      }
    )
  }

  validateCard(){
    this.pageLoading = true;
    const card: StripeCardTokenParams = {
      number: this.cardNumber,
      expMonth: parseInt(this.cardMonth),
      expYear: parseInt(this.cardYear),
      cvc: this.cardCVV,
      name: this.cardUserName
    };

    this.stripe.createCardToken(card)
    .then(
      token => {
        this.subscriptionService.pay(this.subscriptionId, {
          token: token.id, 
          duration: this.duration
        })
        .then(
          (resp: any) => {
            console.log(resp);
            this.pageLoading = false;
            this.toastService.presentStdToastr(resp.message);
            const user = new User().initialize(resp.data)
            this.nativeStorage.setItem('user', user.toObjeect());
            this.success = true;
          },
          err => {
            console.log(err);
            this.pageLoading = false;
            this.toastService.presentStdToastr(err);
          }
        )
        console.log('token');
        console.log(token);
      },
      err => {
        this.pageLoading = false;
        this.toastService.presentStdToastr(err)
        console.log(err)
      }
    )
  }
}
