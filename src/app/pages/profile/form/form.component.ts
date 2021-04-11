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
import professions from './../../../helpers/professions'
import interests from './../../../helpers/interests'
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {

  selectedProfession: string;
  selectedInterest: string;

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
  get school(){
    return this.form.get('school')
  }
  get education(){
    return this.form.get('education')
  }
  get city(){
    return this.form.get('city')
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
      education:  ['', [Validators.max(30)]]
    })
  }

  formPatchValues(){
    this.form.patchValue({
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      gender: this.user.gender,
      birthDate: this.user.birthDate.toJSON().slice(0, 10),
      city: this.user.city,
      school: this.user.school,
      profession: this.user.profession,
      education: this.user.education
    });
    this.selectedCountry = this.user.country;
    if(this.user.country && countriesObject[this.user.country])
      this.cities = countriesObject[this.user.country];
    this.selectedCity = this.user.city

    this.interests = this.user.interests;
  }

  getUserForm(){
    return {
      firstName: this.firstName.value,
      lastName: this.lastName.value,
      gender: this.gender.value,
      birthDate: this.birthDate.value,
      city: this.city.value,
      country: this.selectedCountry,
      school: this.school.value,
      profession: this.selectedProfession,
      education: this.education.value,
      interests: this.interests
    }
  }

  addInterest(){
    if(!this.interests.includes(this.selectedInterest)){
      console.log('hi wtf');
      this.interests.push(this.selectedInterest);
      if(this.interests) this.sortInterests();
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
        this.toastService.presentStdToastr('your info has been updated successfully')
      }, err => {
        this.pageLoading = false;
        if(err.errors){
          this.validatoErrors = err.errors;
          this.toastService.presentStdToastr('invalid data');
        }else if(typeof err == 'string'){
          this.toastService.presentStdToastr(err);
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
        this.user = new User().initialize(resp.data);
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
    });
    this.submit();
  }

  async presentProfessionsModal(){
    const modal = await this.modalController.create({
      componentProps: {
        data: professions,
        title: 'Professions'
      },
      component: ListSearchComponent
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    this.selectedProfession = data.data;
    this.submit();
  }

  async presentInterestsModal(){
    const modal = await this.modalController.create({
      componentProps: {
        data: interests,
        title: 'Interests'
      },
      component: ListSearchComponent
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    this.selectedInterest = data.data;
    this.addInterest();
    this.submit();
  }

}
