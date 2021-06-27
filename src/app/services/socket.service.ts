import { Injectable } from '@angular/core';
import constants from '../helpers/constants';
import { io } from 'socket.io-client/';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  static socket = io(constants.API_V1)

  constructor() {
  }
}