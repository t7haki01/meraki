import { Component, OnInit, Input, OnChanges } from '@angular/core';

import { DataService } from '../data.service';

import setting from '../../assets/settings.js';
import BingMap from '../../modules/BingMap.js';

const Microsoft: any = null;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit, OnChanges {

  el1 = false;
  el2 = false;
  el3 = false;

  map1;
  map2;
  map3;

  bingMap1;
  bingMap2;
  bingMap3;

  ready: boolean ;

  @Input() imgSrc1;
  @Input() imgSrc2;
  @Input() imgSrc3;

  @Input() clientMac : string;
  @Input() type : string;

  @Input() isTileLvl: boolean;

  @Input() title: string;
  
  @Input() subTitle: string;
  
  @Input() description: string;

  @Input() info: string;

  @Input() date_from;
  @Input() date_to;

  apiKey = setting.bing.apiKey;
  private data: any = [];

  constructor(
    private dataService: DataService
  ){}

  ngOnInit() {
    console.log("From map component, ngOnInit and typeof Microsoft: ", typeof Microsoft);
    if(typeof Microsoft !== 'undefined'){
      console.log('BingMapComponent.ngOnInit');
      this.getMap();
    }
  }

  ngOnChanges(){
  }

  setData(){

    if(this.clientMac && this.type === "track"){

      this.dataService.getByMac(this.clientMac, this.date_from, this.date_to).subscribe((res)=>{
        this.data = res;
        if(this.data.length>0){
          this.map1.pushPins(this.data, true, this.bingMap1, this.bingMap2, this.bingMap3);
        }
        else{
          window.alert("No any trace found!");
        }
      });

    }
    else if(this.type === "basic"){
      this.dataService.getRecent().subscribe((res)=>{
        this.data = res;
        if(this.data.length>0){
          this.map1.pushPins(this.data, false, this.bingMap1, this.bingMap2, this.bingMap3);
        }
      });
    }

    else if(this.type === "heat"){
      this.dataService.getHeat().subscribe((res)=>{
        this.data = res;
        if(this.data.length>0){
          this.map1.heatMaps(this.data, this.bingMap1, this.bingMap2, this.bingMap3);
        }
      });
    }

    else if(this.clientMac && this.type === "near"){
      this.dataService.getRecent().subscribe((res)=>{
        this.data = res;
        if(this.data.length>0){
          this.dataService.getNear(this.clientMac).subscribe((res)=>{
            var el1 = document.getElementById('myMap1');
            var el2 = document.getElementById('myMap2');
            var el3 = document.getElementById('myMap3');
            var apMap;

            if(res[0].apFloors == "[\"Kontinkangas-Louhi-1krs\"]" || res[0].apFloors == "[\"Kontinkangas-Paasi-1krs\"]"
            || res[0].apFloors == "[\"Kontinkangas-Honka-1krs\"]" || res[0].apFloors == "[]"){
              apMap = this.bingMap1;
            }
            if(res[0].apFloors == "[\"Kontinkangas-Louhi-2krs\"]" || res[0].apFloors == "[\"Kontinkangas-Paasi-2krs\"]"){
              apMap = this.bingMap2;
            }
            if(res[0].apFloors == "[\"Kontinkangas-Louhi-3krs\"]"){
              apMap = this.bingMap3;
            }

            if(apMap){
              this.map1.nearMap(res, this.data, apMap);
            }
            else{
              window.alert("no any map found")
            }
          })
        }
      });
    }


  }

  getMap(){
    /***Init the center point of each maps and overlaying map bound also data */

    // very originally used for it
    // var latOriginal = 65.0086909, lngOriginal = 25.5115079;    
    // var plus = 0.0009500, minus = -0.0009000;
    // var bounds1 = [ latOriginal+plus, lngOriginal+minus*3, latOriginal+minus, lngOriginal+plus ];

    // Here is modified map's properties
    var latMap1 = 65.0086409, lngMap1 = 25.5115079;
    var plusMap1 = 0.0009500, minusMap1 = -0.0009000;
    var boundsMap1 = [ latMap1+plusMap1, lngMap1+minusMap1*3, latMap1+minusMap1, lngMap1+plusMap1 ];
 
    var latMap2 = 65.0086209, lngMap2 = 25.5110600;
    var plusMap2 = 0.001000, minusMap2 = -0.0008000;
    var boundsMap2 = [ latMap2+plusMap2, lngMap2+minusMap2*3, latMap2+minusMap2, lngMap2+plusMap2 ];

    var latMap3 = 65.0083209, lngMap3 = 25.5106409; 
    var plusMap3 = 0.000800, minusMap3 = -0.0006000;
    var boundsMap3 = [ latMap3+plusMap3, lngMap3+minusMap3*3, latMap3+minusMap3, lngMap3+plusMap3 ];
    
        
    /**Modofication values for moving maps bounds with coordinate values */

    var center1 = [65.0086909, 25.5106079];
    var center2 = [65.0086909, 25.5103579];
    var center3 = [65.0084509, 25.5101500];

    var el1 = document.getElementById('myMap1');
    var el2 = document.getElementById('myMap2');
    var el3 = document.getElementById('myMap3');

    this.map1 = new BingMap(boundsMap1, el1, this.imgSrc1, center1);
    this.map2 = new BingMap(boundsMap2, el2, this.imgSrc2, center2);
    this.map3 = new BingMap(boundsMap3, el3, this.imgSrc3, center3);

    if(this.isTileLvl){
      this.bingMap1 = this.map1.getBingMapTileLvl();
      this.bingMap2 = this.map2.getBingMapTileLvl();
      this.bingMap3 = this.map3.getBingMapTileLvl();
    }
    else{
      this.bingMap1 = this.map1.getBingMap();
      this.bingMap2 = this.map2.getBingMap();
      this.bingMap3 = this.map3.getBingMap();
    }

    this.setData();
  }
}



