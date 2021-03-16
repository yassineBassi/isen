import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {
  constructor(private nativeStorage: NativeStorage, private router: Router){}

  canActivate(): Promise<boolean>{
    return this.nativeStorage.getItem('token')
    .then(
      token => {
        this.router.navigate(['/profile'])
        return false
      },
      err => true
    );
  }
}
