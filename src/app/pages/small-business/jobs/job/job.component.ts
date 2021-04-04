import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { ToastService } from './../../../../services/toast.service';
import { AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { JobService } from './../../../../services/job.service';
import { User } from './../../../../models/User';
import { Job } from './../../../../models/Job';
import { Component, OnInit } from '@angular/core';
import constants from 'src/app/helpers/constants';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.scss'],
})
export class JobComponent implements OnInit {

  pageLoading = false;
  job: Job;
  jobId: string;
  domain = constants.DOMAIN_URL;
  page: number = 1;
  user: User;

  constructor(private jobService: JobService, private route: ActivatedRoute,
              private toastService: ToastService, private alertCtrl: AlertController,
              private router: Router, private nativeStorage: NativeStorage) { }

  ngOnInit() {}

  ionViewWillEnter(){
    this.getJobId();
  }

  getJobId(){
    this.route.paramMap
    .subscribe(
      params => {
        this.jobId = params.get('id');
        this.nativeStorage.getItem('user')
        .then(
          user => {
            this.user = new User(user)
            this.getJob();
          }
        )
      }
    )
  }

  getJob(){
    this.pageLoading = true;
    this.jobService.get(this.jobId)
    .then(
      (resp: any) => {
        this.pageLoading = false;
        this.job = new Job(resp.data);
        this.page++;
        console.log(this.job);
      },
      err => {
        this.pageLoading = false;
        console.log(err);
        this.toastService.presentErrorToastr(err)
      }
    )
  }

  removeJob(){
    this.jobService.remove(this.job.id)
    .then(
      (resp: any) => {
        console.log(resp);
        this.toastService.presentSuccessToastr(resp.message);
        this.router.navigateByUrl('/small-business/jobs/list/posted')
      },
      err => {
        console.log(err);
        this.toastService.presentErrorToastr(err);
      }
    )
  }

  async removeConfirmation(){
    const alert = await this.alertCtrl.create({
      message: 'Do you really want to delete this job ?',
      header: 'Delete Job',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Yes',
          cssClass: 'yes-btn',
          handler: () => {
            this.removeJob();
          }
        }
      ]
    });

    await alert.present();
  }

  openMail(){
    window.open('mailto:' + this.job.email);
  }
}
