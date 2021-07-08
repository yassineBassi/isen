import { User } from './models/User';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Platform } from '@ionic/angular';
import { Component } from '@angular/core';
import { SocketService } from './services/socket.service';
import { JsonService } from './services/json.service';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  socket = SocketService.socket;
  user: User;
    // private statusBar: StatusBar
    // private splashScreen: SplashScreen,
  constructor(
    private platform: Platform,
    private nativeStorage: NativeStorage,
    private jsonService: JsonService,
    private oneSignel: OneSignal,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.getUserData();
      this.getJsonData();
      // this.statusBar.styleLightContent();
      // setTimeout(() => {
      //   this.splashScreen.hide();
      // }, 1000);
      // this.network.onDisconnect().subscribe(() => {
      //   this.onOffline();
      // });
      // this.migrateToNativeStorage();
    });
  }

  setupPush(){
    this.oneSignel.startInit("3b993591-823b-4f45-94b0-c2d0f7d0f6d8", "138360337223");    
    this.oneSignel.inFocusDisplaying(this.oneSignel.OSInFocusDisplayOption.Notification)
    this.oneSignel.setExternalUserId(this.user.id);
    this.oneSignel.setSubscription(true);
    this.oneSignel.handleNotificationOpened().subscribe(resp => {
      const data = resp.notification.payload.additionalData;
      console.log(data.link);
      
      if(data.link) this.router.navigateByUrl(data.link);
      
    });
    this.oneSignel.handleNotificationReceived().subscribe(data => {

    });
    this.oneSignel.endInit();
  }

  connectUser(){
    console.log('connecting user', this.user.id);
    
    this.socket.emit('connect-user', this.user.id)
  }

  getUserData(){
    this.nativeStorage.getItem('user')
    .then(
      user => {
        this.user = new User().initialize(user);
        this.connectUser();
        if(this.platform.is('cordova'))
          this.setupPush();
      }
    )
  }

  getJsonData(){
    this.jsonService.getCountries()
    .then(
      (resp: any) => {
        this.nativeStorage.setItem('countries', JSON.stringify(resp));
        this.jsonService.getCurrencies()
        .then(
          (resp: any) => {
            this.nativeStorage.setItem('currencies', JSON.stringify(resp));
            this.jsonService.getEducations()
            .then(
              (resp: any) => {
                this.nativeStorage.setItem('educations', JSON.stringify(resp));
                this.jsonService.getProfessions()
                .then(
                  (resp: any) => {
                    this.nativeStorage.setItem('professions', JSON.stringify(resp));
                    this.jsonService.getInterests()
                    .then(
                      (resp: any) => {
                        this.nativeStorage.setItem('interests', JSON.stringify(resp));
                      }
                    )
                  }
                )
              }
            )
          }
        )
      }
    )
  }

}
