import { Camera } from '@ionic-native/camera/ngx';
import { ServiceFormComponent } from './service-form/service-form.component';
import { ListComponent } from './list/list.component';
import { ServiceComponent } from './service/service.component';
import { SharingModule } from './../../../sharing/sharing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ServicesPageRoutingModule } from './services-routing.module';
import { ServicesPage } from './services.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServicesPageRoutingModule,
    SharingModule
  ],
  declarations: [
    ServicesPage,
    ServiceComponent,
    ListComponent,
    ServiceFormComponent
  ],
  providers: [
    Camera
  ]
})
export class ServicesPageModule {}
