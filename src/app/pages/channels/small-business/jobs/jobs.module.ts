import { ListComponent } from './list/list.component';
import { JobComponent } from './job/job.component';
import { Camera } from '@ionic-native/camera/ngx';
import { JobFormComponent } from './job-form/job-form.component';
import { SharingModule } from './../../../sharing/sharing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JobsPageRoutingModule } from './jobs-routing.module';

import { JobsPage } from './jobs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JobsPageRoutingModule,
    SharingModule
  ],
  declarations: [
    JobsPage,
    JobFormComponent,
    JobComponent,
    ListComponent
  ],
  providers: [
    Camera
  ]
})
export class JobsPageModule {}
