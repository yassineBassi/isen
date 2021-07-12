import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import Peer from 'peerjs';
import { PermissionService } from './permission.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class WebrtcService {
  static peer: Peer;
  myStream: MediaStream;
  myEl: HTMLMediaElement;
  partnerEl: HTMLMediaElement;

  userId: string;
  partnerId: String;

  stun = 'stun.l.google.com:19302';
  mediaConnection: Peer.MediaConnection;
  options: Peer.PeerJSOption;
  stunServer: RTCIceServer = {
    urls: 'stun:' + this.stun,
  };
  static call;

  constructor(private androidPermission: AndroidPermissions, private permissionService: PermissionService, 
              private router: Router) {
    this.options = {
      key: 'cd1ft79ro8g833di',
      debug: 3
    };
  }


  getMedia() {
    return navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    })
    .then((stream) => {
      this.handleSuccess(stream);
      return true
    }, err => {
      this.handleError(err);
      return false
    })
  }

  async init(myEl: HTMLMediaElement, partnerEl: HTMLMediaElement) {
    return new Promise((resolve, reject) => {
      this.permissionService.getPermission(this.androidPermission.PERMISSION.CAMERA).then(() => {
        this.permissionService.getPermission(this.androidPermission.PERMISSION.RECORD_AUDIO).then(() => {
          this.myEl = myEl;
          this.partnerEl = partnerEl;
          try {
            this.getMedia().then(() => resolve(true), () => reject(true))
          } catch (e) {
            this.handleError(e);
            reject(true)
          }
        })
      })
    })
  }

  async createPeer(userId: string) {
    this.userId = userId
    WebrtcService.peer = new Peer(userId);
    WebrtcService.peer.on('open', () => {
      this.wait();
    });
  }

  callPartner(partnerId: string) {    
    WebrtcService.call= WebrtcService.peer.call(partnerId, this.myStream);

    WebrtcService.call.on('error', (error) => {
      console.log(error);
    })

    WebrtcService.call.on('stream', (stream) => {
      this.partnerEl.srcObject = stream;
    });
  }

  wait() {
    console.log('waiting for a call');
    WebrtcService.peer.on('call', (call) => {
      WebrtcService.call = call;
      console.log('call', WebrtcService.call);
      this.router.navigateByUrl('/messages/video/' + call.peer + '?answer=true')
      // call.answer(this.myStream);
      // call.on('stream', (stream) => {
      //   this.partnerEl.srcObject = stream;0
      // });
    });
  }

  handleSuccess(stream: MediaStream) {
    this.myStream = stream;
    this.myEl.srcObject = stream;
  }

  handleError(error: any) {
    if (error.name === 'ConstraintNotSatisfiedError') {
      // const v = constraints.video;
     // this.errorMsg(`The resolution ${v.width.exact}x${v.height.exact} px is not supported by your device.`);
      this.errorMsg(`The resolution px is not supported by your device.`);
    } else if (error.name === 'PermissionDeniedError') {
      this.errorMsg('Permissions have not been granted to use your camera and ' +
        'microphone, you need to allow the page access to your devices in ' +
        'order for the demo to work.');
    }
    this.errorMsg(`getUserMedia error: ${error.name}`, error);
  }

  errorMsg(msg: string, error?: any) {
    const errorElement = document.querySelector('#errorMsg');
    errorElement.innerHTML += `<p>${msg}</p>`;
    if (typeof error !== 'undefined') {
      console.error(error);
    }
  }

  answer(){
    console.log('answering', WebrtcService.call);
    
    WebrtcService.call.answer(this.myStream)
    WebrtcService.call.on('stream', (stream) => {
      console.log(stream);
      
      this.partnerEl.srcObject = stream;
    });
  }
}
