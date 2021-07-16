import { User } from './../../models/User';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-friends',
  templateUrl: './new-friends.page.html',
  styleUrls: ['./new-friends.page.scss'],
})
export class NewFriendsPage implements OnInit {

  page: number;
  pageLoading = true;
  users: User[] = [];
  initialSlide: number = null;
  random = false;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.getType()
  }

  getType(){
    this.route.paramMap.subscribe(params => {
      const type = params.get('type')
      if(type){
        this.initialSlide = 0
        this.random = true
      }
    })
  }

  showUser(ind){
    console.log(ind);
    this.initialSlide = ind;
  }

  setUsers(users: User[]){
    this.users = users;
  }
}
