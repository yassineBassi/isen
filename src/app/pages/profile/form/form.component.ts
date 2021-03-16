import { UserService } from './../../../services/user.service';
import { User } from './../../../models/User';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {

  user: User
  educationDegrees = [
    'High school',
    'College',
    'Associates degree',
    'Bachlors degree',
    'Graduate degree',
    'PhD'
  ];
  newInterest: string;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.user = null;
  }

  addInterest(){
    this.user.addInterest(this.newInterest);
    this.newInterest = "";
  }

  save(){
    this.router.navigate(['/profile']);
  }

}
