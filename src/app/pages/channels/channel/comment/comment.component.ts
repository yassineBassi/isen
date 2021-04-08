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

  deleteLoading = false;

  constructor(private alertCtrl: AlertController, private channelService: ChannelService, private toastService:
             ToastService) { }

  ngOnInit() {}

  commentUserName(comment: Comment){
    const user: User = comment.user as User
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

  async deletePostConf(){
    const alert = await this.alertCtrl.create({
      header: 'Delete Post',
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
}
