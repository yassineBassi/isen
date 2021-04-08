import { User } from './../../../../models/User';
import { Comment } from './../../../../models/Commentt';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent implements OnInit {

  @Input() comment: Comment;
  @Input() backgroundColor: string;
  @Input() color: string;

  deleteLoading = false;

  constructor() { }

  ngOnInit() {}

  commentUserName(comment: Comment){
    const user: User = comment.user as User
    return comment.anonyme ? 'Anonyme' : (user.firstName + ' ' + user.lastName);
  }

  deletePostConf(){

  }
}
