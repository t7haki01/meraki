import { Component, OnInit } from '@angular/core';
import { MapLoaderService } from "../map-loader.service";
import { DataService } from '../data.service';


/// <reference path="types/MicrosoftMaps/Microsoft.Maps.All.d.ts" />
/// <reference path="types/MicrosoftMaps/CustomMapStyles.d.ts" />
/// <reference path="types/MicrosoftMaps/Microsoft.Maps.d.ts" />
/// <reference types="@types/bingmaps" />

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit {

  img1 = null;
  img2 = null;
  img3 = null;
  imageSrc1 = 'assets/img/sote1_51_rotated.jpg';
  imageSrc2 = 'assets/img/sote2_51_rotated.jpg';
  imageSrc3 = 'assets/img/sote3_51_rotated.jpg';
  apiKey = 'Ah8cK-I2nLUz3O5xIzHWrOD4Bte3wJPNy-7LFnBL4ITteGfa9--ms8maBrjzNurk';
  private data: any = [];

  constructor(
    loader: MapLoaderService,
    private dataService: DataService,
  )
  {
    loader.load("bingAPIReady").then(() => this.getMap());
  }
  setImg1(src){
    this.img1 = src;
  }
  setImg2(src){
    this.img2 = src;
  }
  setImg3(src){
    this.img3 = src;
  }
  getImageSrc1(){
    return this.imageSrc1;
  }
  getImageSrc2(){
    return this.imageSrc2;
  }
  getImageSrc3(){
    return this.imageSrc3;
  }

  setData(){
    this.dataService.getRecent().subscribe((res)=>{
      this.data = res;
    })
  }

  ngOnInit() {
    this.setData();
  }

  getMap(){
    /***Init the center point of each maps and overlaying map bound also data */
    var latOriginal = 65.0086909, lngOriginal = 25.5115079;
    var lat3 = 65.0083009, lng3 = 25.5108009;

    /**Modofication values for moving maps bounds with coordinate values */
    var plus = 0.0009000, minus = -0.0009000;
    var plus2 = 0.001000, minus2 = -0.0010000;
    var plus3 = 0.000900, minus3 = -0.0006000;

    var bounds1 = Microsoft.Maps.LocationRect.fromCorners(new Microsoft.Maps.Location(latOriginal+plus, lngOriginal+minus*3), new Microsoft.Maps.Location(latOriginal+minus, lngOriginal+plus));
    var bounds2 = Microsoft.Maps.LocationRect.fromCorners(new Microsoft.Maps.Location(latOriginal+plus2, lngOriginal+minus2*3), new Microsoft.Maps.Location(latOriginal+minus2, lngOriginal+plus2));
    var bounds3 = Microsoft.Maps.LocationRect.fromCorners(new Microsoft.Maps.Location(lat3+plus3, lng3+minus3*3), new Microsoft.Maps.Location(lat3+minus3, lng3+plus3));

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


    var map1 = new Microsoft.Maps.Map(document.getElementById('myMap'), options1);
    var map2 = new Microsoft.Maps.Map(document.getElementById('myMap2'), options2);
    var map3 = new Microsoft.Maps.Map(document.getElementById('myMap3'), options3);
    var src1 = this.imageSrc1, src2 = this.imageSrc2, src3 = this.imageSrc3;
    var img1,img2,img3;
      // Define custom constructor for the overlay 
      function TopographicOverlay(bounds, image) {
        this.bounds = bounds;
        this.image = image;
        this.img;
      }
      // set prototype to sub-class CustomOverlay
      TopographicOverlay.prototype = new Microsoft.Maps.CustomOverlay();
      // implement the onAdd method to set up DOM element, and use setHtmlElement bind it with the overlay
      TopographicOverlay.prototype.onAdd = function() {
          this.img = document.createElement('img');
          this.img.src = this.image;
          this.img.id = 'topographicOverlay';
          this.img.style.width = '100%';
          this.img.style.height = '100%';
          this.img.style.position = 'absolute';
          this.setHtmlElement(this.img);

          if(this.image === src1){
            img1 = this.img;
          }
          else if(this.image === src2){
            img2 = this.img;
          }
          else if(this.image === src3){
            img3 = this.img;
          }
      };
      // implement the onLoad method to perform custom operations of rendering the DOM element
      TopographicOverlay.prototype.onLoad = function() {
        repositionOverlay1();
        repositionOverlay2();
        repositionOverlay3();
        Microsoft.Maps.Events.addHandler(map1, 'viewchange', function () {
              repositionOverlay1();
        });
        Microsoft.Maps.Events.addHandler(map2, 'viewchange', function () {
              repositionOverlay2();
        });
        Microsoft.Maps.Events.addHandler(map3, 'viewchange', function () {
              repositionOverlay3();
        });
      }
      // create an instance of the defined custom overlay 
      var overlay1 = new TopographicOverlay(bounds1, this.imageSrc1);
      var overlay2 = new TopographicOverlay(bounds2, this.imageSrc2);
      var overlay3 = new TopographicOverlay(bounds3, this.imageSrc3);
      // now we're ready to insert this custom overlay into map layers
      map1.layers.insert(overlay1);
      map2.layers.insert(overlay2);
      map3.layers.insert(overlay3);
      
      function repositionOverlay1() {
        var topLeft = map1.tryLocationToPixel(bounds1.getNorthwest(), Microsoft.Maps.PixelReference.control);
          var bottomRight = map1.tryLocationToPixel(bounds1.getSoutheast(), Microsoft.Maps.PixelReference.control);
          if (topLeft && bottomRight) { 
              img1.style.left = topLeft.x + 'px';
              img1.style.top = topLeft.y + 'px';
              img1.style.width = (bottomRight.x - topLeft.x) + 'px';
              img1.style.width = (bottomRight.x - topLeft.x) + 'px';
              img1.style.height = (bottomRight.y - topLeft.y) + 'px';
          }
      }
      function repositionOverlay2() {
        var topLeft = map2.tryLocationToPixel(bounds2.getNorthwest(), Microsoft.Maps.PixelReference.control);
          var bottomRight = map2.tryLocationToPixel(bounds2.getSoutheast(), Microsoft.Maps.PixelReference.control);
          if (topLeft && bottomRight) { 
              img2.style.left = topLeft.x + 'px';
              img2.style.top = topLeft.y + 'px';
              img2.style.width = (bottomRight.x - topLeft.x) + 'px';
              img2.style.width = (bottomRight.x - topLeft.x) + 'px';
              img2.style.height = (bottomRight.y - topLeft.y) + 'px';
          }
      }
      function repositionOverlay3() {
        var topLeft = map3.tryLocationToPixel(bounds3.getNorthwest(), Microsoft.Maps.PixelReference.control);
          var bottomRight = map3.tryLocationToPixel(bounds3.getSoutheast(), Microsoft.Maps.PixelReference.control);
          if (topLeft && bottomRight) { 
              img3.style.left = topLeft.x + 'px';
              img3.style.top = topLeft.y + 'px';
              img3.style.width = (bottomRight.x - topLeft.x) + 'px';
              img3.style.width = (bottomRight.x - topLeft.x) + 'px';
              img3.style.height = (bottomRight.y - topLeft.y) + 'px';
          }
      }
  }
}
