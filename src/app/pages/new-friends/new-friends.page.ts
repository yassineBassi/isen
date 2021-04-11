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
  @ViewChild('infinitScroll') infinitScroll: IonInfiniteScroll;

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

  getNearUsers(event, refresh?){
    if(!event) this.pageLoading = true;
    if(refresh) this.page = 0
    this.userService.getNearUsers(this.page++)
    .then(
      (resp: any) => {
        if(!event || refresh) this.users = [];

        if(refresh) this.infinitScroll.disabled = false

        if(event){
          event.target.complete();
          if(!resp.data.more && !refresh) event.target.disabled = true;
        }

        resp.data.forEach(user => {
          this.users.push(new User().initialize(user));
        })

        this.pageLoading = false;
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
