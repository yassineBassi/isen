import { PostedComponent } from './posted/posted.component';
import { AvailableComponent } from './available/available.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JobsPage } from './jobs.page';

const routes: Routes = [
  {
    path: '',
    component: JobsPage,
    children: [
      {
        path: '',
        redirectTo: 'available',
        pathMatch: 'full'
      },
      {
        path: 'available',
        component: AvailableComponent
      },
      {
        path: 'posted',
        component: PostedComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JobsPageRoutingModule {}
