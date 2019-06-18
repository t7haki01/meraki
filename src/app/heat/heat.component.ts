import { Component, OnInit } from '@angular/core';
import { MapLoaderService } from "../map-loader.service";

@Component({
  selector: 'app-heat',
  templateUrl: './heat.component.html',
  styleUrls: ['./heat.component.css']
})
export class HeatComponent implements OnInit {

  mapReady = false;

  imgSrc1 = 'assets/img/sote1_51_rotated_blued.jpg';
  imgSrc2 = 'assets/img/sote2_51_rotated_blued.jpg';
  imgSrc3 = 'assets/img/sote3_51_rotated_blued.jpg';

  type:string = "heat";
  isTileLvl: boolean = true;

  constructor(){
    MapLoaderService.load().then( res => {
      console.log('BingmapLoader.load.then ', res);
      this.mapReady = true;
    })
  }

  ngOnInit() {
  }

}
