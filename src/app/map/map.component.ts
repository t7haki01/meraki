import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import setting from '../../assets/settings.js';
import BingMap from '../../modules/BingMap.js';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit {

  bingMap1;
  bingMap2;
  bingMap3;
 
  imageSrc1 = 'assets/img/sote1_51_rotated.jpg';
  imageSrc2 = 'assets/img/sote2_51_rotated.jpg';
  imageSrc3 = 'assets/img/sote3_51_rotated.jpg';
  apiKey = setting.bing.apiKey;
  private data: any = [];

  constructor(
    private dataService: DataService,
  )
  {}

  setData(){
    this.dataService.getRecent().subscribe((res)=>{
      this.data = res;
      this.pushPins();
    })
  }

  ngOnInit() {
    if(typeof Microsoft !== 'undefined'){
      console.log('BingMapComponent.ngOnInit');
      this.getMap();
    }
    this.setData();
  }

  pushPins(){
    let data = this.data;

    for(var i = 0; i < data.length; i++){
      if(data[i].lat !== "\"NaN\"" && data[i].lng !== "\"NaN\""){
          var loc = new Microsoft.Maps.Location(
          parseFloat(data[i].lat), parseFloat(data[i].lng));
          var pin = new Microsoft.Maps.Pushpin(loc); 
          
          if(data[i].apFloors == "[\"Kontinkangas-Louhi-1krs\"]" || data[i].apFloors == "[\"Kontinkangas-Honka-1krs\"]" 
              || data[i].apFloors == "[\"Kontinkangas-Paasi-1krs\"]"){
              this.bingMap1.entities.push(pin);
          }
          else if(data[i].apFloors == "[\"Kontinkangas-Paasi-2krs\"]" || data[i].apFloors == "[\"Kontinkangas-Louhi-2krs\"]"){
              this.bingMap2.entities.push(pin);
          }
          else if(data[i].apFloors == "[\"Kontinkangas-Louhi-3krs\"]"){
              this.bingMap3.entities.push(pin);
          }
          else if (data[i].apFloors == "[]"){
              this.bingMap1.entities.push(pin);                    
          }
      }
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

    var el1 = document.getElementById('myMap');
    var el2 = document.getElementById('myMap2');
    var el3 = document.getElementById('myMap3');

    this.bingMap1 = new BingMap(bounds1, options1, el1, this.imageSrc1).getBingMap();
    this.bingMap2 = new BingMap(bounds2, options2, el2, this.imageSrc2).getBingMap();
    this.bingMap3 = new BingMap(bounds3, options3, el3, this.imageSrc3).getBingMap();

  }
}



