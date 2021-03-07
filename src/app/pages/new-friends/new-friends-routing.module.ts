import { SlidesComponent } from './slides/slides.component';
import { ListComponent } from './list/list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewFriendsPage } from './new-friends.page';

const routes: Routes = [
  {
    path: '',
    component: NewFriendsPage,
    children: [
      {
        path: '',
        redirectTo: 'slides',
        pathMatch: 'full'
      },
      {
        path: 'list',
        component: ListComponent
      },
      {
        path: 'slides',
        component: SlidesComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewFriendsPageRoutingModule {}
