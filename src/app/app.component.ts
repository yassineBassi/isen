import constants from 'src/app/helpers/constants';
import { User } from './models/User';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Platform } from '@ionic/angular';
import { Component } from '@angular/core';
import { io } from 'socket.io-client/';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  socket
  user: User;
    // private statusBar: StatusBar
    // private splashScreen: SplashScreen,
  constructor(
    private platform: Platform,
    private nativeStorage: NativeStorage
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.getUserData();
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
    this.socket = io(constants.DOMAIN_URL)
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
}
