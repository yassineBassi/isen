import { Network } from '@ionic-native/network/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { Toast } from '@ionic-native/toast/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { SharingModule } from './pages/sharing/sharing.module';
import { OpenNativeSettings } from '@ionic-native/open-native-settings/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx'
import { Stripe } from '@ionic-native/stripe/ngx';
import { InternetErrorComponent } from './pages/internet-error/internet-error.component';
import { Camera } from '@ionic-native/camera/ngx';
import { UploadFileService } from './services/upload-file.service';
import { File } from '@ionic-native/file/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { WebrtcService } from './services/webrtc.service';


@NgModule({
  declarations: [
    AppComponent,
    InternetErrorComponent
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    SharingModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    NativeStorage,
    HTTP,
    Toast,
    AndroidPermissions,
    OpenNativeSettings,
    OneSignal,
    Stripe,
    StatusBar,
    SplashScreen,
    Network,
    Camera,
    UploadFileService,
    File,
    FilePath,
    WebView,
    WebrtcService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
