import { ChannelComponent } from './channel/channel.component';
import { ChannelFormComponent } from './channel-form/channel-form.component';
import { ListComponent } from './list/list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChannelsPage } from './channels.page';

const routes: Routes = [
  {
    path: '',
    component: ChannelsPage,
    children: [
      {
        path: '',
        redirectTo: 'list/mines',
        pathMatch: 'full'
      },
      {
        path: 'list/:type',
        component: ListComponent
      },
      {
        path: 'form',
        component: ChannelFormComponent
      },
      {
        path: 'channel',
        component: ChannelComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChannelsPageRoutingModule {}
