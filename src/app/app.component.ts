import { OneSignalService } from './services/one-signal.service';
import { User } from './models/User';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Platform } from '@ionic/angular';
import { Component } from '@angular/core';
import { SocketService } from './services/socket.service';
import { JsonService } from './services/json.service';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { Router } from '@angular/router';
import { WebrtcService } from './services/webrtc.service';

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
    private oneSignalService: OneSignalService,
    private webrtcService: WebrtcService
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

  ionViewWillEnter(){
    this.oneSignalService.close();
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
          this.oneSignalService.open(this.user.id);
        this.initWebrtc();
      }
    )
  }

  async initWebrtc(){
    await this.webrtcService.createPeer(this.user.id);
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
