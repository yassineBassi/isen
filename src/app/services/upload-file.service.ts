import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Injectable } from '@angular/core';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File, FileEntry, IFile } from '@ionic-native/file/ngx'
import { AlertController, Platform } from '@ionic/angular';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { OpenNativeSettings } from '@ionic-native/open-native-settings/ngx';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {

  options: CameraOptions = {
    quality: 100,
    targetWidth: 900,
    targetHeight: 600,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    saveToPhotoAlbum: false,
  };

  constructor(private file: File, private filePath: FilePath, private platform: Platform, private openNativeSettings: OpenNativeSettings,
              private camera: Camera, private alertCtrl: AlertController, private androidPermission: AndroidPermissions) { }

  getPermission(sourceType){
    const permission = sourceType == this.camera.PictureSourceType.CAMERA ? this.androidPermission.PERMISSION.CAMERA : this.androidPermission.PERMISSION.READ_EXTERNAL_STORAGE
    return new Promise((resolve, reject) => {
      this.androidPermission.checkPermission(permission)
      .then(
        result => {
          if(result.hasPermission){
            resolve(null)
          }else{
            this.requestPermission(permission)
            .then(resp => {
              if(resp) resolve(true);
              else reject();
            }, () => reject())
          }
        },
        () => {
          this.requestPermission(permission)
          .then(resp => {
            if(resp) resolve(true);
            else reject();
          }, () => reject())
        }
      )
    })
  }

  requestPermission(permission: string){
    return this.androidPermission.requestPermission(permission)
    .then(
      resp => {
        if(resp.hasPermission) return true;
        else{
          this.showPermissionAlert();
          return false;
        };
      },
      () => {
        this.showPermissionAlert();
        return false;
      }
    )
  }

  async showPermissionAlert(){
    const alert = await this.alertCtrl.create({
      header: 'Permission',
      message: 'Geloo doesn\'t have the permission to perfome this action, please give us the permsiion from the application settings',
      buttons: [
        {
          text: 'CANCEL',
          role: 'cancel'
        },
        {
          text: 'Settings',
          handler: () => {
            this.openNativeSettings.open('application_details')
          }
        }
      ]
    })

    await alert.present();
  }

  takePicture(sourceType){
    
    this.options.sourceType = sourceType;
    this.options.destinationType = this.platform.is('ios') ? this.camera.DestinationType.NATIVE_URI : (this.platform.is('android') ? this.camera.DestinationType.FILE_URI : this.camera.DestinationType.DATA_URL);

    return new Promise((resolve, reject) => {
      this.getPermission(sourceType)
      .then(
        () => {
          this.camera.getPicture(this.options)
          .then((imageData) => {            
            if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
              this.filePath.resolveNativePath(imageData)
                .then(filePath => {
                  resolve(this.readImgSrc(filePath));
                },err => {
                  reject(err);
                });
            } else {
              resolve(this.readImgSrc(imageData));
            }
          },
          err => {
            reject(err);
          });
        }
      )
    });
  }

  readImgSrc(imageData) {
    return new Promise((resolve, reject) => {
        this.file.resolveLocalFilesystemUrl(imageData)
        .then((fileEntry) => {
            (fileEntry as FileEntry).file(file => {
                resolve(this.generateBlobImg(file, imageData));
            }, err => {
                reject(err);
            });
        }, err => {
            reject(err);
        });
    });
  }
  
  generateBlobImg(file: IFile,imageData) {
    return new Promise((resolve, reject) => {
        const fileName = file.name.substring(0, file.name.lastIndexOf('.') + 1) + 'jpg';
        const fileReader = new FileReader();

        fileReader.readAsArrayBuffer(file);
        fileReader.onload = evt => {
            const imgBlob = new Blob([fileReader.result], { type: 'image/jpeg' });
            resolve({file: imgBlob, name: fileName, imageData})
        };
        fileReader.onerror = error => {
            reject(error);
        };
    });
  }
  
}
