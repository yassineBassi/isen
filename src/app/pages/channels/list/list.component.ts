import { ActivatedRoute } from '@angular/router';
import { Channel } from './../../../models/Channel';
import { ToastService } from './../../../services/toast.service';
import { ChannelService } from './../../../services/channel.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {

  pageLoading = false;
  page: number;
  channels: Channel[];
  searchWord = "";
  anonyme: boolean;
  type: string;

  constructor(private channelService: ChannelService, private toastService: ToastService,
              private route: ActivatedRoute) { }

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
      this.getMyChannels();
    })
  }

  search(searchWord: string){
    this.searchWord = searchWord;
    this.getMyChannels();
  }

  handleResponse(resp, event, refresh){
    this.pageLoading = false;
    if(!event || refresh) this.channels = []
    resp.data.forEach(channel => {
      this.channels.push(new Channel(channel));
    })
    if(event) event.target.complete();
    if(event && !resp.data.more) event.target.disabled = true;

    console.log(this.channels);
  }

  handleError(err){
    this.pageLoading = false;
    console.log(err);
  }

  getMyChannels(event?, refresh?){
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
  }
}
