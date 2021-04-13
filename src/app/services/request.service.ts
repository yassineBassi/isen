import { Router } from '@angular/router';
import { HTTP } from '@ionic-native/http/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { DataService } from './data.service';
import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Injectable({
  providedIn: 'root'
})
export class RequestService extends DataService {

  constructor(nativeStorage: NativeStorage, http: HTTP, geo: Geolocation, router: Router) {
    super('request', nativeStorage, http, geo, router)
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

  cancelRequest(id: string){
    return this.sendRequest('post', '/cancel/' + id, {})
  }

  rejectRequest(id: string){
    return this.sendRequest('post', '/reject/' + id, {})
  }
}
