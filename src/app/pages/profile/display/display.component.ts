import { AuthService } from './../../../services/auth.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { UserService } from './../../../services/user.service';
import { User } from './../../../models/User';
import { Component, OnInit } from '@angular/core';
import { ImageResizer, ImageResizerOptions } from '@ionic-native/image-resizer/ngx';
// import { ImagePicker } from '@ionic-native/image-picker/ngx';
// import { Camera, CameraOptions } from '@ionic-native/camera';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss'],
})
export class DisplayComponent implements OnInit {

  pageLoading = false;
  user: User = new User();

  constructor(private auth: AuthService, private camera: Camera, private nativeStorage: NativeStorage) { }

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
        this.user.initialize(resp.data);
        this.nativeStorage.setItem('user', this.user);
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
    const options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64 (DATA_URL):
    //  let base64Image = 'data:image/jpeg;base64,' + imageData;
      // this.user.avatar = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
     // Handle error
    // alert(err)
    });
  }

}
