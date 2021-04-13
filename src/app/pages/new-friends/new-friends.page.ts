import { User } from './../../models/User';
import { UserService } from './../../services/user.service';
import { Platform, IonInfiniteScroll } from '@ionic/angular';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-new-friends',
  templateUrl: './new-friends.page.html',
  styleUrls: ['./new-friends.page.scss'],
})
export class NewFriendsPage implements OnInit {

  page: number;
  pageLoading = true;
  users: User[];
  initialSlide: number = null;

  constructor() { }

  ngOnInit() {
  }

  showUser(ind){
    console.log(ind);
    this.initialSlide = ind;
  }

  setUsers(users: User[]){
    this.users = users;
  }
}
