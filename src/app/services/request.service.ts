import { Router } from '@angular/router';
import { HTTP } from '@ionic-native/http/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { DataService } from './data.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RequestService extends DataService {

  constructor(nativeStorage: NativeStorage, http: HTTP, router: Router) {
    super('request', nativeStorage, http, router)
  }

  request(id: string){
    return this.sendRequest({
      method: 'post',
      url: '/' + id
    })
  }

  requests(page: number){
    return this.sendRequest({
      method: 'get',
      url: '/',
      data: {page: page.toString()
    }})
  }

  acceptRequest(id: string){
    return this.sendRequest({
      method: 'post',
      url: '/accept/' + id
    })
  }

  cancelRequest(id: string){
    return this.sendRequest({
      method: 'post',
      url: '/cancel/' + id
    })
  }

  rejectRequest(id: string){
    return this.sendRequest({
      method: 'post',
      url: '/reject/' + id
    })
  }
}
