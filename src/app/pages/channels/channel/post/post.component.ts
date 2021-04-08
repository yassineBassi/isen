import { Post } from './../../../../models/Post';
import { User } from './../../../../models/User';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {

  @Input() post: Post;

  constructor() { }

  ngOnInit() {}

  postUserName(post: Post){
    const user: User = post.user as User
    return post.anonyme ? 'Anonyme' : (user.firstName + ' ' + user.lastName);
  }
}
