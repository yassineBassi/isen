import { AuthGuard } from './guards/auth.guard';
import { GuestGuard } from './guards/guest.guard';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'profile',
    redirectTo: 'profile/null'
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'friends',
    loadChildren: () => import('./pages/friends/friends.module').then( m => m.FriendsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'messages',
    loadChildren: () => import('./pages/messages/messages.module').then( m => m.MessagesPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'channels',
    loadChildren: () => import('./pages/channels/channels.module').then( m => m.ChannelsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'new-friends',
    loadChildren: () => import('./pages/new-friends/new-friends.module').then( m => m.NewFriendsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'small-business',
    loadChildren: () => import('./pages/small-business/small-business.module').then( m => m.SmallBusinessPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'buy-and-sell',
    loadChildren: () => import('./pages/buy-and-sell/buy-and-sell.module').then( m => m.BuyAndSellPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.module').then( m => m.AuthPageModule),
    canActivate: [GuestGuard]
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/settings/settings.module').then( m => m.SettingsPageModule),
    canActivate: [AuthGuard]
  },  {
    path: 'subscription',
    loadChildren: () => import('./pages/subscription/subscription.module').then( m => m.SubscriptionPageModule)
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
