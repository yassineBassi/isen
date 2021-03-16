import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private nativeStorage: NativeStorage, private router: Router){}

  canActivate(): Promise<boolean>{
    return this.nativeStorage.getItem('token')
    .then(
      token => true,
      err => {
        this.router.navigate(['/auth/signin'])
        return false
      }
    );
  }

}
