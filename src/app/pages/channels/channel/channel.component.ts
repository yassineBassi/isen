import { User } from './../../../models/User';
import { ToastService } from './../../../services/toast.service';
import { Post } from './../../../models/Post';
import { ActivatedRoute } from '@angular/router';
import { PostService } from './../../../services/post.service';
import { ChannelService } from './../../../services/channel.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss'],
})
export class ChannelComponent implements OnInit {

  channelId: string;
  channelName: string;

  pageLoading = false;

  posts: Post[];
  page = 0;

  showPostForm = false;

  constructor(private channelService: ChannelService, private route: ActivatedRoute, private toastService:
              ToastService) { }

  ngOnInit() {}

  ionViewWillEnter(){
    this.pageLoading = true;
    this.getChannelParams();
  }

  getChannelParams(){
    this.route.queryParamMap
    .subscribe(
      params => {
        this.pageLoading = false;
        this.channelId = params.get('id');
        this.channelName= params.get('name');
        this.getChannelPosts();
      }
    )
  }

  getChannelPosts(event?, refresh?){
    this.pageLoading = true;
    if(refresh) this.page = 0;
    this.channelService.getPosts(this.channelId, this.page++)
    .then(
      (resp: any) => {
        console.log(resp);

        if(!event || refresh){
          this.posts = [];
        }
        if(event){
          event.target.complete()
          if(!resp.data.more && !refresh) event.target.disabled = true;
        }
        resp.data.forEach(pst => {
          this.posts.push(new Post(pst));
        })
        this.pageLoading = false;
      },
      err => {
        this.pageLoading = false;
      }
    )
  }
  addPost(post: Post){
    this.posts.unshift(post);
  }
  deletePost(post: Post){
    this.posts.splice(this.posts.indexOf(post), 1);
  }
}
