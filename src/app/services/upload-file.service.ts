import { Camera } from '@ionic-native/camera/ngx';
import { Injectable } from '@angular/core';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File, FileEntry, IFile } from '@ionic-native/file/ngx'
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {

  constructor(private file: File, private filePath: FilePath, private platform: Platform,
              private camera: Camera) { }

  takePicture(sourceType){
    const DestinationType = this.platform.is('ios') ? this.camera.DestinationType.NATIVE_URI
      : (this.platform.is('android') ? this.camera.DestinationType.FILE_URI : this.camera.DestinationType.DATA_URL);

    const options = {
      quality: 75,
      DestinationType,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType,
      targetWidth: 1024,
      targetHeight: 1024,
      allowEdit: false,
      saveToPhotoAlbum: false
    };

    return new Promise((resolve, reject) => {
        this.camera.getPicture(options)
        .then((imageData) => {
          if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
            this.filePath.resolveNativePath(imageData)
              .then(filePath => {
                resolve(this.readImgSrc(filePath));
              });
          } else {
            resolve(this.readImgSrc(imageData));
          }
        });
    });
  }

    readImgSrc(imageData) {
        return new Promise((resolve, reject) => {
            this.file.resolveLocalFilesystemUrl(imageData)
            .then((fileEntry) => {
                (fileEntry as FileEntry).file(file => {
                    resolve(this.generateBlobImg(file));
                }, err => {
                    reject(err);
                });
            }, err => {
                reject(err);
            });
        });
    }
    generateBlobImg(file: IFile) {
      return new Promise((resolve, reject) => {
          const fileName = file.name.substring(0, file.name.lastIndexOf('.') + 1) + 'jpg';
          const fileReader = new FileReader();

          fileReader.readAsArrayBuffer(file);
          fileReader.onload = evt => {
              const imgBlob = new Blob([fileReader.result], { type: 'image/jpeg' });
              resolve({file: imgBlob, name: fileName})
          };
          fileReader.onerror = error => {
              reject(error);
          };
      });
    }
}
