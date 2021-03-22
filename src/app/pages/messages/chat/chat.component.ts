import { User } from './../../../models/User';
import { ActivatedRoute } from '@angular/router';
import { UserService } from './../../../services/user.service';
import { Message } from './../../../models/Message';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { io, Socket } from 'socket.io-client/';
import constants from 'src/app/helpers/constants';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, AfterViewInit {

  image: string = null;
  messageText = "";
  connected = false;
  @ViewChild('content') private content: IonContent;

  messages: Message[] = [
    new Message(
      0,
      'lorem test text od chat box 05/12/2020',
      new Date('12-05-2020'),
      true,
      null
    ),
    new Message(
      0,
      'lorem test text od chat box 24/08/2020',
      new Date('08-24-2020'),
      false,
      null
    ),
    new Message(
      0,
      'lorem test text od chat box 05/12/2020 2',
      new Date('12-05-2020'),
      true,
      null
    ),
  ];
  socket;
  user: User;
  pageLoading = false;

  constructor(private camera: Camera, private userService: UserService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.sortMessages();
  }

  ionViewWillEnter(){
    this.content.scrollToBottom(300);
    this.socket = io(constants.DOMAIN_URL)
    this.getUserId();
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
    this.pageLoading = true;
    this.userService.getUserProfile(id)
    .then(
      (resp: any) => {
        this.pageLoading = false;
        this.user = new User(resp.data)
      },
      err => {
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

  addMessage(){
    console.log('hii')
    this.socket.emit('add-message', {
      message: this.messageText,

    })
    // if(this.messageText.length || this.image){
    //   this.messages.push(new Message(
    //     0,
    //     this.messageText,
    //     new Date(),
    //     true,
    //     this.image
    //   ));
    //   this.messageText = "";
    //   this.image = null;
    //   setTimeout(() => {
    //     this.scrollToBottom();
    //   }, 100);
    // }
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
    const currDate = this.messages[ind].date;
    const lastDate = this.messages[ind - 1].date;
    return currDate.getDay() != lastDate.getDay() || currDate.getMonth() != lastDate.getMonth()
        || currDate.getFullYear() != lastDate.getFullYear()
    // return (this.messages[ind].date.getDay() - 1) - (this.messages[ind - 1].date.getDay() - 1);
  }
}
