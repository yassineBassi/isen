import { MessageService } from './../../../services/message.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { AuthService } from './../../../services/auth.service';
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

  more = true
  page = 0;
  sentMessages = {};
  index = 1;
  image: string = null;
  messageText = "";
  connected = false;
  @ViewChild('content') private content: IonContent;

  messages: Message[] = [];
  socket;
  user: User;
  authUser: User;
  pageLoading = false;

  constructor(private camera: Camera, private userService: UserService, private route: ActivatedRoute,
              private nativeStorage: NativeStorage, private messageService: MessageService,
              private platfrom: Platform) { }

  ngOnInit() {
    this.sortMessages();
  }

  ionViewWillEnter(){

    this.platfrom.ready()
    .then(
      () => {
        this.content.scrollToBottom(300);
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
        if(!event) this.messages = [];
        else event.target.compete()
        this.pageLoading = false;
        resp.data.messages.forEach(message => {
          this.messages.push(new Message().initialize(message));
        })
        if(event && !resp.data.more) event.target.disabled = true;
        this.more = resp.data.more;
        console.log(resp.data.more);

      },
      err => {
        console.log(err);
        this.pageLoading = false;

      }
    )
  }

  ngAfterViewInit(){
    // console.log(this.msgContainer);

    // this.msgContainer.nativeElement.scrollTop = 0;:
  }

  sortMessages(){
    // this.messages.sort((msg1, msg2) => msg1.date.getTime() - msg2.date.getTime())
  }

  scrollToBottom(){
    console.log("-----------");

    // console.log(this.msgContainer.nativeElement.scrollHeight);
    // console.log(this.msgContainer.nativeElement.scrollTop);
    // setTimeout(() => {
      // this.content.scrollToBottom(300);
      // this.content.getScrollElement().then(r => r.scrollTo({
      //   top: r.scrollHeight
      // }));
    //   let dimensions = this.content.getContentDimensions();
    //   console.log(dimensions);

    //   this.content.scrollTo(0, dimensions.scrollBottom, 0)
    // this.content.scrollToBottom(300);
    // console.log(this.msgContainer.nativeElement.scrollTop);
    // }, 1000);

  }

  initSocketListeners(){
    this.socket.on('addMessage', (from, user) => {
      alert('message added')
      console.log("from: " + from);
      console.log("user: " + user);
    })

    this.socket.on('messageSent', (message, ind) => {
      if(this.sentMessages[ind])
        this.sentMessages[ind].id = message._id
        this.sentMessages[ind].state = 'sent';

      this.sentMessages[ind] = undefined
    })

    this.socket.on('sendError', () => {
      console.log("error");

    })
  }

  addMessage(){
    const message = new Message();
    message.from = this.authUser.id;
    message.to = this.user.id;
    message.text = this.messageText;
    message.state = '';
    message.createdAt = new Date()

    this.messages.push(message)
    this.sentMessages[this.index++] = message

    this.messageText = "";
    this.socket.emit('addMessage', message.from, message.to, message.text, message.createdAt, this.index)
  }

  pickImage(){
    const options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64 (DATA_URL):
    //  let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.image = 'data:image/jpeg;base64,' + imageData;
      this.addMessage()
    }, (err) => {
     // Handle error
    // alert(err)
    });
  }

  allowToShowDate(ind: number): boolean{
    const currDate = this.messages[ind].createdAt;
    const lastDate = this.messages[ind - 1].createdAt;
    return currDate.getDay() != lastDate.getDay() || currDate.getMonth() != lastDate.getMonth()
        || currDate.getFullYear() != lastDate.getFullYear()
    // return (this.messages[ind].date.getDay() - 1) - (this.messages[ind - 1].date.getDay() - 1);
  }
}
