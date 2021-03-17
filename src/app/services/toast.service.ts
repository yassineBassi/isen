import { ToastController } from '@ionic/angular';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastCtrl: ToastController) { }

  async presentErrorToastr(err: string){
    const toastr = await this.toastCtrl.create({
      message: err,
      position: 'bottom',
      color: 'danger',
      duration: 2000,
    });

    toastr.present();
  }

  async presentSuccessToastr(success: string){
    const toastr = await this.toastCtrl.create({
      message: success,
      position: 'bottom',
      color: 'success',
      duration: 2000,
    });

    toastr.present();
  }
}
