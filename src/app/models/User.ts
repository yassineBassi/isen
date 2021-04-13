import { Request } from './Request';
import { Message } from './Message';
import { File } from './File';
type RequestEnum = 'requesting' | 'requested';

export class User{

  private _id: string;
  private _firstName: string;
  private _lastName: string;
  private _email: string;
  private _birthDate: Date;
  private _gender: string;
  private _address: string;
  private _avatar: File;
  private _status: string;

  private _education: string;
  private _profession: string;
  private _school: string;
  private _interests: string[];
  private _country: string
  private _city: string

  private _followed: Boolean;
  private _friend: Boolean;
  private _request: RequestEnum;

  private _requests: Request[];

  private _online: boolean;

  private _lastMessage: Message;

  constructor(){
  }

  initialize(user: User)
  {
    this.id = user._id;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.avatar = user.avatar;
    this.email = user.email;
    this.gender = user.gender;
    this.birthDate = new Date(user.birthDate);
    this.status = user.status;
    this.address = user.address;

    this.education = user.education;
    this.profession = user.profession;
    this.school = user.school;
    this.interests = user.interests;
    this.country = user.country;
    this.city = user.city;

    if(user.interests) this.sortInterests();

    this.followed = user.followed;
    this.friend = user.friend;

    this.requests = user.requests;

    if(this.requests && this.requests.length){
      if(this.requests[0].from.id == this.id ){
        this.request = 'requesting'
      }else{
        this.request = 'requested'
      }
    }else this.request = null

    this.online = user.online

    if(user.lastMessage) this.lastMessage = new Message().initialize(user.lastMessage);

    return this;
  }

  get id(): string {return this._id};
  get firstName(): string {return this._firstName};
  get lastName(): string {return this._lastName};
  get fullName(): string {return this._firstName + ' ' + this._lastName};
  get email(): string {return this._email};
  get gender(): string {return this._gender};
  get birthDate(): Date {return this._birthDate};

  get age(): string {
    if(this.birthDate){
      // calc the difference between the birth day and the current day
      let diff = (new Date().getTime() - this.birthDate.getTime());
      //convert ms to years
      diff = diff  / 1000 / 60 / 60 / 24 / 365;
      //get the integer part and turn it to a string
      const age = Math.floor(diff).toString();

      return age;
    }
    return ''
  };

  get address(): string {return this._address};
  get status(): string {return this._status};
  get avatar(): File {return this._avatar};
  get education(): string {return this._education};
  get profession(): string {return this._profession};
  get school(): string {return this._school};
  get interests(): string[] {return this._interests};
  get city(): string {return this._city};
  get country(): string {return this._country};

  get followed(): Boolean {return this._followed};
  get friend(): Boolean {return this._friend};
  get request(): RequestEnum {return this._request};
  get online(): boolean {return this._online};
  get lastMessage(): Message {return this._lastMessage};

  get requests(): Request[] {return this._requests};


  set id(id: string){this._id = id}
  set firstName(firstName: string){this._firstName = firstName}
  set lastName(lastName: string){this._lastName = lastName}
  set email(email: string){this._email = email}
  set birthDate(birthDate: Date){this._birthDate = birthDate}
  set gender(gender: string){this._gender = gender}
  set address(address: string){this._address = address}
  set avatar(avatar: File){this._avatar = avatar}
  set status(status: string){this._status = status}

  set education(education: string){this._education = education}
  set profession(profession: string){this._profession = profession}
  set school(school: string){this._school = school}
  set country(country: string){this._country = country}
  set city(city: string){this._city = city}

  set interests(interests: string[]){
    this._interests = interests;
    if(this.interests) this.sortInterests();
  }

  set followed(followed: Boolean) {this._followed = followed};
  set friend(friend: Boolean) {this._friend = friend};
  set request(request: RequestEnum) {this._request = request};
  set online(online: boolean) {this._online = online};
  set lastMessage(lastMessage: Message) {this._lastMessage = lastMessage};

  set requests(requests: Request[]) {
    this._requests = [];
    if(requests && requests.length)
      requests.map(request => {
        this._requests.push(new Request(request));
      })
  };

  private sortInterests(){
    this._interests = this._interests.sort((int1, int2) => {
      return int1.length - int2.length;
    })
  }
}
