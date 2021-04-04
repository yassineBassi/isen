import { Router } from '@angular/router';
import { UploadFileService } from './../../../../services/upload-file.service';
import { ServiceService } from './../../../../services/service.service';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ToastService } from './../../../../services/toast.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-service-form',
  templateUrl: './service-form.component.html',
  styleUrls: ['./service-form.component.scss'],
})
export class ServiceFormComponent implements OnInit {

  pageLoading = false;
  serviceImage = {
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

  get phone(){
    return this.form.get('phone')
  }

  get description(){
    return this.form.get('description')
  }

  constructor(private camera: Camera, private formBuilder: FormBuilder, private uploadFile: UploadFileService,
              private toastService: ToastService, private webView: WebView, private serviceService: ServiceService,
              private router: Router) { }

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm(){
    this.form = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.maxLength(255)]],
      company: ['', [Validators.required, Validators.maxLength(50)]],
      location: ['', [Validators.required, Validators.maxLength(50)]],
      phone: ['', [Validators.required, Validators.pattern("^[+]?[(]?[0-9]{3}[)]?[- \.]?[0-9]{3}[- \.]?[0-9]{4,6}$"), Validators.maxLength(20)]]
    });
  }

  pickImage(){
    this.uploadFile.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY)
    .then(
      (resp: any) => {
        this.serviceImage = {
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

  getServiceForm(){
    const form: FormData = new FormData();
    form.append('title', this.title.value);
    form.append('company', this.company.value);
    form.append('location', this.location.value);
    form.append('phone', this.phone.value);
    form.append('description', this.description.value);
    form.append('photo', this.serviceImage.file, this.serviceImage.name);
    return form;
  }

  clearProductForm(){
    this.form.patchValue({
      title: '',
      description: '',
      company: '',
      location: '',
      phone: ''
    })
    this.serviceImage = {
      url: "",
      file: null,
      name: ''
    }
  }

  submit(){
    if(!this.serviceImage.file){
      this.toastService.presentErrorToastr('Please select an image for the service')
      return
    }
    this.validatorErrors = {}
    this.pageLoading = true;
    this.serviceService.store(this.getServiceForm())
    .then(
      resp => {
        this.pageLoading = false;
        console.log(resp);
        this.toastService.presentStdToastr('service created successfully');
        this.router.navigateByUrl('/small-business/services');
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
