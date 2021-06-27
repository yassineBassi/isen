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
  userId: string;

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
    if(!this.userId){
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
        console.log(err);
      }
    )
  }

  getAuthUser(event?){
    if(!event) this.pageLoading = true;
    this.auth.getAuthUser()
    .then(
      (resp: any) => {
        this.user = new User().initialize(resp.data);
        this.nativeStorage.setItem('user', resp.data);
        console.log(this.user);
        if(event) event.target.complete()
        this.pageLoading = false;
      },
      err => {
        this.pageLoading = false;
        if(event) event.target.complete()
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
    console.log('cancel');

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
        console.log(resp);
        this.user.request = 'requesting';
        this.user.friend = false;
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

}
