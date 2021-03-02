import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  interests = [
    {title: 'Nature', icon: 'fas fa-leaf', background: 'green', color: 'white'},
    {title: 'Reading books', icon: 'fas fa-book-reader', background: 'blue', color: 'white'},
    {title: 'Drawing', icon: 'fas fa-drafting-compass', background: 'red', color: 'white'}
  ]
  constructor() { }

  ngOnInit() {
  }

}
