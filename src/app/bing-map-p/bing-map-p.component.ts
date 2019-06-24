import { Component, OnInit } from '@angular/core';
import { MapLoaderService } from "../map-loader.service";

@Component({
  selector: 'app-bing-map-p',
  templateUrl: './bing-map-p.component.html',
  styleUrls: ['./bing-map-p.component.css']
})
export class BingMapPComponent implements OnInit {

  mapReady:boolean = false;

  type:string = 'basic';

  imgSrc1 = 'assets/img/sote1_51_rotated.jpg';
  imgSrc2 = 'assets/img/sote2_51_rotated.jpg';
  imgSrc3 = 'assets/img/sote3_51_rotated.jpg';
  isTileLvl: boolean = false;

  title: string = "Located by Meraki within a minute in Sote Campus";

  constructor() {
    MapLoaderService.load().then( res => {
      console.log('BingmapLoader.load.then ', res);
      this.mapReady = true;
    })
  }

  ngOnInit() {
  }

}
