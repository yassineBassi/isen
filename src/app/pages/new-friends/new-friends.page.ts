import { User } from './../../models/User';
import { UserService } from './../../services/user.service';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

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

  constructor(private userService: UserService, private platform: Platform, private route: Router) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.page = 0;
    this.platform.ready()
    .then(() => {
      this.getNearUsers(null);
    });
  }

  getNearUsers(event){
    console.log('hi');

    this.pageLoading = true;
    this.userService.getNearUsers(this.page++)
    .then(
      (resp: any) => {
        if(!event) this.users = [];
        resp.data.forEach(user => {
          this.users.push(new User(user));
        })

        if(event) event.target.complete();
        this.pageLoading = false;

        console.log(resp);

      },
      err => {
        console.log('err');
        this.pageLoading = false;
        console.log(err);

      }
    )
  }

  showUser(ind){
    console.log(ind);

    this.initialSlide = ind;
  }
}
