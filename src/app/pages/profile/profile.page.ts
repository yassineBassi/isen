import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {


  edit = false;
  educationDegrees = [
    'High school',
    'College',
    'Associates degree',
    'Bachlors degree',
    'Graduate degree',
    'PhD'
  ]

  user = {
    firstName: 'noone',
    lastName: '135',
    gender: 'male',
    birthDay: '09/29/1999',
    address: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis, sed.',
    profession: 'software engineer',
    school: 'NGT School',
    education: 'College',
    interests: [
      {title: 'Nature', icon: 'fas fa-leaf', background: 'green', color: 'white'},
      {title: 'Reading books', icon: 'fas fa-book-reader', background: 'blue', color: 'white'},
      {title: 'Drawing', icon: 'fas fa-drafting-compass', background: 'red', color: 'white'},
      {title: 'Drawing', icon: 'fas fa-drafting-compass', background: 'red', color: 'white'},
      {title: 'Reading books', icon: 'fas fa-book-reader', background: 'blue', color: 'white'}
    ]
  }

  constructor() { }

  ngOnInit() {
  }

  startEditing(){
    this.edit = true;
  }

}
