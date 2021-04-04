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

  constructor(private channelService: ChannelService, private toastService: ToastService) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.page = 0;
    this.getMyChannels();
  }

  search(searchWord: string){
    this.searchWord = searchWord;
    this.getMyChannels();
  }

  getMyChannels(event?, refresh?){
    this.pageLoading = true;
    this.channelService.getMyChannels(this.page, this.searchWord)
    .then(
      (resp: any) => {
        this.pageLoading = false;
        if(!event || refresh) this.channels = []
        resp.data.forEach(channel => {
          this.channels.push(new Channel(channel));
        })
        if(event) event.target.complete();
        if(event && !resp.data.more) event.target.disabled = true;

        console.log(this.channels);
      },
      err => {
        this.pageLoading = false;
        console.log(err);

      }
    )
  }
}
