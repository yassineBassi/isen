import { FormComponent } from './form/form.component';
import { DisplayComponent } from './display/display.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'display',
        pathMatch: 'full'
      },
      {
        path: 'display',
        component: DisplayComponent
      },
      {
        path: 'form',
        component: FormComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilePageRoutingModule {}
