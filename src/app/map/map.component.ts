import { Component, OnInit, Input } from '@angular/core';

import { DataService } from '../data.service';

import setting from '../../assets/settings.js';
import BingMap from '../../modules/BingMap.js';

const Microsoft: any = null;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit {

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
  private dataLast: any = [];

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

  setData(){

    if(this.clientMac && this.type === "track"){

      this.dataService.getByMac(this.clientMac, this.date_from, this.date_to).subscribe((res)=>{
        this.data = res;
        if(this.data.length>0){
          var condition1 = "[\"Kontinkangas-Louhi-1krs\"]" + "[\"Kontinkangas-Honka-1krs\"]" + "[\"Kontinkangas-Paasi-1krs\"]" ;
          var condition2 = "[\"Kontinkangas-Louhi-2krs\"]" + "[\"Kontinkangas-Paasi-2krs\"]";
          var condition3 = "[\"Kontinkangas-Louhi-3krs\"]";
          const condition = condition1 + condition2 + condition3 ;
          if(this.validSoteCampus(this.data, condition)){
            this.map1.pushPins(this.data, true, this.bingMap1, this.bingMap2, this.bingMap3);
          }
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
            this.dataLast = res;
            var apMap;

            if(this.dataLast.length>0){
              if(res[0].apFloors == "[\"Kontinkangas-Louhi-1krs\"]" || res[0].apFloors == "[\"Kontinkangas-Paasi-1krs\"]"
              || res[0].apFloors == "[\"Kontinkangas-Honka-1krs\"]"){
                apMap = this.bingMap1;
              }
              if(res[0].apFloors == "[\"Kontinkangas-Louhi-2krs\"]" || res[0].apFloors == "[\"Kontinkangas-Paasi-2krs\"]"){
                apMap = this.bingMap2;
              }
              if(res[0].apFloors == "[\"Kontinkangas-Louhi-3krs\"]"){
                apMap = this.bingMap3;
              }
            }
            if(apMap){
                this.map1.nearMap(res, this.data, apMap);
            }
            else
            {
              window.alert("no any trace found")
            }
          })
        }
      });
    }

  }

  getMap(){

    var latMap1 = 65.0086409, lngMap1 = 25.5115079;
    var plusMap1 = 0.0009500, minusMap1 = -0.0009000;
    var boundsMap1 = [ latMap1+plusMap1, lngMap1+minusMap1*3, latMap1+minusMap1, lngMap1+plusMap1 ];
 
    var latMap2 = 65.0086209, lngMap2 = 25.5110600;
    var plusMap2 = 0.001000, minusMap2 = -0.0008000;
    var boundsMap2 = [ latMap2+plusMap2, lngMap2+minusMap2*3, latMap2+minusMap2, lngMap2+plusMap2 ];

    var latMap3 = 65.0083209, lngMap3 = 25.5106409; 
    var plusMap3 = 0.000800, minusMap3 = -0.0006000;
    var boundsMap3 = [ latMap3+plusMap3, lngMap3+minusMap3*3, latMap3+minusMap3, lngMap3+plusMap3 ];
    
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

  validSoteCampus(data, cond): boolean{
    var resultArray = [];

    for(var i = 0; i < data.length ; i++){
      if(data[i].lat !== "\"NaN\"" && data[i].lng !== "\"NaN\""){
        if(cond.includes(data[i].apFloors)){
          resultArray.push(data[i]);
        }
      }
    }

    if(resultArray.length > 0){
      return true;
    }
    else{
      window.alert("No any trace found from SOTE campus");
      return false;
    }
  }
}



