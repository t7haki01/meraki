
export default class BingMap{
    // bounds;
    // options;
    // element;
    // imgSrc;
  
    constructor(
      bounds,
      options,
      element,
      imgSrc,
    )
    {
      this.bounds = bounds;
      this.options = options;
      this.element = element;
      this.imgSrc = imgSrc;
    }
  
    getBingMap(){
  
      var map = new Microsoft.Maps.Map(this.element, this.options);
      var img;
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
      }
  
      return map;
  
    }
  
  }