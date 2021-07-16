import { IonInfiniteScroll, ModalController } from '@ionic/angular';
import { UserService } from './../../../services/user.service';
import { User } from './../../../models/User';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { SearchOptionsComponent } from '../search-options/search-options.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  @ViewChild('infinitScroll') infinitScroll: IonInfiniteScroll;

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

  constructor(private userService: UserService, private modalController: ModalController, private route: ActivatedRoute) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.page = 0;
    this.checkRandom();
  }

  checkRandom(){
    this.route.paramMap.subscribe(
      params => {
        this.random = params.get('random') ? true : false;
        this.getNearUsers();
      }
    )
  }

  getNearUsers(event?, refresh?){
    if(!event) this.pageLoading = true;
    if(refresh) this.page = 0
    this.userService.getUsers(this.page++, {...this.options, type: this.random ? 'random' : 'near'})
    .then(
      (resp: any) => {
        if(!event || refresh) this.users = [];

        if(refresh) this.infinitScroll.disabled = false

        if(event){
          event.target.complete();
          if(!resp.data.more && !refresh) event.target.disabled = true;
        }

        resp.data.users.forEach(user => {
          this.users.push(new User().initialize(user));
        })

        if(this.random){
          this.showSlides = true
          this.initialSlide = 0
        }

        this.setUsers.emit(this.users)
        this.pageLoading = false;
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
    if(data){
      this.options = data
      this.getNearUsers(null, true)
    }
  }

  showUser(ind: number){
    this.initialSlide = ind;
    this.showSlides = true
  }
}
