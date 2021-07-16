import { Router } from '@angular/router';
import { HTTP } from '@ionic-native/http/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { DataService } from './data.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService extends DataService {

  constructor(nativeStorage: NativeStorage, http: HTTP, router: Router) {
    super('message', nativeStorage, http, router);
  }

  indexMessages(id: string, page: number){
    return this.sendRequest({
      method: 'get',
      url: '/' + id, 
      data: {page: page.toString()}
    })
  }

  usersMessages(page: number){
    return this.sendRequest({
      method: 'get',
      url: '/users', 
      data: {page: page.toString()}
    })
  }

  getPermission(){
    return this.sendRequest({
      method: 'get',
      url: '/permission'
    })
  }
}
