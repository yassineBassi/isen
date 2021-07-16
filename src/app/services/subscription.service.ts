import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HTTP } from '@ionic-native/http/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService extends DataService {

  constructor(nativeStorage: NativeStorage, http: HTTP, router: Router) {
    super('subscription', nativeStorage, http, router);
  }

  getSubscriptionPrices(){
    return this.sendRequest({
      method: 'get',
      url: '/prices'
    })
  }

  pay(id: string, data: any){
    return this.sendRequest({
      method: 'post',
      url: '/' + id + '/pay',
      data
    })
  }

}
