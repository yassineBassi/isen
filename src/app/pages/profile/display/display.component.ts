import { MessengerService } from './../../messenger.service';
import { RequestService } from './../../../services/request.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from './../../../services/toast.service';
import { ToastController, AlertController, PopoverController } from '@ionic/angular';
import { UploadFileService } from './../../../services/upload-file.service';
import { AuthService } from './../../../services/auth.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { UserService } from './../../../services/user.service';
import { User } from './../../../models/User';
import { Component, OnInit } from '@angular/core';
import constants from 'src/app/helpers/constants';
import { FullScreenImage } from '@ionic-native/full-screen-image/ngx';
import { Request } from 'src/app/models/Request';
import { DropDownComponent } from '../../drop-down/drop-down.component';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss'],
})
export class DisplayComponent implements OnInit {

  pageLoading = false;
  authUser: User;
  user: User;
  domaine = constants.DOMAIN_URL;
  myProfile = false;
  userId: string;

  constructor(private auth: AuthService, private camera: Camera, private nativeStorage: NativeStorage,private popoverController: PopoverController,
  private userService: UserService, private uploadFileService: UploadFileService, private toastService: ToastService,private messengerService: MessengerService,
  private route: ActivatedRoute, private requestService: RequestService, private alertCtrl: AlertController, private router: Router) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.getUserId();
  }

  getUserId(){
    this.route.paramMap
    .subscribe(
      params => {
        this.userId = params.get('id');
        if(this.userId && this.userId != "null"){
          this.getUser();
        }else{
          this.getAuthUser();
          this.myProfile = true;
        }
      }
    )
  }

  refresh(event){
    if(this.userId && this.userId != "null"){
      this.getUser(event);
    }else{
      this.getAuthUser(event);
      this.myProfile = true;
    }
  }

  getUser(event?){
    if(!event) this.pageLoading = true;
    this.userService.getUserProfile(this.userId)
    .then(
      (resp: any) => {
        this.pageLoading = false;
        this.user = new User().initialize(resp.data);
        if(event) event.target.complete()
      },
      err => {
        this.pageLoading = false;
        if(event) event.target.complete()
      }
    )
  }

  getAuthUser(event?){
    if(!event) this.pageLoading = true;
    this.auth.getAuthUser()
    .then(
      (resp: any) => {
        console.log('----------------');
        
        console.log(resp.data);
        
        this.user = new User().initialize(resp.data);
        console.log('----------------');
        
        console.log(this.user);
        this.nativeStorage.setItem('user', this.user.toObjeect())
        if(event) event.target.complete()
        this.pageLoading = false;
      },
      err => {
        this.pageLoading = false;
        if(event) event.target.complete()
      }
    )
  }

  takePicture(){
    this.getPicture(this.camera.PictureSourceType.CAMERA);
  }

  selectPicture(){
    this.getPicture(this.camera.PictureSourceType.PHOTOLIBRARY);
  }

  getPicture(sourceType){
    this.uploadFileService.takePicture(sourceType)
    .then(
      (res: any) => {
        this.updateAvatar(res.file, res.name)
      },
      err => {
        console.log(err);
        this.toastService.presentStdToastr(err);
      }
    )
  }

  updateAvatar(file: File, name: string){
    const form: FormData = new FormData();
    form.append('avatar', file, name);
    this.userService.updateAvatar(this.user.id, form)
    .then(
      (resp: any) => {
        this.user.avatar = resp.data.avatar;
        this.nativeStorage.setItem('user', this.user.toObjeect())
        this.messengerService.sendMessage({event: 'update-user'});
        this.toastService.presentStdToastr('your avatar has been updated successfully');
      },
      err =>{
        console.log(err);
        this.toastService.presentStdToastr(err)
      }
    )
  }

  follow(){
    this.userService.follow(this.user.id)
    .then(
      (resp: any) => {
        console.log(resp);
        this.user.followed = resp.data;
        this.toastService.presentStdToastr(this.user.followed ? 'follow' : 'unfollow')
      },
      err => {
        console.log(err);
        this.toastService.presentStdToastr(err);
      }
    )
  }

  request(){
    if(this.user.friend) this.removeFriendShipConf();
    else if(this.user.request == 'requesting') this.acceptRequest()
    else if(this.user.request == 'requested') this.cancelRequest()
    else this.requestFriendship()
  }

  handleError(err){
    this.toastService.presentStdToastr(err)
  }

  acceptRequest(){
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
    this.requestService.request(this.user.id)
    .then(
      (resp: any) => {
        this.user.request = 'requested';
        this.user.friend = false;
        this.user.requests.push(new Request(resp.data.request))
        this.toastService.presentStdToastr(resp.message);
      },
      err => this.toastService.presentStdToastr(err)
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
    this.userService.removeFriendship(this.user.id)
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
  }

  async presentPopover(ev: any) {
    const popoverItems = [
      {
        text: 'Block',
        icon: 'fas fa-minus-circle',
        event: 'block'
      },
      {
        text: 'Report',
        icon: 'fas fa-exclamation-triangle',
        event: 'report'
      }
    ]
    const popover = await this.popoverController.create({
      component: DropDownComponent,
      event: ev,
      cssClass: 'dropdown-popover',
      componentProps: {
        items: popoverItems
      }
    });
    await popover.present();

    const { data } = await popover.onDidDismiss();
    console.log(data);
    
    if(data && data.event){
      if(data.event == 'block'){
        this.blockUserConf();
      }
      else if(data.event == 'report'){
        this.reportUser();
      }
    }
  }

  async blockUserConf(){
    const alert = await this.alertCtrl.create({
      header: 'Block User',
      message: 'do you really want to block this user ?',
      buttons: [
        {
          text: 'CANCEL',
          role: 'cancel'
        },
        {
          text: 'BLOCK',
          cssClass: 'text-danger',
          handler: () => this.blockUser()
        }
      ]
    })
    await alert.present()
  }

  blockUser(){
    this.userService.block(this.userId)
    .then(
      (resp: any) => {
        this.toastService.presentStdToastr(resp.message)
        this.router.navigateByUrl('/profile/display/null')
      },
      err => {
        this.toastService.presentStdToastr(err)
      }
    )
  }

  async reportUser(){
    const alert = await this.alertCtrl.create({
      header: 'Report ' + this.user.fullName,
      inputs: [
        {
          type: 'text',
          name: 'message',
          placeholder: 'Message'
        }
      ],
      buttons: [
        {
          text: 'CANCEL',
          role: 'cancel'
        },
        {
          text: 'SEND',
          cssClass: 'text-danger',
          handler: (val) => {
            const message = val.message
            this.userService.report(this.userId, message)
            .then(
              (resp: any) => {
                this.toastService.presentStdToastr(resp.message)
              },
              err => {
                this.toastService.presentStdToastr(err)
              }
            )
          }
        }
      ]
    })
    await alert.present();
  }

}
