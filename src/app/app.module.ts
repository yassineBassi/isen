import { Camera } from '@ionic-native/camera/ngx';
import { UploadFileService } from './services/upload-file.service';
import { MenuComponent } from './pages/menu/menu.component';
import { HTTP } from '@ionic-native/http/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy, Platform } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FilePath } from '@ionic-native/file-path';
import { ExtractDatePipe } from './pipes/extract-date.pipe';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    NativeStorage,
    HTTP
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
