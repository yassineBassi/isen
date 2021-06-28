import { Location } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @Input() back = false;
  @Input() menu = false;
  @Input() title = "";
  @Input() backLink = undefined;
  @Input() search = false;
  @Input() modal = false;
  @Input() backgroundColor: string;
  @Input() textColor: string;
  @Input() avatar = false;
  @Input() avatarSrc: string;

  @Output() searchKeyUp = new EventEmitter();

  showSearch = false;

  constructor(private location: Location, private router: Router, private modalCtrl: ModalController) { }

  ngOnInit() {}

  goBack(){
    if(this.modal) this.modalCtrl.dismiss({});
    else if(this.backLink) this.router.navigateByUrl(this.backLink);
    else this.location.back();
  }

  cancelSearch(){
    this.showSearch = false;
    this.searchKeyUp.emit('');
  }

  doSearch(event){
    const value = event.target.value;
    this.searchKeyUp.emit(value)
  }

}
