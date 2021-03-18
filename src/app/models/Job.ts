import { File } from './File';
export class Job{

  private _id: string;
  private _title: string;
  private _description: string;
  private _company: string;
  private _email: string;
  private _location: string;
  private _state: string;
  private _photo: File;
  private _createdAt: string;
  private _user: string

  constructor(product: Job){
    this._id = product._id;
    this._title = product.title;
    this._description = product.description;
    this._company = product.company;
    this._email = product.email;
    this._location = product.location;
    this._state = product.state;
    this._photo = product.photo;
    this._user = product.user;
    this._createdAt = new Date(product.createdAt).toString()
  }

  get id(): string{ return this._id }
  get title(): string{ return this._title }
  get description(): string{ return this._description }
  get company(): string{ return this._company }
  get email(): string{ return this._email }
  get location(): string{ return this._location }
  get state(): string{ return this._state }
  get user(): string{ return this._user }
  get photo(): File{ return this._photo }
  get createdAt(): string{ return this._createdAt }

  set id(id: string){ this._id = id }
  set title(title: string){ this._title = title }
  set description(description: string){ this._description = description }
  set company(company: string){ this._company = company }
  set email(email: string){ this._email = email }
  set location(location: string){ this._location = location }
  set state(state: string){ this._state = state }
  set user(user: string){ this._user = user }
  set photo(photo: File){ this._photo = photo }
  set createdAt(createdAt: string){ this._createdAt = createdAt }
}
