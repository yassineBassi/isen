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

  sendRequest(requestOptions: RequestOptions) {
      return new Promise((resolve, reject) => {
        this.getToken()
        .then((token: string) => {
          const url = constants.DOMAIN_URL + (requestOptions.noApi ? '' : constants.API_V1) + this.url + requestOptions.url;
          const options = {
            method: requestOptions.method,
            params: requestOptions.method === 'get' && requestOptions.data ? requestOptions.data : {},
            data: (requestOptions.method === 'post' || requestOptions.method == 'put' ) && requestOptions.data ? requestOptions.data : {},
            headers: {
              ...(requestOptions.header ? requestOptions.header : {}),
              // PLATFORM: this.platform.is('ios') ? 'ios' : 'android',
              VERSION: constants.VERSION,
              'Authorization': 'Bearer ' + token
            },
            serializer: requestOptions.serializer ? requestOptions.serializer : 'json'
          }
          console.log(url);
          
          this.http.sendRequest(url, options).then(
            resp => {
              // console.log('resp');
              // console.log(resp);
              resp = JSON.parse(resp.data);              
              resolve(resp);
            },
            err => {
              console.log('err');
              console.log(err);
              if(err.status == -1){
                reject('failed, please check your internet');
              }
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
