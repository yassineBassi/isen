import { File } from './File';
export class Product{

  private _id: string;
  private _label: string;
  private _description: string;
  private _price: string;
  private _enabled: boolean;
  private _photo: File;
  private _createdAt: Date;
  private _user: string

  constructor(product: Product){
    this.id = product._id;
    this.label = product.label;
    this.description = product.description;
    this.price = product.price;
    this.enabled = product.enabled;
    this.photo = product.photo;
    this.user = product.user;
    this.createdAt = new Date(product.createdAt)
  }

  get id(): string{ return this._id }
  get label(): string{ return this._label }
  get description(): string{ return this._description }
  get price(): string{ return this._price }
  get enabled(): boolean{ return this._enabled }
  get user(): string{ return this._user }
  get photo(): File{ return this._photo }
  get createdAt(): Date{ return this._createdAt }

  set id(id: string){ this._id = id }
  set label(label: string){ this._label = label }
  set description(description: string){ this._description = description }
  set price(price: string){ this._price = price }
  set enabled(enabled: boolean){ this._enabled = enabled }
  set user(user: string){ this._user = user }
  set photo(photo: File){ this._photo = photo }
  set createdAt(createdAt: Date){ this._createdAt = createdAt }
}
