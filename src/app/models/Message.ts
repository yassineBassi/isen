export class Message{
  private _id: number;
  private _text: string;
  private _date: Date;
  private _mine: boolean;
  private _image: string;

  constructor(id: number, text: string, date: Date, mine: boolean, image: string){
    this._id = id;
    this._text = text;
    this._date = date;
    this._mine = mine;
    this._image = image;
  }

  get id(): number {return this._id};
  get text(): string {return this._text};
  get date(): Date {return this._date};
  get mine(): boolean {return this._mine};
  get image(): string {return this._image};


  set id(id: number) {this._id = id};
  set text(text: string) {this._text = text};
  set date(date: Date) {this._date = date};
  set mine(mine: boolean) {this._mine = mine};
  set image(image: string) {this._image = image};

}
