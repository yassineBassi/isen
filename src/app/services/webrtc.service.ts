import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import Peer from 'peerjs';

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

  constructor(private platform: Platform, private androidPermissions: AndroidPermissions) {
    this.options = {
      key: 'cd1ft79ro8g833di',
      debug: 3
    };
  }

  getPermission(){
    return this.platform.ready().then(() => {
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
        result => true,
        err => {
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA);
          return false;
        }
      );
    });
  }

  getMedia() {
    navigator.mediaDevices.getUserMedia({
        video: true
    })
    .then((stream) => {
      this.handleSuccess(stream);
    }, err => {
      this.handleError(err);
    })
  }

  async init(myEl: HTMLMediaElement, partnerEl: HTMLMediaElement) {
    if(this.getPermission()){
      this.myEl = myEl;
      this.partnerEl = partnerEl;
      try {
        this.getMedia();
      } catch (e) {
        this.handleError(e);
      }
      return true;
    }else{
      return false;
    }
  }

  async createPeer(userId: string) {
    console.log('creating peer for me : ' + userId);
    WebrtcService.peer = new Peer(userId);
    WebrtcService.peer.on('open', () => {
      this.wait();
    });
  }

  call(partnerId: string) {
    const call = WebrtcService.peer.call(partnerId, this.myStream);
    call.on('stream', (stream) => {
      this.partnerEl.srcObject = stream;
    });
  }

  wait() {
    console.log('waiting for a call');
    WebrtcService.peer.on('call', (call) => {
      console.log('there is a call');
      
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
}
