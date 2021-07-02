import { getLocaleTimeFormat } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.page.html',
  styleUrls: ['./subscription.page.scss'],
})
export class SubscriptionPage implements OnInit {

  restTime = {
    hours: '00',
    minutes: '00',
    seconds: '00'
  };
  lastDate: Date;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.getInfo();
  }

  getInfo(){
    this.route.queryParamMap
    .subscribe(
      params => {
        this.lastDate = new Date(params.get('lastDate'));
        this.startTimer();
      }
    )
  }

  startTimer(){
    setInterval(() => {
      const currDate = new Date();

      // calcul the difference between the current time and the time when the last product was posted
      let diff = (currDate.getTime() - this.lastDate.getTime());

      // calcul the rest to complete 24h (1 day) // ms to hour
      let rest = ((24 * 60 * 60 * 1000) - diff) / 1000 / 60 / 60;

      // set the number of hours rest
      this.restTime.hours = (Math.floor(rest) < 10 ? '0' : '') + (Math.floor(rest) < 0 ? 0 : Math.floor(rest));

      // calcul and set the the number of minutes
      rest = (rest - Math.floor(rest)) * 60;
      this.restTime.minutes = (Math.floor(rest) < 10 ? '0' : '') + Math.floor(rest);

      // calcul and set the the number of seconds
      rest = (rest - Math.floor(rest)) * 60;
      this.restTime.seconds = (Math.floor(rest) < 10 ? '0' : '') + Math.floor(rest);
    }, 1000);
  }

}
