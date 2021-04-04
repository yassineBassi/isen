import { Location } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  @Input() search = false;

  @Output() searchKeyUp = new EventEmitter();

  showSearch = false;

  constructor(private location: Location, private router: Router) { }

  ngOnInit() {}

  goBack(){
    console.log(this.backLink);

    if(this.backLink) this.router.navigateByUrl(this.backLink);
    else this.location.back();
  }

  cancelSearch(){
    this.showSearch = false;
    this.searchKeyUp.emit('');
  }

}
