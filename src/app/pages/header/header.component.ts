import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @Input() back = false;
  @Input() menu = false;
  @Input() title = "";

  constructor(private location: Location) { }

  ngOnInit() {}

  goBack(){
    this.location.back();
  }

}
