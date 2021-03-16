import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @Input() back = false;
  @Input() menu = false;
  @Input() title = "";
  @Input() backLink = undefined;

  constructor(private location: Location, private router: Router) { }

  ngOnInit() {}

  goBack(){
    if(this.backLink) this.router.navigateByUrl(this.backLink);
    else this.location.back();
  }

}
