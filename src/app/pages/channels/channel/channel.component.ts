import { PostService } from './../../../services/post.service';
import { ChannelService } from './../../../services/channel.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss'],
})
export class ChannelComponent implements OnInit {

  pageLoading = false;

  constructor(private postService: PostService) { }

  ngOnInit() {}

  ionViewWillEnter(){
    this
  }

  getChannelPosts(){

  }

}
