import { ToastService } from './../../../services/toast.service';
import { ToastController } from '@ionic/angular';
import { UploadFileService } from './../../../services/upload-file.service';
import { AuthService } from './../../../services/auth.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { UserService } from './../../../services/user.service';
import { User } from './../../../models/User';
import { Component, OnInit } from '@angular/core';
import constants from 'src/app/helpers/constants';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss'],
})
export class DisplayComponent implements OnInit {

  pageLoading = false;
  user: User;
  domaine = constants.DOMAIN_URL;

  constructor(private auth: AuthService, private camera: Camera, private nativeStorage: NativeStorage,
              private userService: UserService, private uploadFileService: UploadFileService,
              private toastService: ToastService) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.getUser();
  }

  getUser(){
    this.pageLoading = true;
    this.auth.getAuthUser()
    .then(
      (resp: any) => {
        this.user = new User();
        this.user.initialize(resp.data);
        this.nativeStorage.setItem('user', resp.data);
        console.log(this.user);
        console.log(this.user.avatar.path);
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
        console.log(resp.data.avatar);
        this.user.avatar = resp.data.avatar;
        this.nativeStorage.setItem('user', resp.data);
        this.toastService.presentSuccessToastr('your avatar has been updated successfully');
      },
      err =>{
        console.log(err);
        this.toastService.presentErrorToastr(err)
      }
    )
  }

}
