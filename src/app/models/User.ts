import { Avatar } from './avatar';
export class User{

  private _id: number;
  private _firstName: string;
  private _lastName: string;
  private _email: string;
  private _birthDate: Date;
  private _gender: string;
  private _address: string;
  private _avatar: Avatar;
  private _education: string;
  private _profession: string;
  private _school: string;
  private _interests: string[];

  constructor(){
  }

  initialize(user: User)
  {
    this._id = user._id;
    this._firstName = user.firstName;
    this._lastName = user.lastName;
    this._email = user.email;
    this._gender = user.gender;
    this._birthDate = new Date(user.birthDate);
    if(user.address) this._address = user.address;
    this._avatar = user.avatar;
    if(user.education) this._education = user.education;
    if(user.profession) this._profession = user.profession;
    if(user.school) this._school = user.school;
    this._interests = user.interests;
    if(user.interests) this.sortInterests();
  }

  get id(): number {return this._id};
  get firstName(): string {return this._firstName};
  get lastName(): string {return this._lastName};
  get fullName(): string {return this._firstName + ' ' + this._lastName};
  get email(): string {return this._email};
  get gender(): string {return this._gender};
  get birthDate(): Date {return this._birthDate};
  get age(): string {
    if(this.birthDate){
      return Math.round((new Date().getTime() - this.birthDate.getTime()) / 1000 / 60 / 60 / 24 / 365).toString();
    }
    return ''
  };
  get address(): string {return this._address};
  get avatar(): Avatar {return this._avatar};
  get education(): string {return this._education};
  get profession(): string {return this._profession};
  get school(): string {return this._school};
  get interests(): string[] {return this._interests};


  set id(id: number){this._id = id}
  set firstName(firstName: string){this._firstName = firstName}
  set lastName(lastName: string){this._lastName = lastName}
  set email(email: string){this._email = email}
  set birthDate(birthDate: Date){this._birthDate = birthDate}
  set gender(gender: string){this._gender = gender}
  set address(address: string){this._address = address}
  set avatar(avatar: Avatar){this._avatar = avatar}
  set education(education: string){this._education = education}
  set profession(profession: string){this._profession = profession}
  set school(school: string){this._school = school}
  set interests(interests: string[]){
    this._interests = interests;
    if(this.interests) this.sortInterests();
  }

  private sortInterests(){
    this._interests = this._interests.sort((int1, int2) => {
      return int1.length - int2.length;
    })
  }
}
