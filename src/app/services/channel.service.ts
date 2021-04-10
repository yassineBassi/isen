import { Router } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { DataService } from './data.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChannelService extends DataService {

  constructor(nativeStorage: NativeStorage, http: HTTP, geo: Geolocation, router: Router) {
    super('channel', nativeStorage, http, geo, router)
  }

  myChannels(page: number, search: string){
    return this.sendRequest('get', '', {page: page.toString(), search})
  }

  followedChannels(page: number, search: string){
    return this.sendRequest('get', '/followed', {page: page.toString(), search})
  }

  exploreChannels(page: number, search: string, city: string){
    return this.sendRequest('get', '/explore', {page: page.toString(), search, city})
  }

  store(data){
    return this.sendRequest('post', '', data, {}, 'multipart');
  }

  follow(id: string){
    return this.sendRequest('post', '/follow/' + id, {});
  }

  getPosts(id: string, page: number){
    return this.sendRequest('get', '/' + id + '/post/', {page: page.toString()})
  }

  storePost(id: string, data){
    return this.sendRequest('post', '/' + id + '/post', data)
  }

  deletePost(id: string){
    return this.sendRequest('delete', '/post/' + id, {})
  }

  voteOnPost(id: string, vote: number){
    return this.sendRequest('post', '/post/' + id + '/vote', {vote})
  }

  storeComment(id: string, data){
    return this.sendRequest('post', '/post/' + id + '/comment', data)
  }

  getComments(id: string){
    return this.sendRequest('get', '/post/' + id + '/comment', {})
  }

  deleteComment(id: string){
    return this.sendRequest('delete', '/post/comment/' + id, {})
  }

  voteOnComment(id: string, vote: number){
    return this.sendRequest('post', '/post/comment/' + id + '/vote', {vote})
  }
}
