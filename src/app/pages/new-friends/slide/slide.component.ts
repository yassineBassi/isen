import { RequestService } from './../../../services/request.service';
import { ToastService } from './../../../services/toast.service';
import { UserService } from './../../../services/user.service';
import { User } from './../../../models/User';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-slide',
  templateUrl: './slide.component.html',
  styleUrls: ['./slide.component.scss'],
})
export class SlideComponent implements OnInit {

  @Input() user: User;

  constructor(private userService: UserService, private requestService: RequestService, private toastService: ToastService) { }

  ngOnInit() {}

  follow(){
    this.userService.follow(this.user.id)
    .then(
      (resp: any) => {
        console.log(resp);
        this.user.followed = resp.data;
      },
      err => {
        console.log(err);
        this.toastService.presentErrorToastr(err);
      }
    )
  }

  requestFriend(){
    this.requestService.request(this.user.id)
    .then(
      (resp: any) => {
        console.log(resp);
        this.user.request = resp.data.request;
        this.user.friend = resp.data.friend;
        if(this.user.request == 'requesting'){
          this.toastService.presentStdToastr('Friendship request is sent');
        }else if(this.user.request == null){
          this.toastService.presentStdToastr('Friendship request is deleted');
        }
      },
      err => {
        console.log(err);
        this.toastService.presentStdToastr(err);
      }
    )
  }
}
