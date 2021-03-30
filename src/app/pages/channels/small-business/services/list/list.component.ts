import { Service } from './../../../../../models/Service';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from './../../../../../services/toast.service';
import { ServiceService } from './../../../../../services/service.service';
import { Component, OnInit } from '@angular/core';
import constants from 'src/app/helpers/constants';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {

  pageLoading = false;
  services: Service[];
  page: number;
  searchQuery: string;
  type: string;

  constructor(private serviceService: ServiceService, private toastService: ToastService,
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
        this.getServices(null);
      }
    )
  }

  search(){
    this.page = 0;
    this.getServices(null);
  }

  handleResponse(event, refresh, resp: any){
    if(!event || refresh) this.services = [];

    resp.data.forEach(prd => {
      const service = new Service(prd);
      this.services.push(service);
    })

    if(event) event.target.complete();
    this.pageLoading = false;
    console.log(this.services);
  }

  handleError(err){
    console.log(err);
    this.pageLoading = false;
    this.toastService.presentErrorToastr(err);
  }

  getServices(event, refresh?){
    if(refresh) this.page = 0;
    if(this.type == 'posted'){
      this.serviceService.posted(this.page++, this.searchQuery)
      .then(
        resp => this.handleResponse(event, refresh, resp),
        err => this.handleError(err)
      );
    }else{
      this.serviceService.available(this.page++, this.searchQuery)
      .then(
        resp => this.handleResponse(event, refresh, resp),
        err => this.handleError(err)
      );
    }
  }
}
