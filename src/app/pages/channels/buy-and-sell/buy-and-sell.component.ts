import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-buy-and-sell',
  templateUrl: './buy-and-sell.component.html',
  styleUrls: ['./buy-and-sell.component.scss'],
})
export class BuyAndSellComponent implements OnInit {

  constructor(private location: Location) { }

  ngOnInit() {}

  back(){
    this.location.back();
  }
}
