import { Component, Input, OnInit } from '@angular/core';
import constants from 'src/app/helpers/constants';

@Component({
  selector: 'app-img-loader',
  templateUrl: './img-loader.component.html',
  styleUrls: ['./img-loader.component.scss'],
})
export class ImgLoaderComponent implements OnInit {

  @Input() src: string;

  hidePlaceholder = false;
  placeholderSrc = "../../../assets/" + constants.imagePlaceholder;

  constructor() { }

  ngOnInit() {}

}
