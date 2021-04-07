export class Post{

  private _id: string;
  private _text: string;
  private _vote: number;
  private _comments: any[];
  private _anonyme: boolean;
  private _channel: string;
  private _user: string;
  private _deletedAt: Date;
  private _createdAt: Date;

  constructor(post: Post){
    this.id = post._id;
    this.text = post.text;
    this.vote = post.vote;
    this.comments = post.comments;
    this.anonyme = post.anonyme;
    this.channel = post.channel;
    this.user = post.user;
    this.deletedAt = new Date(post.deletedAt);
    this.createdAt = new Date(post.createdAt)
  }

  get id(): string{ return this._id }
  get text(): string{ return this._text }
  get vote(): number{ return this._vote }
  get comments(): any[]{ return this._comments }
  get anonyme(): boolean{ return this._anonyme }
  get channel(): string{ return this._channel }
  get user(): string{ return this._user }
  get createdAt(): Date{ return this._createdAt }
  get deletedAt(): Date{ return this._deletedAt }

  set id(id: string){ this._id = id }
  set text(text: string){ this._text = text }
  set vote(vote: number){ this._vote = vote }
  set comments(comments: any[]){ this._comments = comments }
  set anonyme(anonyme: boolean){ this._anonyme = anonyme }
  set channel(channel: string){ this._channel = channel }
  set user(user: string){ this._user = user }
  set createdAt(createdAt: Date){ this._createdAt = createdAt }
  set deletedAt(deletedAt: Date){ this._deletedAt = deletedAt }
}
