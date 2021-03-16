import { HTTP } from '@ionic-native/http/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { DataService } from './data.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends DataService {

  constructor(nativeStorage: NativeStorage, http: HTTP) {
    super('auth/', nativeStorage, http)
  }

  verifyEmail(email: string){
    return this.sendRequest('post', 'checkEmail/', {email})
  }

  signup(data){
    return this.sendRequest('post', 'signup/', data);
  }

  signin(data){
    return this.sendRequest('post', 'signin/', data);
  }
}
