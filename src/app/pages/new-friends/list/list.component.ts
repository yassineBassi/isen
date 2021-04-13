import { IonInfiniteScroll } from '@ionic/angular';
import { UserService } from './../../../services/user.service';
import { User } from './../../../models/User';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  @ViewChild('infinitScroll') infinitScroll: IonInfiniteScroll;

  @Input() users: User[];
  @Output() loadMore = new EventEmitter();
  @Output() showUser = new EventEmitter();
  @Output() setUsers = new EventEmitter();

  page = 0;
  pageLoading = false;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.page = 0;
    this.getNearUsers();
  }

  ionViewWillEnter(){
  }

  getNearUsers(event?, refresh?){
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

        resp.data.users.forEach(user => {
          this.users.push(new User().initialize(user));
        })

        this.setUsers.emit(this.users)
        this.pageLoading = false;
      },
      err => {
        this.pageLoading = false;
        console.log(err);
      }
    )
  }
}
