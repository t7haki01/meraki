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

  loading: boolean = true;
  status;

  map1;
  map2;
  map3;

  bingMap1;
  bingMap2;
  bingMap3;
 
  // imageSrc1 = 'assets/img/sote1_51_rotated.jpg';
  // imageSrc2 = 'assets/img/sote2_51_rotated.jpg';
  // imageSrc3 = 'assets/img/sote3_51_rotated.jpg';

  @Input() imgSrc1;
  @Input() imgSrc2;
  @Input() imgSrc3;

  @Input() clientMac : string;
  @Input() type : string;

  @Input() isTileLvl: boolean;


  apiKey = setting.bing.apiKey;
  private data: any = [];

  constructor(
    private dataService: DataService,
  ){}

  setData(){
    if(this.clientMac && this.type === "track"){
      this.dataService.getByMac(this.clientMac).subscribe((res)=>{
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
        this.map1.pushPins(this.data, false, this.bingMap1, this.bingMap2, this.bingMap3);
      });
    }

    else if(this.type === "heat"){
      this.dataService.getRecent().subscribe((res)=>{
        this.data = res;
        this.map1.heatMaps(this.data, this.bingMap1, this.bingMap2, this.bingMap3);
      });
    }


  }
 
  ngOnInit() {
    console.log("From map component, ngOnInit and typeof Microsoft: ", typeof Microsoft);
    if(typeof Microsoft !== 'undefined'){
      console.log('BingMapComponent.ngOnInit');
      this.status = 'BingMapComponent.ngOnInit';
      this.getMap();
    }
  }

  getMap(){
    /***Init the center point of each maps and overlaying map bound also data */
    var latOriginal = 65.0086909, lngOriginal = 25.5115079;
    var lat3 = 65.0083009, lng3 = 25.5108009;

    /**Modofication values for moving maps bounds with coordinate values */
    var plus = 0.0009000, minus = -0.0009000;
    var plus2 = 0.001000, minus2 = -0.0010000;
    var plus3 = 0.000900, minus3 = -0.0006000;

    var bounds1 = [ latOriginal+plus, lngOriginal+minus*3, latOriginal+minus, lngOriginal+plus ];
    var bounds2 = [ latOriginal+plus2, lngOriginal+minus2*3, latOriginal+minus2, lngOriginal+plus2 ];
    var bounds3 = [ lat3+plus3, lng3+minus3*3, lat3+minus3, lng3+plus3 ];

    var center1 = [65.0086909, 25.5106079];
    var center2 = [65.0088109, 25.5105079];
    var center3 = [65.0086009, 25.5103000];

    var el1 = document.getElementById('myMap1');
    var el2 = document.getElementById('myMap2');
    var el3 = document.getElementById('myMap3');

    // this.map1 = new BingMap(bounds1, el1, this.imageSrc1, center1);
    // this.map2 = new BingMap(bounds2, el2, this.imageSrc2, center2);
    // this.map3 = new BingMap(bounds3, el3, this.imageSrc3, center3);
    this.map1 = new BingMap(bounds1, el1, this.imgSrc1, center1);
    this.map2 = new BingMap(bounds2, el2, this.imgSrc2, center2);
    this.map3 = new BingMap(bounds3, el3, this.imgSrc3, center3);

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



