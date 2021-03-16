import { AuthService } from './../../../services/auth.service';
import { Router } from '@angular/router';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {

  gender = "male";
  step = 0;
  steps = ['email', 'name', 'password', 'birthDate', 'gender', 'success']
  validationErrors = {};
  btnLoading = false;
  pageLoading = false;
  form: FormGroup

  get email(){
    return this.form.get('email').value;
  }

  get password(){
    return this.form.get('password').value;
  }

  get password_confirmation(){
    return this.form.get('password_confirmation').value;
  }

  constructor(private router: Router, private auth: AuthService, private formBuilder: FormBuilder,
              private cdr: ChangeDetectorRef) { }

  ionViewWillEnter(){
    this.step = 0;
  }

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm(){
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.max(50)]],
      password: ['', [Validators.required, Validators.min(8)]],
      password_confirmation: ['', [Validators.required, Validators.min(8)]],
      firstName: ['', [Validators.required, Validators.max(50)]],
      lastName: ['', [Validators.required, Validators.max(50)]],
      birthDate: ['', [Validators.required]],
    })
  }

  continue(){
    if(this.steps[this.step] == 'email') this.verifyEmail();
    else if(this.step < this.steps.length - 2){
      this.validationErrors[this.steps[this.step]] = undefined;
      this.step++;
    }
    else this.submit()
  }

  back(){
    if(this.step > 0) this.step--;
    else this.router.navigate(['/auth/home'])
  }

  getUserInfo(){
    return {
      firstName: this.form.get('firstName').value,
      lastName: this.form.get('lastName').value,
      email: this.form.get('email').value,
      password: this.form.get('password').value,
      password_confirmation: this.form.get('password_confirmation').value,
      gender: this.gender,
      birthDate: this.form.get('birthDate').value
    }
  }

  backToError(){
    for(let ind = 0; ind < this.steps.length; ++ind){
      const step = this.steps[ind]
      if(this.validationErrors[step] || (step == 'name' && (this.validationErrors['firstName'] || this.validationErrors['lastName']))){
        console.log("selected ind : " + ind);
        this.step = ind;
        break;
      }
    }
  }

  verifyEmail(){
    this.btnLoading = true;
    this.auth.verifyEmail(this.email)
    .then((resp: any) => {
      console.log(resp);
        this.btnLoading = false;
        this.cdr.detectChanges();
        if(!resp.data) ++this.step;
        else this.validationErrors['email'] = ['this email is already existe'];
    }, err => {
        this.btnLoading = false;
        if(err.errors) this.validationErrors = err.errors;
        else if(err.status == 500){

        }
    })
  }

  submit(){
    this.pageLoading = true
    this.validationErrors = {};
    this.auth.signup(this.getUserInfo())
    .then(resp => {
      this.pageLoading = false;
      this.step++;
    }, err => {
      this.pageLoading = false;
      if(err.errors){
        this.validationErrors = err.errors;
        this.backToError();
        console.log(err.errors);
      }
    })
  }

  isValid(){
    if(this.steps[this.step] == 'name'){
      return this.form.get('firstName').valid && this.form.get('lastName');
    }else if(this.steps[this.step] == 'password'){
      return this.form.get('password').valid && this.form.get('password').value === this.form.get('password_confirmation').value;
    }else if(this.steps[this.step] != 'gender'){
      return this.form.get(this.steps[this.step]).valid;
    }
    return true
  }
}
