import { Geolocation } from '@ionic-native/geolocation/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { DataService } from './data.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChannelService extends DataService {

  constructor(nativeStorage: NativeStorage, http: HTTP, geo: Geolocation) {
    super('channel', nativeStorage, http, geo)
  }

  getMyChannels(page: number, search: string){
    return this.sendRequest('get', '', {page: page.toString(), search})
  }
}
