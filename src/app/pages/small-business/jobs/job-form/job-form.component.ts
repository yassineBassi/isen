import { JobService } from './../../../../services/job.service';
import { Router } from '@angular/router';
import { ToastService } from './../../../../services/toast.service';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { UploadFileService } from './../../../../services/upload-file.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Camera } from '@ionic-native/camera/ngx';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-job-form',
  templateUrl: './job-form.component.html',
  styleUrls: ['./job-form.component.scss'],
})
export class JobFormComponent implements OnInit {

  storePermission = true;
  lastDate: Date;
  restTime = {
    hours: '00',
    minutes: '00',
    seconds: '00'
  }
  pageLoading = false;
  jobImage = {
    url: "",
    file: null,
    name: ''
  };
  validatorErrors = {};
  form: FormGroup;

  get title(){
    return this.form.get('title')
  }

  get company(){
    return this.form.get('company')
  }

  get location(){
    return this.form.get('location')
  }

  get email(){
    return this.form.get('email')
  }

  get description(){
    return this.form.get('description')
  }

  constructor(private camera: Camera, private formBuilder: FormBuilder, private uploadFile: UploadFileService,
              private toastService: ToastService, private webView: WebView, private jobService: JobService,
              private router: Router) { }

  ngOnInit() {
    this.initializeForm();
  }

  ionViewWillEnter(){
    this.getStorePermission();
  }

  getStorePermission(){
    this.pageLoading = true;
    this.jobService.getStorePermession()
    .then(
      (resp: any) => {
        if(resp.data.date){
          this.lastDate = new Date(resp.data.date);
          this.storePermission = false;
          this.startTimer();
        }
        console.log(resp);
        this.pageLoading = false;
      },
      err => {
        console.log(err);
        this.pageLoading = false;
      }
    )
  }

  startTimer(){
    setInterval(() => {
      const currDate = new Date();

      // calcul the difference between the current time and the time when the last product was posted
      let diff = (currDate.getTime() - this.lastDate.getTime());

      // calcul the rest to complete 24h (1 day) // ms to hour
      let rest = ((24 * 60 * 60 * 1000) - diff) / 1000 / 60 / 60;

      // set the number of hours rest
      this.restTime.hours = (Math.floor(rest) < 10 ? '0' : '') + Math.floor(rest);

      // calcul and set the the number of minutes
      rest = (rest - Math.floor(rest)) * 60;
      this.restTime.minutes = (Math.floor(rest) < 10 ? '0' : '') + Math.floor(rest);

      // calcul and set the the number of seconds
      rest = (rest - Math.floor(rest)) * 60;
      this.restTime.seconds = (Math.floor(rest) < 10 ? '0' : '') + Math.floor(rest);
    }, 1000);
  }

  initializeForm(){
    this.form = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.maxLength(255)]],
      company: ['', [Validators.required, Validators.maxLength(50)]],
      location: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]]
    });

    console.log(this.form);
    console.log(this.description);

  }

  pickImage(){
    this.uploadFile.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY)
    .then(
      (resp: any) => {
        this.jobImage = {
          url: this.webView.convertFileSrc(resp.imageData),
          file: resp.file,
          name: resp.name
        }
      },
      err => {
        this.toastService.presentErrorToastr(err);
      }
    )
  }

  getJobForm(){
    const form: FormData = new FormData();
    form.append('title', this.title.value);
    form.append('company', this.company.value);
    form.append('location', this.location.value);
    form.append('email', this.email.value);
    form.append('description', this.description.value);
    form.append('photo', this.jobImage.file, this.jobImage.name);
    return form;
  }

  clearProductForm(){
    this.form.patchValue({
      title: '',
      description: '',
      company: '',
      location: '',
      email: ''
    })
    this.jobImage = {
      url: "",
      file: null,
      name: ''
    }
  }

  submit(){
    if(!this.jobImage.file){
      this.toastService.presentErrorToastr('Please select an image for the job')
      return
    }
    this.validatorErrors = {}
    this.pageLoading = true;
    this.jobService.store(this.getJobForm())
    .then(
      resp => {
        this.pageLoading = false;
        console.log(resp);
        this.toastService.presentStdToastr('job created successfully');
        this.router.navigateByUrl('/small-business/jobs');
        this.clearProductForm();
      },
      err => {
        this.pageLoading = false;
        if(err.errors){
          this.validatorErrors = err.errors;
        }
        if(typeof err == 'string'){
          this.toastService.presentStdToastr(err);
        }
        console.log(err);
      }
    )
  }
}
