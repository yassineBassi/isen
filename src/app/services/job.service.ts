import { HTTP } from '@ionic-native/http/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { DataService } from './data.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JobService extends DataService{

  constructor(nativeStorage: NativeStorage, http: HTTP) {
    super('job', nativeStorage, http);
  }

  store(data){
    return this.sendRequest('post', '', data, {}, 'multipart');
  }

  indexAll(page: number, query: string){
    return this.sendRequest('get', '/all', {page: page.toString(), search: query});
  }

  index(page: number, query: string){
    return this.sendRequest('get', '', {page: page.toString(), search: query});
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
