import { OneSignalService } from './services/one-signal.service';
import { User } from './models/User';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Platform, AlertController } from '@ionic/angular';
import { Component } from '@angular/core';
import { SocketService } from './services/socket.service';
import { JsonService } from './services/json.service';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Network } from '@ionic-native/network/ngx';
import { WebrtcService } from './services/webrtc.service';
import { Router } from '@angular/router';
import { MessengerService } from './pages/messenger.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  socket = SocketService.socket;
  user: User;
  audio: HTMLAudioElement;


  constructor(
    private platform: Platform,
    private nativeStorage: NativeStorage,
    private jsonService: JsonService,
    private oneSignalService: OneSignalService,
    private webrtcService: WebrtcService,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private network: Network,
    private router: Router,
    private messengerService: MessengerService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.getUserData();
      this.getJsonData();
      this.statusBar.styleLightContent();
      setTimeout(() => {
        this.splashScreen.hide();
      }, 1000);
      this.network.onDisconnect().subscribe(() => {
        this.onOffline();
      });
    });
  }

  ionViewWillEnter(){
    this.oneSignalService.close();
  }

  playAudio(src){
    this.audio = new Audio();
    this.audio.src = src
    this.audio.load();
    this.audio.loop = true;
    this.audio.play();
  }

  connectUser(){
    this.socket.emit('connect-user', this.user.id);
    this.socket.on('called', () => {
      console.log('called')
      this.playAudio("./../../../../../assets/audio/phone-ringing.mp3");
      this.messengerService.onMessage().subscribe(msg => {
        if(msg && msg.event && msg.event == 'stop-audio') this.audio.pause();
      })
    })
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

  async onOffline(){
    this.router.navigateByUrl('/internet-error')
  }

}
