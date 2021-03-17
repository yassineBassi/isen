import { File } from './File';
export class Product{

  private _id: string;
  private _label: string;
  private _description: string;
  private _price: string;
  private _state: string;
  private _photo: File;
  private _createdAt: string;


  constructor(product: Product){
    this.initialize(product)
  }

  public initialize(product: Product)
  {
    this._id = product._id;
    this._label = product.label;
    this._description = product.description;
    this._price = product.price;
    this._state = product.state;
    this._photo = product.photo;
    this._createdAt = product.createdAt
  }

  get id(): string{ return this._id }
  get label(): string{ return this._label }
  get description(): string{ return this._description }
  get price(): string{ return this._price }
  get state(): string{ return this._state }
  get photo(): File{ return this._photo }
  get createdAt(): string{ return this._createdAt }

  set id(id: string){ this._id = id }
  set label(label: string){ this._label = label }
  set description(description: string){ this._description = description }
  set price(price: string){ this._price = price }
  set state(state: string){ this._state = state }
  set photo(photo: File){ this._photo = photo }
  set createdAt(createdAt: string){ this._createdAt = createdAt }
}
