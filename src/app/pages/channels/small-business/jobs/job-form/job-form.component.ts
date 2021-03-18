import { JobService } from './../../../../../services/job.service';
import { Router } from '@angular/router';
import { ToastService } from './../../../../../services/toast.service';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { ProductService } from './../../../../../services/product.service';
import { UploadFileService } from './../../../../../services/upload-file.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-job-form',
  templateUrl: './job-form.component.html',
  styleUrls: ['./job-form.component.scss'],
})
export class JobFormComponent implements OnInit {

  pageLoading = false;
  jobImage = {
    url: "./../../../../../assets/default-img.png",
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

  initializeForm(){
    this.form = this.formBuilder.group({
      title: ['', [Validators.required, Validators.max(50)]],
      description: ['', [Validators.required, Validators.max(255)]],
      company: ['', [Validators.required, Validators.max(50)]],
      location: ['', [Validators.required, Validators.max(50)]],
      email: ['', [Validators.required, Validators.email, Validators.max(50)]]
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
      url: "./../../../../../assets/default-img.png",
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
        this.toastService.presentSuccessToastr('job created successfully');
        this.router.navigateByUrl('/channels/small-business/jobs');
        this.clearProductForm();
      },
      err => {
        this.pageLoading = false;
        if(err.errors){
          this.validatorErrors = err.errors;
        }
        if(typeof err == 'string'){
          this.toastService.presentErrorToastr(err);
        }
        console.log(err);
      }
    )
  }
}
