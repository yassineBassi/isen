import { HTTP } from '@ionic-native/http/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { DataService } from './data.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RequestService extends DataService {

  constructor(nativeStorage: NativeStorage, http: HTTP) {
    super('request', nativeStorage, http)
  }

  request(id: string){
    return this.sendRequest('post', '/' + id, {})
  }

  requests(page: number){
    return this.sendRequest('get', '/', {page: page.toString()})
  }

  acceptRequest(id: string){
    return this.sendRequest('post', '/accept/' + id, {})
  }

  rejectRequest(id: string){
    return this.sendRequest('post', '/reject/' + id, {})
  }

  getFriends(page: number){
    return this.sendRequest('get', '/friends', {page: page.toString()})
  }
}
