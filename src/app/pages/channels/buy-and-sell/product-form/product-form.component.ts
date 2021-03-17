import { UploadFileService } from './../../../../services/upload-file.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent implements OnInit {

  productImage = "./../../../../../assets/default-img.png";

  form: FormGroup;

  constructor(private camera: Camera, private formBuilder: FormBuilder, private uploadFile: UploadFileService) { }

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm(){
    this.form = this.formBuilder.group({
      label: ['', [Validators.required]],
      description: ['', [Validators.required]],
      price: ['', [Validators.required]]
    });
  }

  pickImage(){
    this.uploadFile.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY)
    .then(
      (resp: any) => {
        console.log(resp.imageData);
        this.productImage = resp.imageData;
      },
      err => {
        console.log(err);

      }
    )
  }
}
