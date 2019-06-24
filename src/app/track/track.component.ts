import { Component, AfterViewInit } from '@angular/core';
import { DataService } from '../data.service';
import { MapLoaderService } from '../map-loader.service';

@Component({
  selector: 'app-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.css']
})
export class TrackComponent implements AfterViewInit{

  guideOn: boolean = true;
  data: any = [];
  trackClicked: boolean = false;
  mapReady:boolean;
  clientMac;

  type:string = "track";

  imgSrc1 = 'assets/img/sote1_51_rotated.jpg';
  imgSrc2 = 'assets/img/sote2_51_rotated.jpg';
  imgSrc3 = 'assets/img/sote3_51_rotated.jpg';
  isTileLvl: boolean = true;

  title: string = "Located by Meraki, tracked with mac address in Sote Campus"

  constructor(
    private dataService: DataService,
  ) 
  {
    MapLoaderService.load().then( res => {
      console.log('BingmapLoader.load.then ', res);
      this.mapReady = true;
    })
  }

  ngAfterViewInit(){
    (<HTMLInputElement>document.getElementById("mac1")).focus();
  }

  inputControl(){
    for(var i = 1; i<7;i++){
        var idTag = "mac"+i, nextId = "mac"+(i+1);
        let inputValue = (<HTMLInputElement>document.getElementById(idTag)).value;
        if(inputValue.length > 2){
          if(i===6){
            (<HTMLInputElement>document.getElementById('btn')).focus();
          }else{
              (<HTMLInputElement>document.getElementById(idTag)).value = inputValue.substr(0.2);
              (<HTMLInputElement>document.getElementById(nextId)).value = inputValue.substr(2.4);
          }          
        }
        else if(inputValue.length === 2){
            if(i===6){
              (<HTMLInputElement>document.getElementById('btn')).focus();
            }else{
                (<HTMLInputElement>document.getElementById(nextId)).focus();
            }
        }
    }
  }

  goTrack(){
    var macAddress = "\"", lenCheck="";
    for(var i = 1; i<7;i++){
      var idTag = "mac"+i;
      if(i!==6){
        macAddress +=(<HTMLInputElement>document.getElementById(idTag)).value + ":";
      }
      else{
        macAddress += (<HTMLInputElement>document.getElementById(idTag)).value;
      }
      lenCheck += (<HTMLInputElement>document.getElementById(idTag)).value;	
    }
    
    macAddress += "\"";
    
    if(lenCheck.length<12){
        window.alert("Given Mac address length is wrong");                    
    }
    else{
      this.clientMac = macAddress;
      this.trackClicked = true;
      this.guideOn = false;
    }
  }

}
