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
    this.prices = []
    this.getSubscriptionPrices();
  }

  getSubscriptionPrices(){
    this.loading = true;
    this.subscriptionService.getSubscriptionPrices().then((resp: any) => {
      this.loading = false;
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

  savedPrice(ind: number){
    const previousPrice = this.prices[ind - 1];
    const currentPrice = this.prices[ind];
    const expectedPrice = this.howManyIn(previousPrice.duration, currentPrice.duration) * parseFloat(previousPrice.price);
    const diff = expectedPrice - parseFloat(currentPrice.price);
    return Math.round( diff * 100 / expectedPrice);
  }

  howManyIn(duration1, duration2): number{
    if(duration2 == 'year'){
      return duration1 == 'month' ? 12 : (duration1 == 'week' ? 48 : 365)
    }
    if(duration2 ==  'month'){
      return duration1 == 'week' ? 4 : 30
    }
    return 7;
  }
}
