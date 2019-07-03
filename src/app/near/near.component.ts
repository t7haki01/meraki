import { Component, AfterViewInit, Input } from '@angular/core';
import { DataService } from '../data.service';
import { MapLoaderService } from '../map-loader.service';

@Component({
  selector: 'app-near',
  templateUrl: './near.component.html',
  styleUrls: ['./near.component.css']
})
export class NearComponent implements AfterViewInit {

  guideOn: boolean = true;
  data: any = [];
  checkClicked: boolean = false;
  mapReady:boolean;
  clientMac;

  type:string = "near";

  imgSrc1 = 'assets/img/sote1_rotated_5_rev_basic.jpg';
  imgSrc2 = 'assets/img/sote2_rotated_2_rev_basic.jpg';
  imgSrc3 = 'assets/img/sote3_rotated_4_rev_basic.jpg';
  
  isTileLvl: boolean = false;

  title: string = "Located by Meraki";
  
  subTitle: string = "Where? What Devices were around?";
  
  description: string = "Detected devices within 20m, +/- 1 minute, Same Floor";

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
        if(inputValue.length<2){
          return ;
        }
        else if(inputValue.length > 2){
          if(i == 6){
            (<HTMLInputElement>document.getElementById(idTag)).value = inputValue.substr(0,2);
            (<HTMLInputElement>document.getElementById('btn')).focus();
          }
          else{

            while(inputValue.includes(":")){
              inputValue = inputValue.replace(":","");
            }
            for(var j = i; j <7; j++){
              var id = "mac"+j ;
              var curInput = (<HTMLInputElement>document.getElementById(id));
              curInput.value = inputValue.substr(0,2);
              inputValue = inputValue.substr(2,inputValue.length-1);
            }
          }
        }
        else if(inputValue.length == 2){
            if(i == 6){
              (<HTMLInputElement>document.getElementById('btn')).focus();
            }
            else{
                (<HTMLInputElement>document.getElementById(nextId)).focus();
            }
        }
    }
  }

  goCheck(){

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
      this.clientMac = macAddress.toLocaleLowerCase();
      this.checkClicked = true;
      this.guideOn = false;
    }
  }

  goBack(){
    this.guideOn = true;
    this.data = [];
    this.checkClicked = false;
    this.mapReady;
    this.clientMac;
  
    this.type = "near";
  
    this.imgSrc1 = 'assets/img/sote1_rotated_5_rev_basic.jpg';
    this.imgSrc2 = 'assets/img/sote2_rotated_2_rev_basic.jpg';
    this.imgSrc3 = 'assets/img/sote3_rotated_4_rev_basic.jpg';
    this.isTileLvl = true;
  }


}
