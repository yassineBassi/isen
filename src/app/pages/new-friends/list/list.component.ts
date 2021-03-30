import { User } from './../../../models/User';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {

  @Input() users: User[];
  @Output() loadMore = new EventEmitter();
  @Output() showUser = new EventEmitter();
  @Output() refresh = new EventEmitter();

  constructor() { }

  ngOnInit() {}

}
