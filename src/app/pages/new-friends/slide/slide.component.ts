import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
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

  constructor(private userService: UserService, private requestService: RequestService, private toastService: ToastService,
              private alertCtrl: AlertController, private router: Router) { }

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

  requestFriendship(){
    this.requestService.request(this.user.id)
    .then(
      (resp: any) => {
        console.log(resp);
        this.user.request = resp.data.request;
        this.user.friend = resp.data.friend;
        this.toastService.presentStdToastr(resp.message);
      },
      err => {
        console.log(err);
        this.toastService.presentStdToastr(err);
      }
    )
  }

  async removeFriendShipConfirmation(removeFn){
    const alert = await this.alertCtrl.create({
      header: 'Remove Friendship',
      message: 'do you really want to remove your friendship ?',
      buttons: [
        {
          text: 'CANCEL',
          role: 'cancel'
        },
        {
          text: 'REMOVE',
          handler: removeFn
        }
      ]
    })
    await alert.present()
  }

  removeFriendship(){
    console.log('hi there');

    this.removeFriendShipConfirmation(() => {
      this.requestService.removeFriendship(this.user.id)
      .then(
        (resp: any) => {
          this.toastService.presentStdToastr(resp.message)
          if(resp.data){
            this.user.friend = false;
            this.user.request = null
          }
        },
        err => {
          this.toastService.presentStdToastr(err);
        }
      )
    })
  }

  showProfile(){
    this.router.navigateByUrl('/profile/' + this.user.id)
  }
}
