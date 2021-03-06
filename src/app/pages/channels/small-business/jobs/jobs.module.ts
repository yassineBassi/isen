import { PostedComponent } from './posted/posted.component';
import { SharingModule } from './../../../sharing/sharing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JobsPageRoutingModule } from './jobs-routing.module';

import { JobsPage } from './jobs.page';
import { AvailableComponent } from './available/available.component';

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
    PostedComponent,
    AvailableComponent
  ]
})
export class JobsPageModule {}
