import { User } from './../models/User';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export abstract class DataService<T> {

  constructor() { }

  // get(id: number): T{
  //   return null;
  // }
}
