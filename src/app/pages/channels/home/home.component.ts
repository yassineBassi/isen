import { Channel } from './../../../models/Channel';
import { ToastService } from './../../../services/toast.service';
import { ChannelService } from './../../../services/channel.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  pageLoading = false;
  page;
  channels: Channel[];

  constructor(private channelService: ChannelService, private toastService: ToastService) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.page = 0;
    this.getMyChannels();
  }

  getMyChannels(event?, refresh?){
    this.pageLoading = true;
    this.channelService.getMyChannels(this.page)
    .then(
      (resp: any) => {
        this.pageLoading = false;
        if(!event || refresh) this.channels = []
        resp.data.forEach(channel => {
          this.channels.push(new Channel(channel));
        })
        console.log(this.channels);
      },
      err => {
        this.pageLoading = false;
        console.log(err);

      }
    )
  }
}
