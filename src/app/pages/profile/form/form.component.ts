import { ListSearchComponent } from './../../list-search/list-search.component';
import { ToastService } from './../../../services/toast.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { AuthService } from './../../../services/auth.service';
import { UserService } from './../../../services/user.service';
import { User } from './../../../models/User';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import countriesObject from './../../../helpers/countries'
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {

  countires: string[];
  cities: string[];
  selectedCountry: string;
  selectedCity: string;

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
  validatoErrors = {}
  interests: string[] = [];
  form: FormGroup;

  get firstName(){
    return this.form.get('firstName')
  }
  get lastName(){
    return this.form.get('lastName')
  }
  get gender(){
    return this.form.get('gender')
  }
  get birthDate(){
    return this.form.get('birthDate')
  }
  get address(){
    return this.form.get('address')
  }
  get school(){
    return this.form.get('school')
  }
  get education(){
    return this.form.get('education')
  }
  get profession(){
    return this.form.get('profession')
  }
  get interest(){
    return this.form.get('interest');
  }

  constructor(private userService: UserService, private router: Router, private auth: AuthService,
              private nativeStorage: NativeStorage, private formBuilder: FormBuilder,
              private toastService: ToastService, private modalController: ModalController) { }

  ngOnInit() {
    this.getUser();
    this.intiializeForm();
    this.countires = Object.keys(countriesObject);
  }

  intiializeForm(){
    this.form = this.formBuilder.group({
      firstName:  ['', [Validators.required, Validators.max(50)]],
      lastName:  ['', [Validators.required, Validators.max(50)]],
      gender:  ['', [Validators.required]],
      birthDate: ['', [Validators.required]],
      city: ['', [Validators.required]],
      address: ['', [Validators.max(255)]],
      school:  ['', [Validators.max(50)]],
      education:  ['', [Validators.max(30)]],
      profession:  ['', [Validators.max(30)]],
      interest: ['', [Validators.required]]
    })
  }

  formPatchValues(){
    this.form.patchValue({
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      gender: this.user.gender,
      birthDate: this.user.birthDate.toJSON().slice(0, 10),
      address: this.user.address,
      school: this.user.school,
      profession: this.user.profession,
      education: this.user.education
    });
    console.log(this.user.birthDate.toJSON().slice(0, 10));
    this.interests = this.user.interests;
  }

  getUserForm(){
    return {
      firstName: this.firstName.value,
      lastName: this.lastName.value,
      gender: this.gender.value,
      birthDate: this.birthDate.value,
      address: this.address.value,
      school: this.school.value,
      profession: this.profession.value,
      education: this.education.value,
      interests: this.interests
    }
  }

  addInterest(){
    if(!this.interests.includes(this.interest.value) && this.interest.valid){
      console.log('hi wtf');
      this.interests.push(this.interest.value);
      if(this.interests) this.sortInterests();
      console.log(this.interests);
      this.form.patchValue({
        interest: ''
      })
    }
  }

  public removeInterest(ind: number): void{
    this.interests.splice(ind, 1);
    this.sortInterests();
  }

  private sortInterests(){
    this.interests = this.interests.sort((int1, int2) => {
      return int1.length - int2.length;
    })
  }

  submit(){
    this.pageLoading = true;
    console.log(this.getUserForm());
    this.userService.update(this.user.id, this.getUserForm())
    .then(
      resp => {
        this.pageLoading = false;
        console.log(resp);
        this.toastService.presentSuccessToastr('your info has been updated successfully')
      }, err => {
        this.pageLoading = false;
        if(err.errors){
          this.validatoErrors = err.errors;
          this.toastService.presentErrorToastr('invalid data');
        }else if(typeof err == 'string'){
          this.toastService.presentErrorToastr(err);
        }
        console.log(err);
      }
    )
  }

  getUser(){
    this.pageLoading = true;
    this.auth.getAuthUser()
    .then(
      (resp: any) => {
        this.user = new User(resp.data);
        this.selectedCountry = this.user.country;
        if(this.user.country && countriesObject[this.user.country])
          this.cities = countriesObject[this.user.country];

        this.form.patchValue({
          city: this.user.city
        })
          this.selectedCity = this.user.city
        this.nativeStorage.setItem('user', this.user);
        this.formPatchValues();
        console.log(this.user);
        this.pageLoading = false;
      },
      err => {
        this.pageLoading = false;
        console.log(err);
        this.toastService.presentErrorToastr('enexpected error occured, please try again later')
      }
    )
  }

  async presentCountriesModal(){
    const modal = await this.modalController.create({
      componentProps: {
        data: this.countires,
        title: 'Countries'
      },
      component: ListSearchComponent
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    this.selectedCountry = data.data;
    this.cities = countriesObject[this.selectedCountry];
    this.form.patchValue({
      city: ''
    })
  }

}
