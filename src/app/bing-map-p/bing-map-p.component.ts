import { Component, OnInit } from '@angular/core';
import { MapLoaderService } from "../map-loader.service";

@Component({
  selector: 'app-bing-map-p',
  templateUrl: './bing-map-p.component.html',
  styleUrls: ['./bing-map-p.component.css']
})
export class BingMapPComponent implements OnInit {

  mapReady = false;

  constructor() {
    MapLoaderService.load().then( res => {
      console.log('BingmapLoader.load.then ', res);
      this.mapReady = true;
    })
  }

  ngOnInit() {
  }

}
