import { Injectable } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { OpenNativeSettings } from '@ionic-native/open-native-settings/ngx';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  constructor(private alertCtrl: AlertController, private openNativeSettings: OpenNativeSettings, private androidPermission: AndroidPermissions) { }

  
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

  getPermission(permission){
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
  
}
