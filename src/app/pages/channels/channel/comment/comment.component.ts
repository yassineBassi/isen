import { Router } from '@angular/router';
import { ToastService } from './../../../../services/toast.service';
import { ChannelService } from './../../../../services/channel.service';
import { AlertController } from '@ionic/angular';
import { User } from './../../../../models/User';
import { Comment } from './../../../../models/Commentt';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent implements OnInit {

  @Output() removeComment = new EventEmitter();
  @Input() comment: Comment;
  @Input() backgroundColor: string;
  @Input() color: string;
  @Input() user: User;

  deleteLoading = false;

  constructor(private alertCtrl: AlertController, private channelService: ChannelService, private toastService:
             ToastService, private router: Router) { }

  ngOnInit() {}

  commentUserName(comment: Comment){
    const user = comment.user
    return comment.anonyme ? 'Anonyme' : (user.firstName + ' ' + user.lastName);
  }

  deletePost(){
    this.deleteLoading = true;
    this.channelService.deleteComment(this.comment.id)
    .then(
      (resp: any) => {
        this.deleteLoading = false;
        this.removeComment.emit();
        this.toastService.presentStdToastr(resp.message);
      },
      err => {
        this.deleteLoading = false;
        this.toastService.presentStdToastr(err);
      }
    )
  }

  async deleteCommentConf(){
    const alert = await this.alertCtrl.create({
      header: 'Delete Comment',
      message: 'do you really want to delete this comment ?',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Yes',
          handler: () => {
            this.deletePost();
          },
          cssClass: "text-danger"
        }
      ]
    })
    await alert.present()
  }

  voteOnComment(vote: number){
    this.channelService.voteOnComment(this.comment.id, vote)
    .then(
      (resp: any) => {
        this.comment.voted = resp.data.voted;
        this.comment.votes = resp.data.votes;
      },
      err => {
        this.toastService.presentStdToastr(err);
      }
    )
  }

  showUserProfile(id: string){
    if(!this.comment.anonyme)
      this.router.navigate(['/profile/display/' + id])
  }
}
