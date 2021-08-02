import { OneSignalService } from './../../../services/one-signal.service';
import { ToastService } from './../../../services/toast.service';
import constants from 'src/app/helpers/constants';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Router } from '@angular/router';
import { AuthService } from './../../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { SocketService } from 'src/app/services/socket.service';
import { OneSignal } from '@ionic-native/onesignal/ngx';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent implements OnInit {

  socket = SocketService.socket;
  form: FormGroup
  pageLoading = false;
  validationErrors = {};

  get email(){
    return this.form.get('email').value;
  }

  get password(){
    return this.form.get('password').value;
  }

  constructor(private formBuilder: FormBuilder, private auth: AuthService, private toastService: ToastService,
              private router: Router, private nativeStorage: NativeStorage, private oneSignalService: OneSignalService) {

  }

  ngOnInit() {
    this.initializeForm();
  }

  ionViewWillEnter(){
    this.clearForm();
  }

  initializeForm(){
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    })
  }

  clearForm(){
    this.form.patchValue({
      email: '',
      password: ''
    })
  }

  submit(){
    this.pageLoading = true;
    this.auth.signin({email: this.email, password: this.password})
    .then(
      (resp: any) => {
        this.pageLoading = false;
        this.nativeStorage.setItem('token', resp.data.token);
        this.nativeStorage.setItem('user', resp.data.user);
        this.socket.emit('connect-user', resp.data.user._id);
        this.oneSignalService.open(resp.data.user._id);
        this.router.navigate(['/profile']);
      },
      err => {
        this.pageLoading = false;
        if(err.errors){
          this.validationErrors = err.errors
        }else if(typeof err == "string"){
          this.toastService.presentStdToastr(err);
        }
      }
    )
  }
}
