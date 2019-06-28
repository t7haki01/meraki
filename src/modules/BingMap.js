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
      this.maxBounds = [ new Microsoft.Maps.Location(bounds[0]+1, bounds[1]+1), new Microsoft.Maps.Location(bounds[2]+1, bounds[3]+1) ];
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
        showZoomButtons: false,
        showMapTypeSelector: false,
        showLocateMeButton: false,
        minZoom: 18,
        // mapTypeId: Microsoft.Maps.MapTypeId.aerial,
        // maxBounds: this.maxBounds
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
        var condition1 = "[\"Kontinkangas-Louhi-1krs\"]" + "[\"Kontinkangas-Honka-1krs\"]" + "[\"Kontinkangas-Paasi-1krs\"]" + "[]";
        var condition2 = "[\"Kontinkangas-Louhi-2krs\"]" + "[\"Kontinkangas-Paasi-2krs\"]";
        var condition3 = "[\"Kontinkangas-Louhi-3krs\"]";
 
        var locations1 = filterDataBy(data, condition1);
        var locations2 = filterDataBy(data, condition2);
        var locations3 = filterDataBy(data, condition3);

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

      var pushPins1 = [];
      var pushPins2 = [];
      var condition2 = "[\"Kontinkangas-Paasi-2krs\"]"+"[\"Kontinkangas-Louhi-2krs\"]";
      // var pushPins2 = filterDataBy(data, condition2);
      var pushPins3 = [];

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
                  pushPins1.push(pin);
                  var infobox1 = new Microsoft.Maps.Infobox(pin.getLocation(), { visible: false, autoAlignment: true });
                  var pushpin = pin;
                  var maker = data[i].manufacturer!=null?data[i].manufacturer:"unknown";
                  //Store some metadata with the pushpin
                      pushpin.metadata = {
                      title: data[i].clientMac[1] +""+data[i].clientMac[2] + ":XX:XX:XX:XX:" +data[i].clientMac[data[i].clientMac.length-3]+""+data[i].clientMac[data[i].clientMac.length-2],
                      description:"Manufacturer: " + maker + "<br/>" 
                                  + "seenTime: " + data[i].seenTime + "<br/>"
                                  + "Latitude: " + data[i].lat + "<br/>"
                                  + "Longitude: " + data[i].lng + "<br/>"
                                  + "Uncertainty: " + data[i].lat + " m" + "<br/>"
                                  + "Ap Floor: " + data[i].apFloors + "<br/>"
                                  + "RSSI: " + data[i].rssi + "<br/>"
                                  + "seenEpoch: " + data[i].seenEpoch + " s" + "<br/>"
                  };
                  Microsoft.Maps.Events.addHandler(pushpin, 'click', (args) => {
                      infobox1.setOptions({ 
                          location: args.target.getLocation(), 
                          title: args.target.metadata.title, 
                          description: args.target.metadata.description, 
                          visible: true 
                      }); 
                  });
                }
                if(polyLine){
                  polyArray1.push(loc);
                }
            }
            else if(data[i].apFloors == "[\"Kontinkangas-Paasi-2krs\"]" || data[i].apFloors == "[\"Kontinkangas-Louhi-2krs\"]"){
              if(map2){
                pushPins2.push(pin);
                var infobox2 = new Microsoft.Maps.Infobox(pin.getLocation(), { visible: false, autoAlignment: true });
                var pushpin = pin;
                var maker = data[i].manufacturer!=null?data[i].manufacturer:"unknown";
                //Store some metadata with the pushpin
                    pushpin.metadata = {
                    title: data[i].clientMac[1] +""+data[i].clientMac[2] + ":XX:XX:XX:XX:" +data[i].clientMac[data[i].clientMac.length-3]+""+data[i].clientMac[data[i].clientMac.length-2],
                    description:"Manufacturer: " + maker + "<br/>" 
                                + "seenTime: " + data[i].seenTime + "<br/>"
                                + "Latitude: " + data[i].lat + "<br/>"
                                + "Longitude: " + data[i].lng + "<br/>"
                                + "Uncertainty: " + data[i].lat + " m" + "<br/>"
                                + "Ap Floor: " + data[i].apFloors + "<br/>"
                                + "RSSI: " + data[i].rssi + "<br/>"
                                + "seenEpoch: " + data[i].seenEpoch + " s" + "<br/>"
                };
                Microsoft.Maps.Events.addHandler(pushpin, 'click', (args) => {
                    infobox2.setOptions({ 
                        location: args.target.getLocation(), 
                        title: args.target.metadata.title, 
                        description: args.target.metadata.description, 
                        visible: true 
                    }); 
                });

              }
                if(polyLine){
                  polyArray2.push(loc);
                }
            }
            else if(data[i].apFloors == "[\"Kontinkangas-Louhi-3krs\"]"){
              if(map3){
                pushPins3.push(pin);

                var infobox3 = new Microsoft.Maps.Infobox(pin.getLocation(), { visible: false, autoAlignment: true });
                var pushpin = pin;
                var maker = data[i].manufacturer!=null?data[i].manufacturer:"unknown";
                //Store some metadata with the pushpin
                    pushpin.metadata = {
                    title: data[i].clientMac[1] +""+data[i].clientMac[2] + ":XX:XX:XX:XX:" +data[i].clientMac[data[i].clientMac.length-3]+""+data[i].clientMac[data[i].clientMac.length-2],
                    description:"Manufacturer: " + maker + "<br/>" 
                                + "seenTime: " + data[i].seenTime + "<br/>"
                                + "Latitude: " + data[i].lat + "<br/>"
                                + "Longitude: " + data[i].lng + "<br/>"
                                + "Uncertainty: " + data[i].lat + " m" + "<br/>"
                                + "Ap Floor: " + data[i].apFloors + "<br/>"
                                + "RSSI: " + data[i].rssi + "<br/>"
                                + "seenEpoch: " + data[i].seenEpoch + " s" + "<br/>"
                };
                Microsoft.Maps.Events.addHandler(pushpin, 'click', (args) => {
                    infobox3.setOptions({ 
                        location: args.target.getLocation(), 
                        title: args.target.metadata.title, 
                        description: args.target.metadata.description, 
                        visible: true 
                    }); 
                });
              }
                if(polyLine){
                  polyArray3.push(loc);
                }
            }
            else if (data[i].apFloors == "[]"){
              if(map1){
                pushPins1.push(pin);
                var infobox1 = new Microsoft.Maps.Infobox(pin.getLocation(), { visible: false, autoAlignment: true });
                var pushpin = pin;
                var maker = data[i].manufacturer!=null?data[i].manufacturer:"unknown";
                //Store some metadata with the pushpin
                    pushpin.metadata = {
                    title: data[i].clientMac[1] +""+data[i].clientMac[2] + ":XX:XX:XX:XX:" +data[i].clientMac[data[i].clientMac.length-3]+""+data[i].clientMac[data[i].clientMac.length-2],
                    description:"Manufacturer: " + maker + "<br/>" 
                                + "seenTime: " + data[i].seenTime + "<br/>"
                                + "Latitude: " + data[i].lat + "<br/>"
                                + "Longitude: " + data[i].lng + "<br/>"
                                + "Uncertainty: " + data[i].lat + " m" + "<br/>"
                                + "Ap Floor: " + data[i].apFloors + "<br/>"
                                + "RSSI: " + data[i].rssi + "<br/>"
                                + "seenEpoch: " + data[i].seenEpoch + " s" + "<br/>"
                };
                Microsoft.Maps.Events.addHandler(pushpin, 'click', (args) => {
                    infobox1.setOptions({ 
                        location: args.target.getLocation(), 
                        title: args.target.metadata.title, 
                        description: args.target.metadata.description, 
                        visible: true 
                    }); 
                });
              }
                if(polyLine){
                  polyArray1.push(loc);
                }
            }
        }
      }
      var infobox1 = new Microsoft.Maps.Infobox(pushPins1[0].getLocation(), { visible: false, autoAlignment: true });
      infobox1.setMap(map1);
      var infobox2 = new Microsoft.Maps.Infobox(pushPins2[0].getLocation(), { visible: false, autoAlignment: true });
      infobox2.setMap(map2);
      var infobox3 = new Microsoft.Maps.Infobox(pushPins3[0].getLocation(), { visible: false, autoAlignment: true });
      infobox3.setMap(map3);
      
      map1.entities.push(pushPins1);
      map2.entities.push(pushPins2);
      map3.entities.push(pushPins3);

      if(polyLine){
        var polyline1 = new Microsoft.Maps.Polyline(polyArray1, null);
        var polyline2 = new Microsoft.Maps.Polyline(polyArray2, null);
        var polyline3 = new Microsoft.Maps.Polyline(polyArray3, null);
        map1.entities.push(polyline1);
        map2.entities.push(polyline2);
        map3.entities.push(polyline3);
      }

  }

  nearMap(client, data, map){
    let clientLat = client[0].lat, clientLng = client[0].lng;
    let clientTime = client[0].seenTime;
    var pushPins = [];

    var clientLoc = new Microsoft.Maps.Location(
      parseFloat(clientLat), parseFloat(clientLng)
    );

    var clientPin = new Microsoft.Maps.Pushpin(clientLoc,{
      text:"YOU", 
      color: "red",
      // title: client[0].clientMac, 
      // subTitle: client[0].seenTime + "\n"
      // + "("+client[0].lat + "," + client[0].lng + ")", 
    });

    var infobox = new Microsoft.Maps.Infobox(clientLoc,{ 
      title: client[0].clientMac, 
      description: client[0].seenTime + "<br/>"
      + "("+client[0].lat + "," + client[0].lng + ")", 
      visible: false 
    });


    /** */

    // var infobox = new Microsoft.Maps.Infobox(clientPin.getLocation(), { visible: false, autoAlignment: true });
    // infobox.setMap(map);


    /** */

    infobox.setMap(map);
    Microsoft.Maps.Events.addHandler(clientPin, 'click', () => {
      infobox.setOptions({ visible: true });
    });

    map.entities.push(clientPin);

    clientPin.setOptions({ enableHoverStyle: true, enableClickedStyle: true});

    for(var i = 0; i < data.length; i++){
      if(data[i].lat !== "\"NaN\"" && data[i].lng !== "\"NaN\""){
        var loc = new Microsoft.Maps.Location(
        parseFloat(data[i].lat), parseFloat(data[i].lng));
        var pin = new Microsoft.Maps.Pushpin(loc, 
          {
            // text:"Someone"+i, 
            title: data[i].clientMac[1] +""+data[i].clientMac[2] + ":XX:XX:XX:XX:" +data[i].clientMac[data[i].clientMac.length-3]+""+data[i].clientMac[data[i].clientMac.length-2], 
            subTitle: 
            "seenTime: " + data[i].seenTime + "\n"
            + "(" + data[i].lat + "," + data[i].lng + ")"

          });

        if( client[0].apFloors == data[i].apFloors ){

            let timeDif = ( new Date(data[i].seenTime).getTime() - new Date(clientTime).getTime() ) / 1000;

            if(timeDif<0){
              timeDif = timeDif*(-1);
            }

            let distance = distanceInMeter(clientLat, clientLng, data[i].lat, data[i].lng);

            if(timeDif <= 60 && distance <= 20){
              if(map){

                /** */

                

                /** */
                pushPins.push(pin);
              }
            }
        }
      }
    }
    map.entities.push(pushPins);
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


function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

function distanceInMeter(lat1, lon1, lat2, lon2) {
  var p = 0.017453292519943295;    // Math.PI / 180
  var c = Math.cos;
  var a = 0.5 - c((lat2 - lat1) * p)/2 + 
          c(lat1 * p) * c(lat2 * p) * 
          (1 - c((lon2 - lon1) * p))/2;

  return 12742 * Math.asin(Math.sqrt(a)) * 1000; // 2 * R; R = 6371 km
}


function filterDataBy(data, condition){
  var resultArray = [];
  for(var i = 0; i < data.length; i++){
    if(data[i].lat !== "\"NaN\"" && data[i].lng !== "\"NaN\""){
      var loc = new Microsoft.Maps.Location(parseFloat(data[i].lat), parseFloat(data[i].lng));
      var pin = new Microsoft.Maps.Pushpin(loc);
      if(condition.includes(data[i].apFloors)){
        resultArray.push(pin);
      }
    }
  }
  return resultArray;
}

function addInfoBoxHandler(pin, data){
  var infobox2 = new Microsoft.Maps.Infobox(pin.getLocation(), { visible: false, autoAlignment: true });
  var pushpin = pin;
  var maker = data.manufacturer!=null?data.manufacturer:"unknown";
  //Store some metadata with the pushpin
      pushpin.metadata = {
      title: data.clientMac[1] +""+data.clientMac[2] + ":XX:XX:XX:XX:" +data.clientMac[data.clientMac.length-3]+""+data.clientMac[data.clientMac.length-2],
      description:"Manufacturer: " + maker + "<br/>" 
                  + "seenTime: " + data.seenTime + "<br/>"
                  + "Latitude: " + data.lat + "<br/>"
                  + "Longitude: " + data.lng + "<br/>"
                  + "Uncertainty: " + data.lat + " m" + "<br/>"
                  + "Ap Floor: " + data.apFloors + "<br/>"
                  + "RSSI: " + data.rssi + "<br/>"
                  + "seenEpoch: " + data.seenEpoch + " s" + "<br/>"
  };
  Microsoft.Maps.Events.addHandler(pushpin, 'click', (args) => {
      infobox2.setOptions({ 
          location: args.target.getLocation(), 
          title: args.target.metadata.title, 
          description: args.target.metadata.description, 
          visible: true 
      }); 
  });
}