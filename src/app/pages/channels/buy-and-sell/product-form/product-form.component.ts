import { ProductService } from './../../../../services/product.service';
import { ToastService } from './../../../../services/toast.service';
import { UploadFileService } from './../../../../services/upload-file.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera } from '@ionic-native/camera/ngx';
import { Component, OnInit } from '@angular/core';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent implements OnInit {

  pageLoading = false;
  productImage = {
    url: "./../../../../../assets/default-img.png",
    file: null,
    name: ''
  };
  validatorErrors = {};
  form: FormGroup;

  get label(){
    return this.form.get('label')
  }

  get price(){
    return this.form.get('price')
  }

  get description(){
    return this.form.get('description')
  }

  constructor(private camera: Camera, private formBuilder: FormBuilder, private uploadFile: UploadFileService,
              private toastService: ToastService, private webView: WebView, private productService: ProductService,
              private router: Router) { }

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm(){
    this.form = this.formBuilder.group({
      label: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.max(255)]],
      price: ['', [Validators.required]]
    });
  }

  pickImage(){
    this.uploadFile.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY)
    .then(
      (resp: any) => {
        this.productImage = {
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
    form.append('label', this.label.value);
    form.append('price', this.price.value);
    form.append('description', this.description.value);
    form.append('photo', this.productImage.file, this.productImage.name);
    return form;
  }

  clearProductForm(){
    this.form.patchValue({
      label: '',
      description: '',
      price: ''
    })
    this.productImage = {
      url: "./../../../../../assets/default-img.png",
      file: null,
      name: ''
    }
  }

  submit(){
    if(!this.productImage.file){
      this.toastService.presentErrorToastr('Please select an image for your product')
      return
    }
    this.validatorErrors = {}
    this.pageLoading = true;
    this.productService.store(this.getProductForm())
    .then(
      resp => {
        this.pageLoading = false;
        console.log(resp);
        this.toastService.presentSuccessToastr('product created successfully');
        this.router.navigateByUrl('/channels/buy-and-sell/sell');
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
