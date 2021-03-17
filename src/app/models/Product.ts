import { File } from './File';
export class Product{
  private _id: number;
  private _label: string;
  private _description: string;
  private _price: string;
  private _state: string;
  private _photo: File;

  public initialize(id: number, label: string, description: string, price: string, state: string,
  photo: File)
  {
    this._id = id;
    this._label = label;
    this._description = description;
    this._price = price;
    this._state = state;
    this._photo = photo;
  }

  get id(): number{ return this._id }
  get label(): string{ return this._label }
  get description(): string{ return this._description }
  get price(): string{ return this._price }
  get state(): string{ return this._state }
  get photo(): File{ return this._photo }

  set id(id: number){ this._id = id }
  set label(label: string){ this._label = label }
  set description(description: string){ this._description = description }
  set price(price: string){ this._price = price }
  set state(state: string){ this._state = state }
  set photo(photo: File){ this._photo = photo }
}
