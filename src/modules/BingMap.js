import setting from '../assets/settings.js';
import Loader from './Loader.js';


const apiKey = setting.bing.apiKey;


export default class BingMap{
  
    constructor(
      bounds,
      element,
      imgSrc,
      center
    )
    {
      this.bounds = [ new Microsoft.Maps.Location(bounds[0], bounds[1]), new Microsoft.Maps.Location(bounds[2], bounds[3]) ];
      this.element = element;
      this.imgSrc = imgSrc;
      this.center = center;
      this.loader = Loader;
    }
    getBingMap(){
      this.loader.setReady(false);
      var map = new Microsoft.Maps.Map(this.element, {
        center: new Microsoft.Maps.Location(this.center[0], this.center[1]),
        credentials: apiKey,
        zoom: 18,
        // mapTypeId: Microsoft.Maps.MapTypeId.aerial
      });

      var img;
      var loader = this.loader;
      // Define custom constructor for the overlay 
      function TopographicOverlay(bounds, image) {
        this.bounds = bounds;
        this.image = image;
      }
      // set prototype to sub-class CustomOverlay
      TopographicOverlay.prototype = new Microsoft.Maps.CustomOverlay();
      // implement the onAdd method to set up DOM element, and use setHtmlElement bind it with the overlay
      TopographicOverlay.prototype.onAdd = function() {
        img = document.createElement('img');
        img.src = this.image;
        img.id = 'topographicOverlay';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.position = 'absolute';
        this.setHtmlElement(img);
      };
      // implement the onLoad method to perform custom operations of rendering the DOM element
      TopographicOverlay.prototype.onLoad = function() {
        repositionOverlay();
        Microsoft.Maps.Events.addHandler(map, 'viewchange', function () {
            repositionOverlay();
        });
      }
      var bounds = Microsoft.Maps.LocationRect.fromCorners(this.bounds[0], this.bounds[1]);
      var imageSrc = this.imgSrc;
      // create an instance of the defined custom overlay 
      var overlay = new TopographicOverlay(bounds, imageSrc);
      // now we're ready to insert this custom overlay into map layers
      map.layers.insert(overlay);
      
      function repositionOverlay() {
        var topLeft = map.tryLocationToPixel(bounds.getNorthwest(), Microsoft.Maps.PixelReference.control);
        var bottomRight = map.tryLocationToPixel(bounds.getSoutheast(), Microsoft.Maps.PixelReference.control);
        if (topLeft && bottomRight) {
            img.style.left = topLeft.x + 'px';
            img.style.top = topLeft.y + 'px';
            img.style.width = (bottomRight.x - topLeft.x) + 'px';
            img.style.width = (bottomRight.x - topLeft.x) + 'px';
            img.style.height = (bottomRight.y - topLeft.y) + 'px';
        }
        loader.setReady(true);
      }

      return map;
  
    }

    heatMaps(data, map1, map2, map3){
      Microsoft.Maps.loadModule('Microsoft.Maps.HeatMap', function () {
        var locations1 = [];
        var locations2 = [];
        var locations3 = [];
        
        for(var i = 0; i < data.length; i++){
          if(data[i].lat !== "\"NaN\"" && data[i].lng !== "\"NaN\""){
              var loc = new Microsoft.Maps.Location(
              parseFloat(data[i].lat), parseFloat(data[i].lng));
              
              if(data[i].apFloors == "[\"Kontinkangas-Louhi-1krs\"]" || data[i].apFloors == "[\"Kontinkangas-Honka-1krs\"]" 
                  || data[i].apFloors == "[\"Kontinkangas-Paasi-1krs\"]"){
                  if(map1){
                    locations1.push(loc);
                  }
              }
              else if(data[i].apFloors == "[\"Kontinkangas-Paasi-2krs\"]" || data[i].apFloors == "[\"Kontinkangas-Louhi-2krs\"]"){
                if(map2){
                  locations2.push(loc);
                }
              }
              else if(data[i].apFloors == "[\"Kontinkangas-Louhi-3krs\"]"){
                if(map3){
                  locations3.push(loc);
                }
              }
              else if (data[i].apFloors == "[]"){
                if(map1){
                  locations1.push(loc);
                }5
              }
          }
        }

        var heatMapOptions = {
          intensity: 0.65,
          radius: 15,
          /**  Posibble options more to set */
          // drawOrder:-10, /**default: -2 */
          // colorGradient: {
          //   '0': 'Black',
          //   '0.5': 'Aqua',
          //   '1': 'White'
          // },
          // opacity: /** between 0 and 1, default 1,*/
          // unit: "meters" /** or "pixels", default "pixels",*/
          // visible: true/** Boolean, if the heatmap layer is visible or not,*/
        }

        var heatMap1 = new Microsoft.Maps.HeatMapLayer(locations1);
        heatMap1.setOptions(heatMapOptions);
        var heatMap2 = new Microsoft.Maps.HeatMapLayer(locations2);
        heatMap2.setOptions(heatMapOptions);
        var heatMap3 = new Microsoft.Maps.HeatMapLayer(locations3);
        heatMap3.setOptions(heatMapOptions);
        map1.layers.insert(heatMap1);
        map2.layers.insert(heatMap2);
        map3.layers.insert(heatMap3);
      });
    }

