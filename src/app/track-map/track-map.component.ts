import { Injectable, Component, OnInit, Input } from '@angular/core';
import { DataService } from '../data.service';
import setting from '../../assets/settings.js';
import BingMap from '../../modules/BingMap.js';
const Microsoft: any = null;
 
@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-track-map',
  templateUrl: './track-map.component.html',
  styleUrls: ['./track-map.component.css']
})

export class TrackMapComponent implements OnInit {

  map1;
  map2;
  map3;

  trackMap1;
  trackMap2;
  trackMap3;

  @Input() imgSrc1;
  @Input() imgSrc2;
  @Input() imgSrc3;

  // imageSrc1 = 'assets/img/sote1_51_rotated.jpg';
  // imageSrc2 = 'assets/img/sote2_51_rotated.jpg';
  // imageSrc3 = 'assets/img/sote3_51_rotated.jpg';

  apiKey = setting.bing.apiKey;
  
  private data: any = [];

  @Input() clientMac : string ;

  constructor(
    private dataService: DataService,
  ) { }

  ngOnInit() {
    if(typeof Microsoft !== 'undefined'){
      console.log('BingMapComponent.ngOnInit');
      this.getMap();
    }
  }

  setData(){
    this.dataService.getByMac(this.clientMac).subscribe((res)=>{
      this.data = res;
      if(this.data.length>0){
        this.map1.pushPins(this.data, true, this.trackMap1, this.trackMap2, this.trackMap3);
      }
      else{
        window.alert("No any trace found!");
      }
    });
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

    var el1 = document.getElementById('trackMap1');
    var el2 = document.getElementById('trackMap2');
    var el3 = document.getElementById('trackMap3');

    // this.map1 = new BingMap(bounds1, el1, this.imageSrc1, [65.0086909, 25.5106079]);
    // this.map2 = new BingMap(bounds2, el2, this.imageSrc2, [65.0088109, 25.5105079]);
    // this.map3 = new BingMap(bounds3, el3, this.imageSrc3, [65.0086009, 25.5103000]);
    this.map1 = new BingMap(bounds1, el1, this.imgSrc1, [65.0086909, 25.5106079]);
    this.map2 = new BingMap(bounds2, el2, this.imgSrc2, [65.0088109, 25.5105079]);
    this.map3 = new BingMap(bounds3, el3, this.imgSrc3, [65.0086009, 25.5103000]);

    this.trackMap1 = this.map1.getBingMapTileLvl();
    this.trackMap2 = this.map2.getBingMapTileLvl();
    this.trackMap3 = this.map3.getBingMapTileLvl();

    if(this.clientMac){
      this.setData();
    }
  }

}
