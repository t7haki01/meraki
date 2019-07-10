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
  date_from;
  date_to;

  type:string = "track";

  imgSrc1 = 'assets/img/sote1_rotated_5_rev_basic.jpg';
  imgSrc2 = 'assets/img/sote2_rotated_2_rev_basic.jpg';
  imgSrc3 = 'assets/img/sote3_rotated_4_rev_basic.jpg';
  isTileLvl: boolean = true;

  title: string = "Located by Meraki";

  subTitle: string ="Tracked with \"Mac Address\" in Sote Campus";

  description: string ="Check how meraki detected your device";

  today = this.getToday();


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

  goTrack(){

    this.date_from = (<HTMLInputElement>document.getElementById("date_from")).value;
    this.date_to = (<HTMLInputElement>document.getElementById("date_to")).value;

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
        console.log(this.date_from);
        console.log(this.date_to);
        window.alert("Given Mac address length is wrong");
    }
    else{
      this.date_from = (<HTMLInputElement>document.getElementById("date_from")).value;
      this.date_to = (<HTMLInputElement>document.getElementById("date_to")).value;

      this.clientMac = macAddress;

      this.trackClicked = true;
      this.guideOn = false;
    }
  }

  getToday(){
    let today: any = new Date();
    let yr = today.getFullYear();
    let mon = today.getMonth() + 1;
    if(mon<10)
      mon = "0" + mon;
    let date = today.getDate();
    if(date<10)
      date = "0" + date;
    today = "" + yr + "-" + mon + "-" + date;
    return today;
  }

  goBack(){
    this.guideOn = true;
    this.data = [];
    this.trackClicked = false;

    this.clientMac;

    this.date_from;
    this.date_to;
  
  }

}
