import { UserService } from './../../services/user.service';
import { HTTP } from '@ionic-native/http/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { SlideComponent } from './slide/slide.component';
import { SlidesComponent } from './slides/slides.component';
import { ListComponent } from './list/list.component';
import { SharingModule } from './../sharing/sharing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewFriendsPageRoutingModule } from './new-friends-routing.module';

import { NewFriendsPage } from './new-friends.page';
import { SearchOptionsComponent } from './search-options/search-options.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewFriendsPageRoutingModule,
    SharingModule
  ],
  declarations: [
    NewFriendsPage,
    ListComponent,
    SlidesComponent,
    SlideComponent,
    SearchOptionsComponent
  ],
  providers: [
    UserService,
    NativeStorage,
    HTTP
  ]
})
export class NewFriendsPageModule {}
