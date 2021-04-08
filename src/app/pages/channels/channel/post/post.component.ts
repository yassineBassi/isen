import { ToastService } from './../../../../services/toast.service';
import { ChannelService } from './../../../../services/channel.service';
import { AlertController } from '@ionic/angular';
import { Post } from './../../../../models/Post';
import { User } from './../../../../models/User';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {

  @Output() removePost = new EventEmitter();
  @Input() post: Post;

  deleteLoading = false;

  constructor(private alertCtrl: AlertController, private channelService: ChannelService, private toastService:
              ToastService) { }

  ngOnInit() {}

  postUserName(post: Post){
    const user: User = post.user as User
    return post.anonyme ? 'Anonyme' : (user.firstName + ' ' + user.lastName);
  }

  deletePost(){
    this.deleteLoading = true;
    this.channelService.deletePost(this.post.id)
    .then(
      (resp: any) => {
        this.deleteLoading = false;
        this.removePost.emit();
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
      message: 'do you really want to delete this post ?',
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
    });
    await alert.present()
  }

  voteOnPost(vote: number){
    this.channelService.voteOnPost(this.post.id, vote)
    .then(
      (resp: any) => {
        console.log(resp);

        this.post.voted = resp.data.voted;
        this.post.votes = resp.data.votes;
      },
      err => {
        this.toastService.presentStdToastr(err);
      }
    )
  }
}
