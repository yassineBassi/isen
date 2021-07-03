import { Component, OnInit } from '@angular/core';
import { Subscription } from 'src/app/models/Subscription';
import { SubscriptionService } from 'src/app/services/subscription.service';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.page.html',
  styleUrls: ['./subscription.page.scss'],
})
export class SubscriptionPage implements OnInit {

  subscription: Subscription;
  lastDate: Date;
  loading: boolean;
  prices: {
    price: string,
    duration: string
  }[] = [];
  selectedPrice = 0;

  constructor(private subscriptionService: SubscriptionService) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.getSubscriptionPrices();
  }

  getSubscriptionPrices(){
    this.loading = true;
    this.subscriptionService.getSubscriptionPrices().then((resp: any) => {
      this.loading = false;      
      console.log("-----------------------");
      console.log(resp);
      this.subscription = new Subscription(resp.data);
      const currency = this.subscription.currency
      if(this.subscription.yearPrice) this.prices.unshift({duration: 'year', price: this.subscription.yearPrice + ' ' + currency})
      if(this.subscription.monthPrice) this.prices.unshift({duration: 'month', price: this.subscription.monthPrice + ' ' + currency})
      if(this.subscription.weekPrice) this.prices.unshift({duration: 'week', price: this.subscription.weekPrice + ' ' + currency})
      if(this.subscription.dayPrice) this.prices.unshift({duration: 'day', price: this.subscription.dayPrice + ' ' + currency})
    }, err => {
      this.loading = false;
      console.log(err);
    })
  }

  // getInfo(){
  //   this.route.queryParamMap
  //   .subscribe(
  //     params => {
  //       this.lastDate = new Date(params.get('lastDate'));
  //       this.startTimer();
  //     }
  //   )
  // }

  // startTimer(){
  //   setInterval(() => {
  //     const currDate = new Date();

  //     // calcul the difference between the current time and the time when the last product was posted
  //     let diff = (currDate.getTime() - this.lastDate.getTime());

  //     // calcul the rest to complete 24h (1 day) // ms to hour
  //     let rest = ((24 * 60 * 60 * 1000) - diff) / 1000 / 60 / 60;

  //     // set the number of hours rest
  //     this.restTime.hours = (Math.floor(rest) < 10 ? '0' : '') + (Math.floor(rest) < 0 ? 0 : Math.floor(rest));

  //     // calcul and set the the number of minutes
  //     rest = (rest - Math.floor(rest)) * 60;
  //     this.restTime.minutes = (Math.floor(rest) < 10 ? '0' : '') + Math.floor(rest);

  //     // calcul and set the the number of seconds
  //     rest = (rest - Math.floor(rest)) * 60;
  //     this.restTime.seconds = (Math.floor(rest) < 10 ? '0' : '') + Math.floor(rest);
  //   }, 1000);
  // }

}
