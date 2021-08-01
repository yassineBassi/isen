import { Router } from '@angular/router';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OneSignalService {

  constructor(private oneSignel: OneSignal, private router: Router) { }

  open(user_id){
    this.oneSignel.startInit("3b993591-823b-4f45-94b0-c2d0f7d0f6d8", "138360337223");    
    this.oneSignel.inFocusDisplaying(this.oneSignel.OSInFocusDisplayOption.Notification)
    this.oneSignel.setExternalUserId(user_id);
    this.oneSignel.setSubscription(true);
    this.oneSignel.handleNotificationOpened().subscribe(resp => {
      const data = resp.notification.payload.additionalData;
      if(data.link) this.router.navigateByUrl(data.link);
    });
    this.oneSignel.handleNotificationReceived().subscribe(data => {
    });
    this.oneSignel.endInit();
  }

  close(){
   this.oneSignel.removeExternalUserId();
   this.oneSignel.setSubscription(false);
  }

}
