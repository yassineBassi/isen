import { User } from './models/User';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Platform } from '@ionic/angular';
import { Component } from '@angular/core';
import { SocketService } from './services/socket.service';
import { JsonService } from './services/json.service';

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
    private jsonService: JsonService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.getUserData();
      this.getJsonData();
      // this.socket.connect()
      // this.socket.connect()
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

  connectUser(){
    this.socket.emit('connectUser', this.user.id)
  }

  getUserData(){
    console.log('hi');
    this.nativeStorage.getItem('user')
    .then(
      user => {
        this.user = new User().initialize(user);
        this.connectUser();
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
