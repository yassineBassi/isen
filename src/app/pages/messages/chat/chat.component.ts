import { Location } from '@angular/common';
import { ToastService } from './../../../services/toast.service';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { UploadFileService } from './../../../services/upload-file.service';
import { MessageService } from './../../../services/message.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { User } from './../../../models/User';
import { ActivatedRoute } from '@angular/router';
import { UserService } from './../../../services/user.service';
import { Message } from './../../../models/Message';
import { Camera } from '@ionic-native/camera/ngx';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, IonInfiniteScroll, Platform } from '@ionic/angular';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {

  page = 0;
  resend = [];

  sentMessages = {};
  index = 0;

  image: string = null;
  imageFile: File = null;
  messageText = "";

  connected = false;
  @ViewChild('content') private content: IonContent;
  @ViewChild('infScroll') private infScroll: IonInfiniteScroll;

  messages: Message[];
  socket = SocketService.socket;
  user: User;
  authUser: User;
  pageLoading = false;

  constructor(private camera: Camera, private userService: UserService, private route: ActivatedRoute,
              private nativeStorage: NativeStorage, private messageService: MessageService,
              private platfrom: Platform, private uploadFileService: UploadFileService, private webView: WebView,
              private toastService: ToastService, private location: Location) { }

  ngOnInit() {
  }

  ionViewDidEnter(){
    const timer = setInterval(() => {
       if(this.messages && this.messages.length){
        setTimeout(() => {
          this.content.scrollToPoint(0, 1000 * 1000)
        }, 1000);
        clearInterval(timer)
      }
    }, 10)
  }

  ionViewWillEnter(){
    this.platfrom.ready()
    .then(
      () => {
        this.getAuthUser();
      }
    )
  }


  initializeSocket(){
    this.initSocketListeners();
  }

  getAuthUser(){
    this.pageLoading = true;
    this.nativeStorage.getItem('user')
    .then(
      user => {
        this.authUser = new User().initialize(user);
        this.initializeSocket();
        this.getUserId();
      },
      err => {
        this.pageLoading = false;
      }
    )
  }

  getUserId(){
    this.route.paramMap
    .subscribe(
      params => {
        const id = params.get('id')
        this.getUser(id)
      }
    )
  }

  getUser(id: string){
    this.userService.getUserProfile(id)
    .then(
      (resp: any) => {
        this.user = new User().initialize(resp.data);
        this.initializeSocket();
        this.getMessages(null);
      },
      err => {
        this.pageLoading = false;
        this.toastService.presentStdToastr('Sorry, this user is not available');
        this.location.back()
      }
    )
  }

  getMessages(event){
    this.messageService.indexMessages(this.user.id, this.page++)
    .then(
      (resp: any) => {
        console.log(resp);

        this.pageLoading = false;

        if(!event){
          this.messages = [];
          resp.data.messages.reverse().forEach(message => {
            this.messages.push(new Message().initialize(message));
          });
          if(!resp.data.more){
            this.infScroll.disabled = true
          }
        }else{
          event.target.complete()
          resp.data.messages.reverse().forEach(message => {
            this.messages.unshift(new Message().initialize(message));
          });
          console.log(resp.data.more);
          if(!resp.data.more) event.target.disabled = true;
        }
      },
      err => {
        console.log(err);
        this.pageLoading = false;
        this.toastService.presentStdToastr('')
      }
    )
  }


  initSocketListeners(){
    this.socket.on('new-message', (message) => {
      if(this.user && message.from == this.user.id){
        this.messages.push(new Message().initialize(message));
        setTimeout(() => {
          this.content.scrollToBottom(200)
        }, 100);
      }
    })

    this.socket.on('message-sent', (message, ind) => {
      if(this.sentMessages[ind]){
        this.sentMessages[ind].id = message._id
        this.sentMessages[ind].state = 'sent';
        if(this.resend.includes(ind)) this.resend.splice(this.resend.indexOf(ind), 1)
      }

      this.sentMessages[ind] = undefined
    })

    this.socket.on('message-not-sent', (ind) => {
      if(this.sentMessages[ind]){
        this.sentMessages[ind].state = 'failed';
        if(this.resend.includes(ind)) this.resend.splice(this.resend.indexOf(ind), 1)
      }
    })
  }

  resendMessage(message){
    this.resend.push(message.id);
    this.sendMessage(message, message.id);
  }

  sendMessage(message, ind){
    this.socket.emit('send-message', {
      text: message.text,
      from: message.from,
      to: message.to,
    }, this.imageFile, ind)
  }

  addMessage(){
    if(!this.messageText && !this.imageFile) return;

    const message = new Message();
    message.id = this.index.toString();
    message.from = this.authUser.id;
    message.to = this.user.id;
    message.text = this.messageText;
    message.state = '';
    message.createdAt = new Date()
    if(this.image){
      message.image = {
        path: this.image,
        type: 'png'
      };
    }

    this.messages.push(message)
    this.sentMessages[this.index] = message

    setTimeout(() => {
      this.content.scrollToBottom(200)
    }, 100);

    this.sendMessage(message, this.index++);

    this.messageText = "";
    this.image = null;
    this.imageFile = null;
  }

  pickImage(){
    this.uploadFileService.takePicture(this.camera.PictureSourceType.CAMERA)
    .then(
      (resp: any) => {
        this.image = this.webView.convertFileSrc(resp.imageData);
        this.imageFile = resp.file;
        this.addMessage();
      }
    )
  }

  allowToShowDate(ind: number): boolean{
    const currDate = {
      year: this.messages[ind].createdAt.toJSON().slice(0, 4),
      month: this.messages[ind].createdAt.toJSON().slice(5, 7),
      day: this.messages[ind].createdAt.toJSON().slice(8, 10)
    }
    if(ind){
      const lastDate = {
        year: this.messages[ind].createdAt.toJSON().slice(0, 4),
        month: this.messages[ind].createdAt.toJSON().slice(5, 7),
        day: this.messages[ind].createdAt.toJSON().slice(8, 10)
      };

      return currDate.day != lastDate.day || currDate.month != lastDate.month
          || currDate.year != lastDate.year
    }
    return true
  }
}
