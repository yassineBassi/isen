import { Component, OnInit } from '@angular/core';
import { Stripe } from '@ionic-native/stripe/ngx';
// declare var Stripe;
import constants from 'src/app/helpers/constants';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {

  cardNumber = "4242424242424242";
  cardMonth = 12;
  cardYear = 2022;
  cardCVV = '220';

  pageLoading = false;

  constructor(private stripe: Stripe, private toastService: ToastService) { }

  ngOnInit() {
    this.stripe.setPublishableKey(constants.STRIPE_PUBLIC_KEY);
  }

  validateCard(){
    this.pageLoading = true;
    const card = {
      number: this.cardNumber,
      expMonth: this.cardMonth,
      expYear: this.cardYear,
      cvc: this.cardCVV
    };

    this.stripe.createCardToken(card)
    .then(
      token => {
        this.pageLoading = false;
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
