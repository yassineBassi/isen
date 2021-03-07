import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {

  step = 4;
  steps = [
    {
      text: 'What\'s your email',
      label: 'Email',
      input: 'text',
      value: ''
    },
    {
      text: 'Set Password',
      label: 'Password',
      input: 'password',
      value: ''
    },
    {
      text: 'What\'s your name ?',
      label: 'Name',
      input: 'text',
      value: ''
    },
    {
      text: 'When\'s your birthday ?',
      input: 'date',
      value: new Date().toJSON().slice(0, 10)
    },
    {
      text: 'What\'s your gender ?',
      label: 'gender',
      input: 'select',
      value: ''
    },
  ]

  constructor() { }

  ngOnInit() {}

  continue(){
    this.step++;
  }

  back(){
    this.step--;
  }

}
