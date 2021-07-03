import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { RequestService } from './../../../services/request.service';
import { ToastService } from './../../../services/toast.service';
import { UserService } from './../../../services/user.service';
import { User } from './../../../models/User';
import { Component, Input, OnInit } from '@angular/core';
import { Request } from 'src/app/models/Request';

@Component({
  selector: 'app-slide',
  templateUrl: './slide.component.html',
  styleUrls: ['./slide.component.scss'],
})
export class SlideComponent implements OnInit {

  @Input() user: User;
  @Input() random: boolean;

  constructor(private userService: UserService, private requestService: RequestService, private toastService: ToastService,
              private alertCtrl: AlertController, private router: Router) { }

  ngOnInit() {}

  follow(){
    this.userService.follow(this.user.id)
    .then(
      (resp: any) => {
        console.log(resp);
        this.user.followed = resp.data;
        this.toastService.presentStdToastr(resp.message)
      },
      err => {
        console.log(err);
        this.toastService.presentStdToastr(err);
      }
    )
  }

  request(){
    if(this.user.friend) this.removeFriendShipConf();
    else if(this.user.request == 'requesting') this.cancelRequest()
    else if(this.user.request == 'requested') this.acceptRequest()
    else this.requestFriendship()
  }

  handleError(err){
    this.toastService.presentStdToastr(err)
  }

  acceptRequest(){
    console.log('accept');
    this.requestService.acceptRequest(this.user.requests[0].id)
    .then(
      resp => {
        this.user.friend = true
      },
      err => this.handleError(err)
    )
  }

  cancelRequest(){
    this.requestService.cancelRequest(this.user.requests[0].id)
    .then(
      resp => {
        this.user.request = null;
        this.user.requests = [];
      },
      err => this.handleError(err)
    )
  }

  requestFriendship(){
    console.log('request');
    this.requestService.request(this.user.id)
    .then(
      (resp: any) => {
        this.user.friend = false;
        if(typeof resp.data.request == 'string')  this.user.request = resp.data.request;
        else{
           this.user.requests.push(new Request(resp.data.request));
           this.user.request = 'requesting';
        }
        this.toastService.presentStdToastr(resp.message);
      },
      err => this.handleError(err)
    )
  }

  async removeFriendShipConf(){
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
          cssClass: 'text-danger',
          handler: () => this.removeFriendship()
        }
      ]
    })
    await alert.present()
  }

  removeFriendship(){
    console.log('remove');
    this.userService.removeFriendship(this.user.id)
    .then(
      (resp: any) => {
        this.toastService.presentStdToastr(resp.message)
        if(resp.data){
          this.user.friend = false;
          this.user.request = null
        }
      },
      err => this.handleError(err)
    )
  }

  showProfile(){
    this.router.navigateByUrl('/profile/display/' + this.user.id)
  }
}
