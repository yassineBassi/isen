import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { AuthService } from './../../../services/auth.service';
import { UserService } from './../../../services/user.service';
import { User } from './../../../models/User';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {

  pageLoading = false;
  user: User
  educationDegrees = [
    'High school',
    'College',
    'Associates degree',
    'Bachlors degree',
    'Graduate degree',
    'PhD'
  ];
  interests: string[];
  newInterest: string;
  form: FormGroup;

  constructor(private userService: UserService, private router: Router, private auth: AuthService,
              private nativeStorage: NativeStorage, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.getUser();
    this.intiializeForm();
  }

  formPatchValues(){
    this.form.patchValue({
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      gender: this.user.gender,
      birthDate: this.user.birthDate.toJSON().slice(0, 10),
      school: this.user.school,
      profession: this.user.profession,
      education: this.user.education
    });
    console.log(this.user.birthDate.toJSON().slice(0, 10));
    this.interests = this.user.interests;
  }

  intiializeForm(){
    this.form = this.formBuilder.group({
      firstName:  ['', [Validators.required, Validators.max(50)]],
      lastName:  ['', [Validators.required, Validators.max(50)]],
      gender:  ['', [Validators.required]],
      birthDate: ['', [Validators.required]],
      address: ['', [Validators.max(255)]],
      school:  ['', [Validators.max(50)]],
      education:  ['', [Validators.max(30)]],
      profession:  ['', [Validators.max(30)]],
      interest: ['', [Validators.required]]
    })
  }

  addInterest(){
    this.user.addInterest(this.newInterest);
    this.newInterest = "";
  }

  save(){
    this.router.navigate(['/profile']);
  }

  getUser(){
    this.pageLoading = true;
    this.auth.getAuthUser()
    .then(
      (resp: any) => {
        this.user = new User();
        this.user.initialize(resp.data);
        this.nativeStorage.setItem('user', this.user);
        this.formPatchValues();
        console.log(this.user);
        this.pageLoading = false;
      },
      err => {
        this.pageLoading = false;
        console.log(err);
      }
    )
  }
}
