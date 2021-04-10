import { IonInfiniteScroll } from '@ionic/angular';
import { Comment } from './../../../../models/Commentt';
import { ToastService } from './../../../../services/toast.service';
import { ChannelService } from './../../../../services/channel.service';
import { Post } from './../../../../models/Post';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent implements OnInit {

  @ViewChild('infinitScroll') infinitScroll: IonInfiniteScroll;

  @Output() addComment = new EventEmitter();
  @Input() post: Post;

  anonyme = false;

  commentText = "";

  comments: Comment[];

  page = 0;
  pageLoading = false;

  constructor(private channelService: ChannelService, private toastService: ToastService) { }

  ngOnInit() {}

  ionViewWillEnter(){
    this.getComments();
  }

  getComments(event?, refresh?){
    if(!event) this.pageLoading = true;
    if(refresh) this.page = 0;
    this.channelService.getComments(this.post.id)
    .then(
      (resp: any) => {
        console.log(resp);

        if(!event || refresh){
          this.comments = [];
        }

        if(refresh) this.infinitScroll.disabled = false

        if(event){
          event.target.complete()
          if(!resp.data.more && !refresh) event.target.disabled = true;
        }
        resp.data.comments.forEach(pst => {
          this.comments.push(new Comment(pst));
        })
        this.pageLoading = false;
      },
      err => {
        this.pageLoading = false;
      }
    )
  }

  storeComment(){
    if(!this.commentText.length) return;
    this.channelService.storeComment(this.post.id, {text: this.commentText, anonyme: this.anonyme})
    .then(
      (resp: any) => {
        this.comments.unshift(new Comment(resp.data))
        this.commentText = "";
      },
      err => {
        this.toastService.presentStdToastr(err);
      }
    )
  }

  removeComment(commentInd: number){
    this.comments.splice(commentInd, 1);
  }

}
