import { User } from './User';
export class Comment{

  private _id: string;
  private _text: string;
  private _anonyme: boolean;

  private _post: string;
  private _user: string | User;

  private _createdAt: Date;

  constructor(comment: Comment){
    this.id = comment._id;
    this.text = comment.text;
    this.anonyme = comment.anonyme;

    this.createdAt = new Date(comment.createdAt);

    this.post = comment.post;
    this.user = comment.user;
  }

  get id(): string{ return this._id }
  get text(): string{ return this._text }
  get anonyme(): boolean{ return this._anonyme }

  get post(): string{ return this._post }
  get user(): string | User{ return this._user }

  get createdAt(): Date{ return this._createdAt }

  set id(id: string){ this._id = id }
  set text(text: string){ this._text = text }
  set anonyme(anonyme: boolean){ this._anonyme = anonyme }

  set post(post: string){ this._post = post }
  set user(user: string | User){ this._user = user }

  set createdAt(createdAt: Date){ this._createdAt = createdAt }
}
