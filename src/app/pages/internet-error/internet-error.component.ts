import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-internet-error',
  templateUrl: './internet-error.component.html',
  styleUrls: ['./internet-error.component.scss'],
})
export class InternetErrorComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {

  }

  reload(){
    this.router.navigateByUrl('/tabs/profile')
  }
}
