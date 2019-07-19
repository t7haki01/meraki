import { Injectable } from '@angular/core';

const url = 'http://www.bing.com/api/maps/mapcontrol?callback=__onBingLoaded&branch=release';

@Injectable({
  providedIn: 'root'
})
export class MapLoaderService {
    apiKey = 'Ah8cK-I2nLUz3O5xIzHWrOD4Bte3wJPNy-7LFnBL4ITteGfa9--ms8maBrjzNurk';
    private static promise;

    public static load() {
      if (!MapLoaderService.promise) {

          // Make promise to load
          MapLoaderService.promise = new Promise( resolve => {

              // Set callback for when bing maps is loaded.
              window['__onBingLoaded'] = (ev) => {
                  resolve('Bing Maps API loaded');
              };

              const node = document.createElement('script');
              node.src = url;
              node.type = 'text/javascript';
              node.async = true;
              node.defer = true;
              document.getElementsByTagName('head')[0].appendChild(node);
          });
      }

      // Always return promise. When 'load' is called many times, the promise is already resolved.
        return MapLoaderService.promise;
  }
}