    pushPins(data, polyLine, map1, map2, map3){

      var polyArray1 = [];
      var polyArray2 = [];
      var polyArray3 = [];
  
      for(var i = 0; i < data.length; i++){
        if(data[i].lat !== "\"NaN\"" && data[i].lng !== "\"NaN\""){
            var loc = new Microsoft.Maps.Location(
            parseFloat(data[i].lat), parseFloat(data[i].lng));
            var pin = new Microsoft.Maps.Pushpin(loc);
            
            if(data[i].apFloors == "[\"Kontinkangas-Louhi-1krs\"]" || data[i].apFloors == "[\"Kontinkangas-Honka-1krs\"]" 
                || data[i].apFloors == "[\"Kontinkangas-Paasi-1krs\"]"){
                if(map1){
                  map1.entities.push(pin);
                }
                if(polyLine){
                  polyArray1.push(loc);
                }
            }
            else if(data[i].apFloors == "[\"Kontinkangas-Paasi-2krs\"]" || data[i].apFloors == "[\"Kontinkangas-Louhi-2krs\"]"){
              if(map2){
                map2.entities.push(pin);
              }
                if(polyLine){
                  polyArray2.push(loc);
                }
            }
            else if(data[i].apFloors == "[\"Kontinkangas-Louhi-3krs\"]"){
              if(map3){
                map3.entities.push(pin);
              }
                if(polyLine){
                  polyArray3.push(loc);
                }
            }
            else if (data[i].apFloors == "[]"){
              if(map1){
                map1.entities.push(pin);                    
              }
                if(polyLine){
                  polyArray1.push(loc);
                }
            }
        }
      }
      if(polyLine){
        var polyline1 = new Microsoft.Maps.Polyline(polyArray1, null);
        var polyline2 = new Microsoft.Maps.Polyline(polyArray2, null);
        var polyline3 = new Microsoft.Maps.Polyline(polyArray3, null);
        map1.entities.push(polyline1);
        map2.entities.push(polyline2);
        map3.entities.push(polyline3);
      }

  }
  getBingMapTileLvl(){
    return GetMap(this.bounds, this.element, this.center, this.imgSrc);
  }




}//end of Bingmap class


function GetMap(bound, el, center, imgSrc) {
    var bounds = Microsoft.Maps.LocationRect.fromCorners(bound[0], bound[1]);
    var options = {
      center: new Microsoft.Maps.Location(center[0], center[1]),
      credentials: apiKey,
      zoom: 18,
      bounds: bounds
    }
    var map = new Microsoft.Maps.Map(el, options);
    //Load the spatial math module which provides useful tile math calculations.    
    Microsoft.Maps.loadModule('Microsoft.Maps.SpatialMath', function () {
        var layer = new ImageOverlayLayer(map, imgSrc, bounds, options);
    });

    return map;
}
    var ImageOverlayLayer = function (map, imageUrl, bounds, options) {
        var map = map;
        var tileLayer;
        var img;
        function loadLayer() {
            var self = this;
            //Pre-load the image befor ecreating a tile layer.
            img = new Image();
            //Since the image is hosted on a different domain, use CORs. Remove this if the image is locally hosted.
            img.crossOrigin = 'Anonymous';
            //When the image has loaded, create a tile layer and add it to the map.
            img.onload = function () {
                tileLayer = new Microsoft.Maps.TileLayer({
                    mercator: new Microsoft.Maps.TileSource({
                        uriConstructor: getTilePath
                    })
                });
                map.layers.insert(tileLayer);
            };
            img.src = imageUrl;
        }
        function getTilePath(tile) {
            var pix = 256;
            //Create an off screen canvas.
            var canvas = document.createElement('canvas');
            canvas.width = pix;
            canvas.height = pix;
            var context = canvas.getContext('2d');
            
            //Calculate the extents of the image bounds based on the current zoom level of the tile. 
            var topRightImgPixels = Microsoft.Maps.SpatialMath.Tiles.locationToGlobalPixel(bounds.getNorthwest(), tile.zoom);
            var bottomLeftImgPixels = Microsoft.Maps.SpatialMath.Tiles.locationToGlobalPixel(bounds.getSoutheast(), tile.zoom);
            //Calculate the dimensions of the image at the tiles zoom level. 
            var width = bottomLeftImgPixels.x - topRightImgPixels.x;
            var height = bottomLeftImgPixels.y - topRightImgPixels.y;
            //Calculate the offset of the top left corner of the image relative to the top left corner of the tile in pixels at zoom.
            var x = topRightImgPixels.x - tile.x * pix;
            var y = topRightImgPixels.y - tile.y * pix;
            //Draw the image on the off screen canvas.
            context.drawImage(img, x, y, width, height);
            //Generate a data URL for the off screen canvas.
            return canvas.toDataURL();
        }
        this.dispose = function () {
            if (tileLayer) {
                map.layers.remove(tileLayer);
                tileLayer = null;
                img = null;
            }
        };
        this.getBaseTileLayer = function () {
            return tileLayer;
        };
        this.setOptions = function (options) {
            tileLayer.setOptions(options);
        };
        loadLayer();
        map.setView({zoom: options.zoom,});
    };