import { HTTP } from '@ionic-native/http/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { DataService } from './data.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends DataService {

  constructor(nativeStorage: NativeStorage, http: HTTP) {
    super('product', nativeStorage, http);
  }

  store(data){
    return this.sendRequest('post', '', data, {}, 'multipart');
  }

  index(page: number){
    return this.sendRequest('get', '', {page: page.toString()});
  }

  get(id: string){
    return this.sendRequest('get', '/' + id, {});
  }
}
