import { Component, OnInit, Input } from '@angular/core';
import { User } from './../../../models/User';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome-alert',
  templateUrl: './welcome-alert.component.html',
  styleUrls: ['./welcome-alert.component.scss'],
})
export class WelcomeAlertComponent implements OnInit {

  @Input() user: User;

  constructor(private modalCtrl: ModalController, private router: Router) { }

  ngOnInit() {}

  closeModal(){
    this.modalCtrl.dismiss();
  }

  showSubscription(){
    this.closeModal();
    this.router.navigateByUrl('/tabs/subscription')
  }

}
