import { Component, OnInit } from '@angular/core';
import { MapLoaderService } from "../map-loader.service";

@Component({
  selector: 'app-heat',
  templateUrl: './heat.component.html',
  styleUrls: ['./heat.component.css']
})
export class HeatComponent implements OnInit {

  mapReady = false;

  imgSrc1 = 'assets/img/sote1_rotated_5_rev_blued.jpg';
  imgSrc2 = 'assets/img/sote2_rotated_2_rev_blued.jpg';
  imgSrc3 = 'assets/img/sote3_rotated_4_rev_blued.jpg';

  type:string = "heat";
  isTileLvl: boolean = true;

  title: string = "Located by Meraki";
  subTitle: string  = "HeatMap, Sote Campus";
  description: string  = "Check the most frequently detected area, in the last 5 Minutes";

  constructor(){
    MapLoaderService.load().then( res => {
      console.log('BingmapLoader.load.then ', res);
      this.mapReady = true;
    })
  }

  ngOnInit() {
  }

}
