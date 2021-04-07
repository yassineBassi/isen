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
      quality: 100,
      targetWidth: 900,
      targetHeight: 600,
      destinationType: DestinationType,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: false,
      allowEdit: true,
      sourceType: sourceType
    };

    return new Promise((resolve, reject) => {
      console.log("hi there new");
      this.camera.getPicture(options)
      .then((imageData) => {
        console.log("then");

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
    });
  }

  readImgSrc(imageData) {
    console.log("readImgSrc");
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
    console.log("generateBlobImg");
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
