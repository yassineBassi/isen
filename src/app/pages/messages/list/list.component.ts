import { MessageService } from './../../../services/message.service';
import { User } from './../../../models/User';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {

  page = 0
  pageLoading = false;
  users: User[];

  constructor(private messageService: MessageService) { }

  ngOnInit() {}

  ionViewWillEnter(){
    this.page = 0;
    this.getUsersMessages(null)
  }

  getUsersMessages(event){
    this.pageLoading = true
    this.messageService.usersMessages(this.page)
    .then(
      (resp: any) => {
        this.pageLoading = false
        console.log(resp);

        if(!event){
          this.users = [];
        }else{
          event.target.complete()
          if(!resp.data.more) event.target.disabled = true;
        }

        resp.data.forEach(usr => {
          this.users.push(new User(usr));
        })
      },
      err => {
        this.pageLoading = false
        console.log(err);

      }
    )
  }
}
