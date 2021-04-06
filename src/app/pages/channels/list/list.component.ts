import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { ActivatedRoute } from '@angular/router';
import { Channel } from './../../../models/Channel';
import { ToastService } from './../../../services/toast.service';
import { ChannelService } from './../../../services/channel.service';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {

  user: User;
  pageLoading = false;
  page: number;
  channels: Channel[];
  searchWord = "";
  anonyme: boolean;
  type: string;

  followLoading = [];

  constructor(private channelService: ChannelService, private toastService: ToastService,
              private route: ActivatedRoute, private nativeStorage: NativeStorage) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.page = 0;
    this.getType();
  }

  getType(){
    this.route.paramMap
    .subscribe(params => {
      this.type = params.get('type');
      if(this.type == 'explore'){
        this.nativeStorage.getItem('user')
        .then(
          user => {
            this.user = new User(user);
            this.getChannels();
          }
        )
      }
      else this.getChannels();
    })
  }

  search(searchWord: string){
    this.searchWord = searchWord;
    this.getChannels();
  }

  handleResponse(resp, event, refresh){
    this.pageLoading = false;
    if(!event || refresh) this.channels = []
    resp.data.forEach(channel => {
      this.channels.push(new Channel(channel));
    })
    console.log(resp);
    if(event) event.target.complete();
    if(event && !resp.data.more) event.target.disabled = true;
  }

  handleError(err){
    this.pageLoading = false;
    this.toastService.presentStdToastr(err);
    console.log(err);
  }

  getChannels(event?, refresh?){
    this.pageLoading = true;
    if(refresh) this.page = 0;
    if(this.type == 'mines'){
      this.channelService.myChannels(this.page++, this.searchWord)
      .then(
        (resp: any) => this.handleResponse(resp, event, refresh),
        err => this.handleError(err)
      );
    }
    if(this.type == 'followed'){
      this.channelService.followedChannels(this.page++, this.searchWord)
      .then(
        (resp: any) => this.handleResponse(resp, event, refresh),
        err => this.handleError(err)
      );
    }
    if(this.type == 'explore'){
      this.channelService.exploreChannels(this.page++, this.searchWord)
      .then(
        (resp: any) => this.handleResponse(resp, event, refresh),
        err => this.handleError(err)
      );
    }
  }

  follow(channel: Channel){
    this.followLoading.push(channel.id);
    this.channelService.follow(channel.id)
    .then(
      (resp: any) => {
        this.followLoading.splice(this.followLoading.indexOf(channel.id), 1);
        this.toastService.presentStdToastr(resp.message);
        channel.followed = resp.data;
      },
      err => {
        this.followLoading.splice(this.followLoading.indexOf(channel.id), 1);
        this.toastService.presentStdToastr(err);
      }
    )
  }
}
