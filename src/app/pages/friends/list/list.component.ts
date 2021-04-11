import { User } from './../../../models/User';
import { RequestService } from './../../../services/request.service';
import { Platform } from '@ionic/angular';
import { ToastService } from './../../../services/toast.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {

  pageLoading = false;
  friends: User[];
  page: number;

  constructor(private requestService: RequestService, private platform: Platform, private toastService: ToastService){ }

  ngOnInit() {}

  ionViewWillEnter(){
    this.platform.ready()
    .then(() => this.getFriends(null))
    this.page = 0;
  }

  getFriends(event, refresh?){
    if(!event) this.pageLoading = true;
    if(refresh) this.page = 0;
    this.requestService.getFriends(this.page++)
    .then(
      (resp: any) => {
        console.log(resp);
        if(!event || refresh) this.friends = [];
        resp.data.forEach(usr => {
          this.friends.push(new User().initialize(usr));
        })
        if(event) event.target.complete();
        this.pageLoading = false;
      },
      err => {
        console.log(err);
        this.pageLoading = false
      }
    )
  }
}
