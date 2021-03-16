import { HTTP } from '@ionic-native/http/ngx';
import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'head' | 'delete' | 'upload' | 'download';
type HttpSerializer = 'json' | 'urlencoded' | 'utf8' | 'multipart' | 'raw';

@Injectable({
  providedIn: 'root'
})
export class DataService{

  url = 'http://192.168.1.114:3300/api/v1/'

  constructor(url: string, private nativeStorage: NativeStorage, protected http: HTTP) {
    this.url += url
  }

  getToken() {
    return new Promise((resolve, reject) => {
      this.nativeStorage.getItem('token')
      .then(
        token => resolve(token),
        err => resolve(null)
      );
    })
  }

  sendRequest(method: HttpMethod, url: string, data, header?, serializer: HttpSerializer = 'json') {
      return new Promise((resolve, reject) => {
        console.log(this.url + url);
        this.getToken()
        .then((token: any) => {
          this.http.sendRequest(this.url + url, {
            method,
            params: method === 'get' ? data : '',
            data: method === 'post' ? data : '',
            headers: {
              ...header,
              // PLATFORM: this.platform.is('ios') ? 'ios' : 'android',
              // VERSION: Product.version,
              'access-code': token ? token : ''
            },
            serializer
          }).then(
            resp => {
              resolve(JSON.parse(resp.data));
            },
            err => {
              if(err.status == 400){
                reject(JSON.parse(err.error));
              }else{
                reject(err)
              }
            }
          )
        });
      });
  }

  get(id: number){

  }

}
