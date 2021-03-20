import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Router } from '@angular/router';
import { AuthService } from './../../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent implements OnInit {

  form: FormGroup
  pageLoading = false;
  validationErrors = {};

  get email(){
    return this.form.get('email').value;
  }

  get password(){
    return this.form.get('password').value;
  }

  constructor(private formBuilder: FormBuilder, private auth: AuthService, private toastController: ToastController,
              private router: Router, private nativeStorage: NativeStorage) {

  }

  ngOnInit() {
    this.initializeForm();
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
        this.router.navigate(['/profile']);
        this.clearForm();
      },
      err => {
        console.log(err);
        this.pageLoading = false;
        if(err.errors){
          this.validationErrors = err.errors
        }else if(typeof err == "string"){
          this.presentToast(err);
        }
      }
    )
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: "danger",
      cssClass: 'mb-5',
      position: 'bottom',
      translucent: true,
      keyboardClose: true,
    });
    toast.present();
  }

}
