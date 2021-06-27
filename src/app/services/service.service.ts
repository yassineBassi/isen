import { Router } from '@angular/router';
import { DataService } from './data.service';
import { HTTP } from '@ionic-native/http/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServiceService extends DataService {

  constructor(nativeStorage: NativeStorage, http: HTTP, router: Router) {
    super('service', nativeStorage, http, router);
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

  remove(id: string){
    return this.sendRequest('delete', '/' + id, {})
  }
}
