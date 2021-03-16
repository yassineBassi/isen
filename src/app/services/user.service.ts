import { HTTP } from '@ionic-native/http/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { DataService } from './data.service';
import { Injectable } from '@angular/core';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class UserService extends DataService {

  constructor(nativeStorage: NativeStorage, http: HTTP) {
    super('user', nativeStorage, http)
  }

  get(id: number){
    return  null;
  }
}
