export class User{

  private _id: number;
  private _firstName: string;
  private _lastName: string;
  private _email: string;
  private _birthDate: string;
  private _gender: string;
  private _address: string;
  private _avatar: string;
  private _education: string;
  private _profession: string;
  private _school: string;
  private _interests: string[];

  constructor(id: number, firstName: string, lastName: string, email: string, birthDate: string,
  gender: string, address: string, avatar: string, education: string, profession: string,
  school: string, interests: string[])
  {
    this._id = id;
    this._firstName = firstName;
    this._lastName = lastName;
    this._email = email;
    this._gender = gender;
    this._birthDate = birthDate;
    this._address = address;
    this._avatar = avatar;
    this._education = education;
    this._profession = profession;
    this._school = school;
    this._interests = interests;
    this.sortInterests();
  }

  get id(): number {return this._id};
  get firstName(): string {return this._firstName};
  get lastName(): string {return this._lastName};
  get fullName(): string {return this._firstName + ' ' + this._lastName};
  get email(): string {return this._email};
  get gender(): string {return this._gender};
  get birthDate(): string {return this._birthDate};
  get age(): string {return this._birthDate};
  get address(): string {return this._address};
  get avatar(): string {return this._avatar};
  get education(): string {return this._education};
  get profession(): string {return this._profession};
  get school(): string {return this._school};
  get interests(): string[] {return this._interests};


  set id(id: number){this._id = id}
  set firstName(firstName: string){this._firstName = firstName}
  set lastName(lastName: string){this._lastName = lastName}
  set email(email: string){this._email = email}
  set birthDate(birthDate: string){this._birthDate = birthDate}
  set gender(gender: string){this._gender = gender}
  set address(address: string){this._address = address}
  set avatar(avatar: string){this._avatar = avatar}
  set education(education: string){this._education = education}
  set profession(profession: string){this._profession = profession}
  set school(school: string){this._school = school}
  set interests(interests: string[]){
    this._interests = interests;
    this.sortInterests();
  }

  public addInterest(interest: string): void{
    if(!this._interests.includes(interest)){
      this.interests.push(interest);
      this.sortInterests();
    }
  }

  public removeInterest(ind: number): void{
    this.interests.splice(ind, 1);
    this.sortInterests();
  }

  private sortInterests(){
    this._interests = this._interests.sort((int1, int2) => {
      return int1.length - int2.length;
    })
  }
}
