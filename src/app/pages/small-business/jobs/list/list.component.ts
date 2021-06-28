import { IonInfiniteScroll } from '@ionic/angular';
import { ToastService } from './../../../../services/toast.service';
import { JobService } from './../../../../services/job.service';
import { Job } from './../../../../models/Job';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  @ViewChild('infinitScroll') infinitScroll: IonInfiniteScroll;

  pageLoading = false;
  jobs: Job[];
  page: number;
  searchQuery: string;
  type: string;

  constructor(private jobService: JobService, private toastService: ToastService, private nativeStorage: NativeStorage,
              private route: ActivatedRoute) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.pageLoading = true;
    this.searchQuery = "";
    this.page = 0;
    this.getPageType();
  }

  getPageType(){
    this.route.paramMap
    .subscribe(
      param => {
        this.type = param.get('type');
        this.getJobs(null);
      }
    )
  }

  search(val: string){
    this.page = 0;
    this.searchQuery = val;
    this.getJobs(null);
  }

  handleResponse(event, refresh, resp: any){
    if(!event || refresh) this.jobs = [];

    if(refresh) this.infinitScroll.disabled = false

    if(event){
      event.target.complete();
      if(!resp.data.more && !refresh) event.target.disabled = true;
    }

    resp.data.jobs.forEach(prd => {
      const job = new Job(prd);
      this.jobs.push(job);
    })

    this.pageLoading = false;
  }

  handleError(err){
    console.log(err);
    this.pageLoading = false;
    this.toastService.presentErrorToastr(err);
  }

  getJobs(event, refresh?){
    if(refresh) this.page = 0;
    if(this.type == 'posted'){
      this.jobService.posted(this.page++, this.searchQuery)
      .then(
        resp => this.handleResponse(event, refresh, resp),
        err => this.handleError(err)
      );
    }else{
      this.jobService.available(this.page++, this.searchQuery)
      .then(
        resp => this.handleResponse(event, refresh, resp),
        err => this.handleError(err)
      );
    }
  }
}
