import { DataService } from './data.service';
import { Injectable } from '@angular/core';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class UserService extends DataService<User> {

  user = new User(
    1,
    'noone',
    '125',
    'yassinebassii@gmail.com',
    new Date('09/29/1999').toJSON(),
    'male',
    'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis, sed.',
    './../../../assets/man-avatar.png',
    'College',
    'software engineer',
    'NGT School',
    [
      'Nature',
      'Reading books',
      'Drawing',
      'Drawing',
      'Reading books'
    ]
  );

  constructor() {
    super()
  }

  get(id: number){
    return  this.user;
  }
}
