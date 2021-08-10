import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { IonInfiniteScroll, IonSlides, ModalController } from '@ionic/angular';
import { UserService } from './../../../services/user.service';
import { User } from './../../../models/User';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ChangeDetectorRef } from '@angular/core';
import { SearchOptionsComponent } from '../search-options/search-options.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  @ViewChild('slides') slides: IonSlides;

  @Input() users: User[];
  @Output() loadMore = new EventEmitter();
  // @Output() showUser = new EventEmitter();
  @Output() setUsers = new EventEmitter();

  options = {
    gender: 'both',
    profession: '0',
    interests: '0',
    education: '0'
  }
  page = 0;
  pageLoading = false;
  initialSlide = 0;
  showSlides = false;
  random = false;
  authUser: User;
  slideOpts = {
    initialSlide: 0,
    speed: 400
  };


  constructor(private userService: UserService, private modalController: ModalController, private route: ActivatedRoute,
              private changeDetectorRef: ChangeDetectorRef, private nativeStorage: NativeStorage) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.page = 0;
    this.slideOpts = {
      initialSlide: 0,
      speed: 400
    }
    this.getNearUsers(null, true);
    this.getAuthUser();
  }

  getAuthUser(){
    this.nativeStorage.getItem('user').then(
      user => {
        this.authUser = new User().initialize(user);
        console.log(this.authUser)
      }
    )
  }

  getNearUsers(event?, refresh?){
    if(refresh){
      this.page = 0;
    }
    this.userService.getUsers(this.page++, {...this.options, type: this.random ? 'random' : 'near'})
    .then(
      (resp: any) => {
        if(refresh) this.users = [];

        console.log(resp.data);
        resp.data.users.forEach(user => {
          this.users.push(new User().initialize(user));
        })

        if(this.random){
          this.showSlides = true
          this.initialSlide = 0
        }
        if(refresh && this.slides){
          this.slides.slideTo(0, 200)
        }

        this.setUsers.emit(this.users)
        this.pageLoading = false;
        this.changeDetectorRef.detectChanges()
      },
      err => {
        this.pageLoading = false;
        console.log(err);
      }
    )
  }

  async presentSearchByModal(){
    const modal = await this.modalController.create({
      componentProps: {
        checkItems: {
          profession: this.options.profession,
          education: this.options.education,
          interests: this.options.interests,
        },
        gender: this.options.gender
      },
      component: SearchOptionsComponent
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    console.log(data);

    if(Object.keys(data).length){
      this.options = data;
      this.page = 0;
      this.getNearUsers(null, true)
    }
  }

  showUser(ind: number){
    this.initialSlide = ind;
    this.showSlides = true
  }

  loadMoreData(){
    console.log('hi');

  }

}
