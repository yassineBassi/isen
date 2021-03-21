import { User } from './User';
export class Request{

  private _id: string;
  private _createdAt: string;
  private _from: User

  constructor(request: Request){
    this._id = request._id;
    this._from = new User(request.from);
    this._createdAt = new Date(request.createdAt).toString()
  }


  get id(): string{ return this._id }
  get from(): User{ return this._from }
  get createdAt(): string{ return this._createdAt }

  set id(id: string){ this._id = id }
  set from(from: User){ this._from = from }
  set createdAt(createdAt: string){ this._createdAt = createdAt }
}
