import { HTTP } from '@ionic-native/http/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { DataService } from './data.service';
import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Injectable({
  providedIn: 'root'
})
export class JobService extends DataService{

  constructor(nativeStorage: NativeStorage, http: HTTP, geo: Geolocation) {
    super('job', nativeStorage, http, geo);
  }

  store(data){
    return this.sendRequest('post', '', data, {}, 'multipart');
  }

  available(page: number, query: string){
    return this.sendRequest('get', '/available', {page: page.toString(), search: query});
  }

  posted(page: number, query: string){
    return this.sendRequest('get', '/posted', {page: page.toString(), search: query});
  }

  get(id: string){
    return this.sendRequest('get', '/' + id, {});
  }

  getStorePermession(){
    return this.sendRequest('get', '/storePermession', {});
  }

  remove(id: string){
    return this.sendRequest('delete', '/' + id, {})
  }
}
