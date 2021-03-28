import { WebView } from '@ionic-native/ionic-webview/ngx';
import { UploadFileService } from './../../../services/upload-file.service';
import { MessageService } from './../../../services/message.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { User } from './../../../models/User';
import { ActivatedRoute } from '@angular/router';
import { UserService } from './../../../services/user.service';
import { Message } from './../../../models/Message';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, Platform } from '@ionic/angular';
import { io } from 'socket.io-client/';
import constants from 'src/app/helpers/constants';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, AfterViewInit {

  page = 0;
  resend = [];

  sentMessages = {};
  index = 0;

  image: string = null;
  imageFile: File = null;
  messageText = "";

  connected = false;
  @ViewChild('content') private content: IonContent;

  messages: Message[];
  socket;
  user: User;
  authUser: User;
  pageLoading = false;

  constructor(private camera: Camera, private userService: UserService, private route: ActivatedRoute,
              private nativeStorage: NativeStorage, private messageService: MessageService,
              private platfrom: Platform, private uploadFileService: UploadFileService, private webView: WebView) { }

  ngOnInit() {
  }

  ionViewDidEnter(){
    const timer = setInterval(() => {
       if(this.messages && this.messages.length){
        setTimeout(() => {
          this.content.scrollToBottom(200);
        }, 1000);
        clearInterval(timer)
      }
    }, 10)
  }

  ngAfterViewInit(){
    const timer = setInterval(() => {
      if(this.messages && this.messages.length){
        console.log('stop timer');
        this.content.scrollToBottom(200);
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
    this.socket = io(constants.DOMAIN_URL)
    this.socket.emit('addUser', this.authUser.id)
    this.initSocketListeners();
  }

  getAuthUser(){
    this.pageLoading = true;
    this.nativeStorage.getItem('user')
    .then(
      user => {
        this.authUser = new User(user);
        this.initializeSocket();
        this.getUserId();
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
        this.user = new User(resp.data)
        this.initializeSocket();
        this.getMessages(null);
      },
      err => {
      }
    )
  }

  getMessages(event){
    this.messageService.indexMessages(this.user.id, this.page++)
    .then(
      (resp: any) => {
        this.pageLoading = false;

        if(!event){
          this.messages = [];
          resp.data.messages.reverse().forEach(message => {
            this.messages.push(new Message().initialize(message));
          });
        }else{
          event.target.complete()
          resp.data.messages.reverse().forEach(message => {
            this.messages.unshift(new Message().initialize(message));
          });

          if(!resp.data.more) event.target.disabled = true;
        }
      },
      err => {
        console.log(err);
        this.pageLoading = false;
      }
    )
  }


  initSocketListeners(){
    this.socket.on('addMessage', (message) => {
      if(this.user && message.from == this.user.id){
        this.messages.push(new Message().initialize(message));
        setTimeout(() => {
          this.content.scrollToBottom(200)
        }, 100);
      }
    })

    this.socket.on('messageSent', (message, ind) => {
      if(this.sentMessages[ind]){
        this.sentMessages[ind].id = message._id
        this.sentMessages[ind].state = 'sent';
        if(this.resend.includes(ind)) this.resend.splice(this.resend.indexOf(ind), 1)
      }

      this.sentMessages[ind] = undefined
    })

    this.socket.on('sendError', (ind) => {
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
    this.socket.emit('addMessage', {
      text: message.text,
      from: message.from,
      to: message.to,
    }, this.imageFile, ind)
  }

  addMessage(){
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
    // this.image
  }

  pickImage(){
    this.uploadFileService.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY)
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
