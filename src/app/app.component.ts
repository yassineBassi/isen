import { User } from './models/User';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Platform } from '@ionic/angular';
import { Component } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

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

  getUserData(){
    console.log('hi');
    this.nativeStorage.getItem('user')
    .then(
      user => {
        this.user = new User(user);
      }
    )
  }
}
