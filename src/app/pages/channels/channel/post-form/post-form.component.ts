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

  @ViewChild('backColorInput') backColorInput: ElementRef;
  @ViewChild('textColorInput') textColorInput: ElementRef;

  @Output() newPost = new EventEmitter();
  @Input() channelId;

  postLoading = false;

  postBackColor = "#fff";
  postTextColor = "#000";

  postText = "";

  constructor(private channelService: ChannelService, private toastService: ToastService) { }

  ngOnInit() {}

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
        this.newPost.emit(new Post(resp.data));
        this.toastService.presentStdToastr(resp.message);
        this.postText = ""
      },
      err => {
        this.postLoading = false;
        this.toastService.presentStdToastr(err);
      }
    )
  }

  selectBackColor(){
    this.backColorInput.nativeElement.click()
  }

  selectTextColor(){
    this.textColorInput.nativeElement.click()
  }
}
