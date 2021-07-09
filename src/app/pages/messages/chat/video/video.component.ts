import { Location } from '@angular/common';
import { ToastService } from './../../../../services/toast.service';
import { ToastController } from '@ionic/angular';
import { UserService } from './../../../../services/user.service';
import { AuthService } from './../../../../services/auth.service';
import { User } from './../../../../models/User';
import { WebrtcService } from './../../../../services/webrtc.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
})
export class VideoComponent implements OnInit {

  calling = false;
  pageLoading = false;
  topVideoFrame = 'partner-video';
  userId: string;
  partnerId: string;
  myEl: HTMLMediaElement;
  partnerEl: HTMLMediaElement;
  user: User;

  constructor(
    public webRTC: WebrtcService,
    public elRef: ElementRef,
    private route: ActivatedRoute,
    private userService: UserService,
    private toastService: ToastService,
    private location: Location
  ) {}

  ngOnInit() {}

  ionViewDidEnter(){
    const timer = setInterval(() => {
      if(this.init()){
        clearInterval(timer);
      }
    }, 200);
  }

  ionViewWillEnter(){
    this.pageLoading = true;
    this.getUserId();
  }

  getUserId(){
    this.route.paramMap
    .subscribe(
      params => {
        this.userId = params.get('id');
        this.getUser();
      }
    )
  }

  getUser(){
    this.userService.getUserProfile(this.userId)
    .then(
      (resp: any) => {
        this.pageLoading = false;
        this.user = new User().initialize(resp.data);
      },err => {
        this.pageLoading = false;
        this.location.back()
        this.toastService.presentStdToastr("cannot make this call, try again later")
      }
    )
  }

  init() {
    this.myEl = this.elRef.nativeElement.querySelector('#my-video');
    this.partnerEl = this.elRef.nativeElement.querySelector('#partner-video');

    if(this.myEl && this.partnerEl){
      this.webRTC.init(this.myEl, this.partnerEl);
      this.call();
      return true;
    }
    return false;
  }

  call() {
    this.webRTC.call(this.partnerId);
    // this.swapVideo('my-video');
  }

  swapVideo(topVideo: string) {
    this.topVideoFrame = topVideo;
  }

  cancel(){
    this.location.back();
  }

}
