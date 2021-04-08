import { Comment } from './../../../../models/Commentt';
import { ToastService } from './../../../../services/toast.service';
import { ChannelService } from './../../../../services/channel.service';
import { Post } from './../../../../models/Post';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent implements OnInit {

  @Output() addComment = new EventEmitter();
  @Input() post: Post;
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
    this.pageLoading = true;
    if(refresh) this.page = 0;
    this.channelService.getComments(this.post.id)
    .then(
      (resp: any) => {
        console.log(resp);

        if(!event || refresh){
          this.comments = [];
        }
        if(event){
          event.target.complete()
          if(!resp.data.more && !refresh) event.target.disabled = true;
        }
        resp.data.forEach(pst => {
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
    this.channelService.storeComment(this.post.id, {text: this.commentText})
    .then(
      (resp: any) => {
        this.addComment.emit(resp.data);
        this.commentText = "";
      },
      err => {
        this.toastService.presentStdToastr(err);
      }
    )
  }

}
