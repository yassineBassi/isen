import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { DropDownComponent } from './../../drop-down/drop-down.component';
import { PostFormComponent } from './post-form/post-form.component';
import { IonInfiniteScroll, ModalController, IonContent, PopoverController, AlertController } from '@ionic/angular';
import { User } from './../../../models/User';
import { ToastService } from './../../../services/toast.service';
import { Post } from './../../../models/Post';
import { ActivatedRoute, Router } from '@angular/router';
import { ChannelService } from './../../../services/channel.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss'],
})
export class ChannelComponent implements OnInit {
  @ViewChild('infinitScroll') infinitScroll: IonInfiniteScroll;
  @ViewChild('content') content: IonContent;

  anonyme = false;

  channelId: string;
  channelIsFollowed: boolean;
  myChannel: boolean
  channelName: string;

  user: User;

  pageLoading = false;

  posts: Post[];
  page = 0;

  constructor(private channelService: ChannelService, private route: ActivatedRoute, private modalCtrl:
              ModalController,private popoverController: PopoverController, private alertCtrl:
              AlertController, private toastService: ToastService, private router: Router, private nativeStorage:
              NativeStorage) { }

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
        this.channelIsFollowed = params.get('channelIsFollowed') == 'true' ? true : false;
        this.myChannel = params.get('myChannel') == 'true' ? true : false;
        this.nativeStorage.getItem('user')
        .then(
          user => {
            this.user = new User().initialize(user);
            this.getChannelPosts();
          }
        )
      }
    )
  }

  getChannelPosts(event?, refresh?){
    if(!event) this.pageLoading = true;
    if(refresh) this.page = 0;
    this.channelService.getPosts(this.channelId, this.page++)
    .then(
      (resp: any) => {
        console.log(resp);

        if(!event || refresh){
          this.posts = [];
        }

        if(refresh) this.infinitScroll.disabled = false

        if(event){
          event.target.complete()
          if(!resp.data.more && !refresh) event.target.disabled = true;
        }
        resp.data.posts.forEach(pst => {
          this.posts.push(new Post().initialize(pst));
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
    this.content.scrollToTop(200)
  }

  deletePost(post: Post){
    this.posts.splice(this.posts.indexOf(post), 1);
  }

  async showPostForm(){
    const modal = await this.modalCtrl.create({
      component: PostFormComponent,
      componentProps: {
        channelId: this.channelId
      }
    });
    await modal.present()
    const { data } = await modal.onWillDismiss();
    if(data.post)
      this.addPost(data.post);
  }

  async presentPopover(ev: any) {
    const popoverItems = [];
    console.log(this.myChannel);

    if(this.myChannel){
      popoverItems.push(
        {
          text: 'Delete',
          icon: 'fas fa-trash-alt',
          event: 'delete'
        }
      )
    }else {
      popoverItems.push(
        {
          text: this.channelIsFollowed ? 'Unfollow' : 'Follow',
          icon: this.channelIsFollowed ? 'fas fa-minus-circle' :  'fas fa-plus',
          event: 'follow'
        }
      )
    }
    const popover = await this.popoverController.create({
      component: DropDownComponent,
      event: ev,
      showBackdrop: false,
      componentProps: {
        items: popoverItems
      }
    });
    await popover.present();

    const { data } = await popover.onDidDismiss();
    if(data.event){
      if(data.event == 'follow'){
        if(this.channelIsFollowed)
          this.togglefollowConf();
        else
          this.togglefollow();
      }
      else if(data.event == 'delete') this.deleteConf();
    }
  }

  async togglefollowConf(){
    const alert = await this.alertCtrl.create({
      header: 'Unfollow Channel',
      message: 'do you really want to unfollow this channel ?',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Yes',
          handler: () => {
            this.togglefollow();
          },
          cssClass: "text-danger"
        }
      ]
    });
    await alert.present()
  }

  togglefollow(){
    this.channelService.follow(this.channelId)
    .then(
      (resp: any) => {
        this.toastService.presentStdToastr(resp.message);
        this.channelIsFollowed = resp.data;
      },
      err => {
        this.toastService.presentStdToastr(err)
      }
    )
  }

  async deleteConf(){
    const alert = await this.alertCtrl.create({
      header: 'Delete Channel',
      message: 'do you really want to delete this channel ?',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Yes',
          handler: () => {
            this.deleteChannel();
          },
          cssClass: "text-danger"
        }
      ]
    });
    await alert.present()
  }

  deleteChannel(){
    this.channelService.deleteChannel(this.channelId)
    .then(
      (resp: any) => {
        this.toastService.presentStdToastr(resp.message)
        this.router.navigateByUrl('/channels/list/mines')
      },
      err => {
        this.toastService.presentStdToastr(err)
      }
    )
  }

}
