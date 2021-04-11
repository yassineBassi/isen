import { ToastService } from './../../../services/toast.service';
import { RequestService } from './../../../services/request.service';
import { Request } from './../../../models/Request';
import { Platform, AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss'],
})
export class RequestsComponent implements OnInit {

  pageLoading = false;
  requests: Request[];
  page: number;

  constructor(private requestService: RequestService, private platform: Platform, private toastService: ToastService,
              private alertCtrl: AlertController) { }

  ngOnInit() {}

  ionViewWillEnter(){
    this.platform.ready()
    .then(() => this.getRequests(null))
    this.page = 0;
  }

  getRequests(event, refresh?){
    if(!event) this.pageLoading = true;
    if(refresh) this.page = 0;
    this.requestService.requests(this.page++)
    .then(
      (resp: any) => {
        console.log(resp);
        if(!event || refresh) this.requests = [];

        resp.data.forEach(rqst => {
          this.requests.push(new Request(rqst));
        })
        this.pageLoading = false

        if(event) event.target.complete();
        this.pageLoading = false;
      },
      err => {
        console.log(err);
        this.pageLoading = false
      }
    )
  }

  acceptRequest(request: Request){
    this.requestService.acceptRequest(request.id)
    .then(
      (resp: any) => {
        this.requests.splice(this.requests.indexOf(request), 1)
        console.log(resp);
        this.toastService.presentStdToastr(resp.message)
      },
      err => {
        console.log(err);
        this.toastService.presentStdToastr(err)
      }
    )
  }

  async rejectConfirmation(request: Request){
    const alert = this.alertCtrl.create({
      header: 'Reject request',
      message: 'do you really want to reject this request',
      buttons: [
        {
          text: 'Yes',
          handler: () => this.rejectRequest(request)
        },
        {
          text: 'No',
          role: 'cancel'
        }
      ]
    })
    await (await alert).present()
  }

  rejectRequest(request: Request){
    this.requestService.rejectRequest(request.id)
    .then(
      (resp: any) => {
        this.requests.splice(this.requests.indexOf(request), 1)
        this.toastService.presentStdToastr(resp.message)
        console.log(resp);
      },
      err => {
        console.log(err);
        this.toastService.presentStdToastr(err)
      }
    )
  }
}
