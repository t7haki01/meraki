import { Injectable, Component, OnInit, Input } from '@angular/core';
import { DataService } from '../data.service';
import setting from '../../assets/settings.js';
import BingMap from '../../modules/BingMap.js';

 
@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-track-map',
  templateUrl: './track-map.component.html',
  styleUrls: ['./track-map.component.css']
})

export class TrackMapComponent implements OnInit {

  trackMap1;
  trackMap2;
  trackMap3;

  imageSrc1 = 'assets/img/sote1_51_rotated.jpg';
  imageSrc2 = 'assets/img/sote2_51_rotated.jpg';
  imageSrc3 = 'assets/img/sote3_51_rotated.jpg';

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
    if(this.clientMac){
      this.setData();
    }
  }

  setData(){
    console.log(this.clientMac);
    this.dataService.getByMac(this.clientMac).subscribe((res)=>{
      console.log(res);
      this.data = res;
      if(this.data.length>0){
        this.pushPins();
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

    var bounds1 = [ new Microsoft.Maps.Location(latOriginal+plus, lngOriginal+minus*3), new Microsoft.Maps.Location(latOriginal+minus, lngOriginal+plus) ];
    var bounds2 = [ new Microsoft.Maps.Location(latOriginal+plus2, lngOriginal+minus2*3), new Microsoft.Maps.Location(latOriginal+minus2, lngOriginal+plus2) ];
    var bounds3 = [ new Microsoft.Maps.Location(lat3+plus3, lng3+minus3*3), new Microsoft.Maps.Location(lat3+minus3, lng3+plus3) ];

    var center1 = new Microsoft.Maps.Location(65.0086909, 25.5106079);
    var center2 = new Microsoft.Maps.Location(65.0088109, 25.5105079);
    var center3 = new Microsoft.Maps.Location(65.0086009, 25.5103000);

    const options1: Microsoft.Maps.IMapLoadOptions = {
      center: center1,
      credentials: this.apiKey,
      zoom: 18
    };
    const options2: Microsoft.Maps.IMapLoadOptions = {
      center: center2,
      credentials: this.apiKey,
      zoom: 18
    };
    const options3: Microsoft.Maps.IMapLoadOptions = {
      center: center3,
      credentials: this.apiKey,
      zoom: 18
    };

    var el1 = document.getElementById('trackMap1');
    var el2 = document.getElementById('trackMap2');
    var el3 = document.getElementById('trackMap3');

    this.trackMap1 = new BingMap(bounds1, options1, el1, this.imageSrc1).getBingMap();
    this.trackMap2 = new BingMap(bounds2, options2, el2, this.imageSrc2).getBingMap();
    this.trackMap3 = new BingMap(bounds3, options3, el3, this.imageSrc3).getBingMap();

  }

  pushPins(){
    let data = this.data;
    var polyArray1 = [];
    var polyArray2 = [];
    var polyArray3 = [];

    for(var i = 0; i < data.length; i++){
      if(data[i].lat !== "\"NaN\"" && data[i].lng !== "\"NaN\""){
          var loc = new Microsoft.Maps.Location(
          parseFloat(data[i].lat), parseFloat(data[i].lng));
          var pin = new Microsoft.Maps.Pushpin(loc, {title: data[i].seenTime}); 
          
          if(data[i].apFloors == "[\"Kontinkangas-Louhi-1krs\"]" || data[i].apFloors == "[\"Kontinkangas-Honka-1krs\"]" 
              || data[i].apFloors == "[\"Kontinkangas-Paasi-1krs\"]"){
            polyArray1.push(loc);
            this.trackMap1.entities.push(pin);
          }
          else if(data[i].apFloors == "[\"Kontinkangas-Paasi-2krs\"]" || data[i].apFloors == "[\"Kontinkangas-Louhi-2krs\"]"){
            polyArray2.push(loc);
            this.trackMap2.entities.push(pin);
          }
          else if(data[i].apFloors == "[\"Kontinkangas-Louhi-3krs\"]"){
            polyArray3.push(loc);
            this.trackMap3.entities.push(pin);
          }
          else if (data[i].apFloors == "[]"){
            polyArray1.push(loc);
            this.trackMap1.entities.push(pin);                    
          }
      }
   }
   var polyline1 = new Microsoft.Maps.Polyline(polyArray1, { strokeColor: 'blue', strokeThickness: 5});
   var polyline2 = new Microsoft.Maps.Polyline(polyArray2, { strokeColor: 'blue', strokeThickness: 5});
   var polyline3 = new Microsoft.Maps.Polyline(polyArray3, { strokeColor: 'blue', strokeThickness: 5});

   this.trackMap1.entities.push(polyline1);
   this.trackMap2.entities.push(polyline2);
   this.trackMap3.entities.push(polyline3);
  }

}
