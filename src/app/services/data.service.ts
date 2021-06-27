import { Router } from '@angular/router';
import { HTTP } from '@ionic-native/http/ngx';
import { Inject, Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import constants from './../helpers/constants';

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'head' | 'delete' | 'upload' | 'download';
type HttpSerializer = 'json' | 'urlencoded' | 'utf8' | 'multipart' | 'raw';

@Injectable({
  providedIn: 'root'
})
export class DataService{

  url = constants.DOMAIN_URL + constants.API_V1;

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

  sendRequest(method: HttpMethod, url: string, data, header?, serializer: HttpSerializer = 'json') {
      return new Promise((resolve, reject) => {
        console.log(this.url + url);
        this.getToken()
        .then((token: string) => {
          console.log("token", token);
          this.http.sendRequest(this.url + url, {
            method,
            params: method === 'get' ? data : '',
            data: method === 'post' || method == 'put' ? data : '',
            headers: {
              ...header,
              // PLATFORM: this.platform.is('ios') ? 'ios' : 'android',
              // VERSION: Product.version,
              'Authorization': 'Bearer ' + token
            },
            serializer
          }).then(
            resp => {
              console.log("resp");
              console.log(resp);
              resp = JSON.parse(resp.data);
              console.log(resp);
              resolve(resp);
            },
            err => {
              console.log("err");
              console.log(err);
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
