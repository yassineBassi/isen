import { Location } from '@angular/common';
import { ToastService } from './../../../../services/toast.service';
import { ToastController } from '@ionic/angular';
import { UserService } from './../../../../services/user.service';
import { AuthService } from './../../../../services/auth.service';
import { User } from './../../../../models/User';
import { WebrtcService } from './../../../../services/webrtc.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { SocketService } from 'src/app/services/socket.service';

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
  myEl: HTMLMediaElement;
  partnerEl: HTMLMediaElement;
  partner: User;
  user: User;
  answer = false;
  answered = false;
  socket = SocketService.socket;
  audio: HTMLAudioElement;
  audioEnabled = true
  cameraEnabled = true;

  constructor(
    public webRTC: WebrtcService,
    public elRef: ElementRef,
    private route: ActivatedRoute,
    private userService: UserService,
    private toastService: ToastService,
    private location: Location,
    private nativeStorage: NativeStorage
  ) {}

  ngOnInit() {}

  ionViewWillEnter(){
    this.pageLoading = true;
    this.getUserId();
  }

  cancelListener(){
    this.socket.on('video-canceled', () => {
      if(this.audio) this.audio.pause();
      this.playAudio("./../../../../../assets/audio/call-cenceled.mp3")
      setTimeout(() => {
        this.cancel();
      }, 2000);
    })
  }

  getUserId(){
    this.route.paramMap
    .subscribe(
      params => {
        this.userId = params.get('id');
        this.route.queryParamMap.subscribe(
          query => {
            this.answer = query.get('answer') ? true : false;
            this.getUser();
          }
        )
      }
    )
  }

  getUser(){
    this.userService.getUserProfile(this.userId)
    .then(
      (resp: any) => {
        this.pageLoading = false;
        this.partner = new User().initialize(resp.data);
        this.getAuthUser();
      },err => {
        this.pageLoading = false;
        this.location.back()
        this.toastService.presentStdToastr("cannot make this call, try again later")
      }
    )
  }

  getAuthUser(){
    this.nativeStorage.getItem('user').then(resp => {
      this.user = new User().initialize(resp);
      this.socket.emit('connect-user', this.user.id)
      const timer = setInterval(() => {
        if(this.init()){
          if(this.answer) this.playAudio("./../../../../../assets/audio/phone-ringing.mp3");
          this.cancelListener();
          clearInterval(timer);
        }
      }, 200);
    })
  }

  playAudio(src){
    this.audio = new Audio();
    this.audio.src = src
    this.audio.load();
    this.audio.loop = true;
    this.audio.play();
  }

  init() {
    this.myEl = document.querySelector('#my-video');
    this.partnerEl = this.elRef.nativeElement.querySelector('#partner-video');

    if(this.myEl && this.partnerEl){
      this.webRTC.init(this.myEl, this.partnerEl).then(
        () => {if(!this.answer) this.call()}
      )
      return true
    }
    return false;
  }

  call() {
    this.playAudio("./../../../../../assets/audio/ringing.mp3");
    this.webRTC.callPartner(this.partner.id);
    this.waitForAnswer();
  }

  waitForAnswer(){
    const timer = setInterval(() => {
      if(this.partnerEl && this.partnerEl.srcObject){
        if(this.audio) this.audio.pause();
         this.answered = true;
         this.swapVideo('my-video');
         clearInterval(timer);
      }
    }, 10)
  }

  swapVideo(topVideo: string) {
    this.topVideoFrame = topVideo;
  }

  closeCall(){
    this.socket.emit('cancel-video', this.partner.id);
    this.cancel();
  }

  cancel(){
    if(this.audio) this.audio.pause();
    try {
      WebrtcService.call.close();
    } catch (error) {
      console.log(error);
    }
    this.location.back();
  }

  answerCall(){
    if(this.audio) this.audio.pause();
    this.webRTC.answer();
    this.waitForAnswer();
  }

  toggleCamera(){
    this.cameraEnabled = this.webRTC.toggleCamera();
  }
  toggleAudio(){
    this.audioEnabled = this.webRTC.toggleAudio();
  }
  toggleCameraDirection(){
    this.webRTC.toggleCameraDirection();
  }

}
