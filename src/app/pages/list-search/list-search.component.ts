import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-list-search',
  templateUrl: './list-search.component.html',
  styleUrls: ['./list-search.component.scss'],
})
export class ListSearchComponent implements OnInit {

  @Input("data") data: string[] = [];
  @Input("title") title: string

  filtredData: string[];
  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    this.filtredData = this.data
  }

  ngOnChanges(changes: SimpleChanges) {
      if(changes.data){
        this.filtredData = this.data;
      }
  }

  search(event){
    const val: string = event.target.value;
    console.log(val);

    this.filtredData = this.data.filter(d => d.toUpperCase().startsWith(val.toUpperCase(), 0));
    console.log(this.filtredData);
  }

  selectData(data: string){
    this.modalCtrl.dismiss({
      data
    })
  }
  dismiss(){
    this.modalCtrl.dismiss({data: ''})
  }
}
