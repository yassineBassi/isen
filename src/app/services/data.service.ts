import { HTTP } from '@ionic-native/http/ngx';
import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import constants from './../helpers/constants';
import { Geolocation } from '@ionic-native/geolocation/ngx';

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'head' | 'delete' | 'upload' | 'download';
type HttpSerializer = 'json' | 'urlencoded' | 'utf8' | 'multipart' | 'raw';

@Injectable({
  providedIn: 'root'
})
export class DataService{

  url = constants.DOMAIN_URL + constants.API_V1;

  constructor(url: string, private nativeStorage: NativeStorage, protected http: HTTP, private geo: Geolocation) {
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
        console.log(serializer);
        this.getLocation()
        this.getToken()
        .then((token: string) => {
          console.log(token);
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
              resolve(JSON.parse(resp.data));
            },
            err => {
              if(err.status == 400){
                reject(JSON.parse(err.error));
              }else if(err.status == 401){
                this.nativeStorage.remove('token')
              }else{
                console.log(err);
                reject(err.error)
              }
            }
          )
        });
      });
  }

  getLocation(){
    this.geo.getCurrentPosition().then((resp) => {
      // resp.coords.latitude
      // resp.coords.longitude
      console.log(resp);

     }).catch((error) => {
       console.log('Error getting location', error);
     });
  }
}
