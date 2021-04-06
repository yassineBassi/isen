import { Router } from '@angular/router';
import { HTTP } from '@ionic-native/http/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { DataService } from './data.service';
import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Injectable({
  providedIn: 'root'
})
export class UserService extends DataService {

  constructor(nativeStorage: NativeStorage, http: HTTP, geo: Geolocation, router: Router) {
    super('user', nativeStorage, http, geo, router)
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

  getUserProfile(id: string){
    return this.sendRequest('get', '/profile/' + id, {})
  }

}
