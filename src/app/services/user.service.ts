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

  update(id: string, data){
    return this.sendRequest('put', `/${ id }`, data)
  }

  updateAvatar(id: string, data){
    return this.sendRequest('put', `/avatar/${ id }`, data, {}, 'multipart')
  }

  getNearUsers(page: number){
    return this.sendRequest('get', '/nearUsers', {page: page.toString()});
  }

  follow(id: string){
    return this.sendRequest('post', '/follow/' + id, {});
  }

}
