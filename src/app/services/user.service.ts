import { Router } from '@angular/router';
import { HTTP } from '@ionic-native/http/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { DataService } from './data.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService extends DataService {

  constructor(nativeStorage: NativeStorage, http: HTTP, router: Router) {
    super('user', nativeStorage, http, router)
  }

  update(data){
    return this.sendRequest({
      method: 'put',
      url: '',
      data
    })
  }

  updateAvatar(id: string, data){
    return this.sendRequest({
      method: 'put',
      url: '/avatar',
      data,
      serializer: 'multipart'
    })
  }

  getNearUsers(page: number){
    return this.sendRequest({
      method: 'get',
      url: '/nearUsers', 
      data: {page: page.toString()}
    });
  }

  follow(id: string){
    return this.sendRequest({
      method: 'post', 
      url: '/follow/' + id
    });
  }

  getUserProfile(id: string){
    return this.sendRequest({
      method: 'get',
      url: '/profile/' + id
    })
  }

  getFriends(page: number){
    return this.sendRequest({
      method: 'get',
      url: '/friends',
      data: {page: page.toString()}
    })
  }

  removeFriendship(id: string){
    return this.sendRequest({
      method: 'post',
      url: '/friends/remove/' + id
    })
  }

  block(id: string){
    return this.sendRequest({
      method: 'post',
      url: '/' + id + '/block'
    })
  }

  report(id: string, message: string){
    return this.sendRequest({
      method: 'post',
      url: '/' + id + '/report',
      data: {message}
    })
  }

  updateEmail(email: string){
    console.log(email);
    
    return this.sendRequest({
      method: 'put',
      url: '/email',
      data: {email}
    })
  }

  updatePassword(data: any){
    console.log(data);
    
    return this.sendRequest({
      method: 'put',
      url: '/password',
      data: data
    })
  }
}
