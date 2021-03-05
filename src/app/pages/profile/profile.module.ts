import { ImageResizer } from '@ionic-native/image-resizer/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { HeaderComponent } from './header/header.component';
import { DisplayComponent } from './display/display.component';
import { FormComponent } from './form/form.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilePageRoutingModule,
  ],
  declarations: [
    HeaderComponent,
    ProfilePage,
    FormComponent,
    DisplayComponent,
  ],
  providers: [
    Camera,
    ImageResizer
  ]
})
export class ProfilePageModule {}
