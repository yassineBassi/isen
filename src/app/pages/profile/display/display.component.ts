import { RequestService } from './../../../services/request.service';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from './../../../services/toast.service';
import { ToastController, AlertController } from '@ionic/angular';
import { UploadFileService } from './../../../services/upload-file.service';
import { AuthService } from './../../../services/auth.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { UserService } from './../../../services/user.service';
import { User } from './../../../models/User';
import { Component, OnInit } from '@angular/core';
import constants from 'src/app/helpers/constants';
import { FullScreenImage } from '@ionic-native/full-screen-image/ngx';

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

  constructor(private auth: AuthService, private camera: Camera, private nativeStorage: NativeStorage,
  private userService: UserService, private uploadFileService: UploadFileService, private toastService: ToastService,
  private route: ActivatedRoute, private requestService: RequestService, private alertCtrl: AlertController) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.getUserId();
  }

  getUserId(){
    this.route.paramMap
    .subscribe(
      params => {
        const id = params.get('id');
        console.log(id);
        if(id && id != "null"){
          this.getUser(id);
        }else{
          this.getAuthUser();
          this.myProfile = true;
        }
      }
    )
  }

  getUser(id: string){
    this.pageLoading = true;
    this.userService.getUserProfile(id)
    .then(
      (resp: any) => {
        this.pageLoading = false;
        this.user = new User().initialize(resp.data);
        console.log(resp);
      },
      err => {
        this.pageLoading = false;
        console.log(err);
      }
    )
  }

  getAuthUser(){
    this.pageLoading = true;
    this.auth.getAuthUser()
    .then(
      (resp: any) => {
        this.user = new User().initialize(resp.data);
        this.nativeStorage.setItem('user', resp.data);
        console.log(this.user);
        this.pageLoading = false;
      },
      err => {
        this.pageLoading = false;
        console.log(err);
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
        console.log(res);
        this.updateAvatar(res.file, res.name)
      },
      err => {
        console.log(err);
        this.toastService.presentErrorToastr(err);
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
        this.nativeStorage.setItem('user', resp.data);
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

}
