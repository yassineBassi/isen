import { Router } from '@angular/router';
import { HTTP } from '@ionic-native/http/ngx';
import { Inject, Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import constants from './../helpers/constants';

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'head' | 'delete' | 'upload' | 'download';
type HttpSerializer = 'json' | 'urlencoded' | 'utf8' | 'multipart' | 'raw';
type RequestOptions = {
  method: HttpMethod,
  url: string,
  data?: any,
  header?: any,
  serializer?: HttpSerializer,
  noApi?: boolean
}

@Injectable({
  providedIn: 'root'
})
export class DataService{

  url = "";

  constructor(@Inject('string') url: string, private nativeStorage: NativeStorage, protected http: HTTP,
              private router: Router) {
    this.url += url
  }

  getToken() {
    return new Promise((resolve, reject) => {
      this.nativeStorage.getItem('token')
      .then(
        token => resolve(token),
        err => resolve('')
      );
    })
  }

  sendRequest(options: RequestOptions) {
      return new Promise((resolve, reject) => {
        this.getToken()
        .then((token: string) => {
          const url = constants.DOMAIN_URL + (options.noApi ? '' : constants.API_V1) + this.url + options.url;
          this.http.sendRequest(url, {
            method: options.method,
            params: options.method === 'get' ? options.data : '',
            data: options.method === 'post' || options.method == 'put' ? options.data : '',
            headers: {
              ...(options.header ? options.header : {}),
              // PLATFORM: this.platform.is('ios') ? 'ios' : 'android',
              // VERSION: Product.version,
              'Authorization': 'Bearer ' + token
            },
            serializer: options.serializer ? options.serializer : 'json'
          }).then(
            resp => {
              resp = JSON.parse(resp.data);
              resolve(resp);
            },
            err => {
              if(err.status == 400){
                reject(JSON.parse(err.error));
              }else if(err.status == 401){
                this.logout();
              }else{
                reject(err.error)
              }
            }
          )
        });
      });
  }

  logout(){
    this.nativeStorage.remove('token');
    this.nativeStorage.remove('user');
    this.router.navigateByUrl('/auth')
  }
}
