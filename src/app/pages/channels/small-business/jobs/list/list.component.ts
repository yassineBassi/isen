import { ToastService } from './../../../../../services/toast.service';
import { JobService } from './../../../../../services/job.service';
import { Job } from './../../../../../models/Job';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import constants from 'src/app/helpers/constants';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {

  pageLoading = false;
  jobs: Job[];
  domain = constants.DOMAIN_URL;
  page: number;
  searchQuery: string;
  type: string;

  constructor(private jobService: JobService, private toastService: ToastService,
              private route: ActivatedRoute) { }

  ngOnInit() {}

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

  search(){
    this.page = 0;
    this.getJobs(null);
  }

  handleResponse(event, resp: any){
    if(!event) this.jobs = [];

    resp.data.forEach(prd => {
      const job = new Job(prd);
      this.jobs.push(job);
    })
    if(event) event.target.complete();
    this.pageLoading = false;
    console.log(this.jobs);
  }

  handleError(err){
    console.log(err);
    this.pageLoading = false;
    this.toastService.presentErrorToastr(err);
  }

  getJobs(event){
    console.log(event);
    if(this.type == 'posted'){
      this.jobService.posted(this.page++, this.searchQuery)
      .then(
        resp => this.handleResponse(event, resp),
        err => this.handleError(err)
      );
    }else{
      this.jobService.available(this.page++, this.searchQuery)
      .then(
        resp => this.handleResponse(event, resp),
        err => this.handleError(err)
      );
    }
  }
}
