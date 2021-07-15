import { MenuComponent } from './pages/menu/menu.component';
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


@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
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
    Stripe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
