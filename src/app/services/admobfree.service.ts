import { Injectable } from '@angular/core';
import { AdMobFree, AdMobFreeInterstitialConfig } from '@ionic-native/admob-free/ngx';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AdMobFeeService {

  interstitialConfig: AdMobFreeInterstitialConfig = {
    isTesting: true,
    autoShow: true,
    id: 'ca-app-pub-3940256099942544/1033173712'
  };

  constructor(private adMobFree: AdMobFree, public platform: Platform) {
    platform.ready().then(() => {
      this.adMobFree.interstitial.config(this.interstitialConfig);

    });
  }

  showInterstitialAd(){
    this.adMobFree.interstitial.prepare();

    this.adMobFree.on(this.adMobFree.events.INTERSTITIAL_LOAD).subscribe(() => {
      console.log('done')
      this.adMobFree.interstitial.show().then(() => {
        console.log('success');
      }).catch((errorShow) => {
        console.log('err(', errorShow);
      });
    });
    this.adMobFree.on(this.adMobFree.events.INTERSTITIAL_LOAD_FAIL).subscribe((reason) => {
      console.log('fail', reason);
    });
  }
}
