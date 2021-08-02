import { User } from './../../../models/User';
import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-slides',
  templateUrl: './slides.component.html',
  styleUrls: ['./slides.component.scss'],
})
export class SlidesComponent implements OnInit {

  slideOpts = {
    initialSlide: 1,
    speed: 400
  };

  @Input() users: User[];
  @Input() initialSlide: number;
  @Input() random: boolean;
  @Output() back = new EventEmitter();

  ngOnChanges(changes: SimpleChanges) {
    if(changes.initialSlide){
      this.slideOpts.initialSlide = this.initialSlide
    }
  }

  constructor() { }

  ngOnInit() {}

  goBack(){
    this.back.emit();
  }
}
