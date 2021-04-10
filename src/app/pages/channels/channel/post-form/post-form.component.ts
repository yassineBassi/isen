import { ModalController } from '@ionic/angular';
import { Post } from './../../../../models/Post';
import { ToastService } from './../../../../services/toast.service';
import { ChannelService } from './../../../../services/channel.service';
import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss'],
})
export class PostFormComponent implements OnInit {
  @Input() channelId;

  colors = [
    {
      background: '#f7f731',
      text: '#000'
    },
    {
      background: '#ff6eca',
      text: '#fff'
    },
    {
      background: '#ffa6dd',
      text: '#000'
    },
    {
      background: '#7494a1',
      text: '#fff'
    },
    {
      background: '#a3baa0',
      text: '#000'
    },
    {
      background: '#9999ff',
      text: '#000'
    },
    {
      background: '#ffb9b5',
      text: '#000'
    }
  ];

  postLoading = false;

  postBackColor = "#fff";
  postTextColor = "#000";

  postText = "";

  constructor(private channelService: ChannelService, private toastService: ToastService, private modalCtrl:
              ModalController) { }

  ngOnInit() {}

  ionViewWillEnter(){
    const randomInd = Math.round(Math.random() * (this.colors.length - 1))
    this.selectColor(this.colors[randomInd]);
  }

  addPost(){
    this.postLoading = true;
    this.channelService.storePost(this.channelId, {
      text: this.postText,
      backgroundColor: this.postBackColor,
      color: this.postTextColor
    })
    .then(
      (resp: any) => {
        this.postLoading = false;
        this.toastService.presentStdToastr(resp.message);
        this.postText = "";
        this.modalCtrl.dismiss({
          post: new Post(resp.data)
        })
      },
      err => {
        this.postLoading = false;
        this.toastService.presentStdToastr(err);
      }
    )
  }

  selectColor(color){
    this.postBackColor = color.background;
    this.postTextColor = color.text;
  }
}
