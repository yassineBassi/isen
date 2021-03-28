import { Geolocation } from '@ionic-native/geolocation/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { DataService } from './data.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService extends DataService {

  constructor(nativeStorage: NativeStorage, http: HTTP, geo: Geolocation) {
    super('message', nativeStorage, http, geo);
  }

  indexMessages(id: string, page: number){
    return this.sendRequest('get', '/' + id, {page: page.toString()})
  }

  usersMessages(page: number){
    return this.sendRequest('get', '/users', {page: page.toString()})
  }
}
