import { Camera } from '@ionic-native/camera/ngx';
import { ChannelService } from './../../../services/channel.service';
import { UploadFileService } from './../../../services/upload-file.service';
import { Router } from '@angular/router';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { ToastService } from './../../../services/toast.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-channel-form',
  templateUrl: './channel-form.component.html',
  styleUrls: ['./channel-form.component.scss'],
})
export class ChannelFormComponent implements OnInit {

  pageLoading = false;
  channelImage = {
    url: "",
    file: null,
    name: ''
  };
  validatorErrors = {};
  form: FormGroup;

  get name(){
    return this.form.get('name')
  }

  get description(){
    return this.form.get('description')
  }

  constructor(private camera: Camera, private formBuilder: FormBuilder, private uploadFile: UploadFileService,
              private toastService: ToastService, private webView: WebView, private channelService: ChannelService,
              private router: Router) { }

  ngOnInit(){
    this.initializeForm();
  }


  initializeForm(){
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.maxLength(255)]],
    });
  }

  pickImage(){
    this.uploadFile.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY)
    .then(
      (resp: any) => {
        this.channelImage = {
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

  getProductForm(){
    const form: FormData = new FormData();
    form.append('name', this.name.value);
    form.append('description', this.description.value);
    form.append('photo', this.channelImage.file, this.channelImage.name);
    return form;
  }

  clearProductForm(){
    this.form.patchValue({
      name: '',
      description: '',
    })
    this.channelImage = {
      url: "",
      file: null,
      name: ''
    }
  }

  submit(){
    if(!this.channelImage.file){
      this.toastService.presentStdToastr('Please select an image for your product')
      return
    }
    this.validatorErrors = {}
    this.pageLoading = true;
    this.channelService.store(this.getProductForm())
    .then(
      (resp: any) => {
        this.pageLoading = false;
        this.toastService.presentStdToastr('product created successfully');
        this.router.navigateByUrl('/channels');
        console.log(resp);
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
