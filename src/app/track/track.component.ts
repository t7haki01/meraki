import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { TrackMapComponent } from '../track-map/track-map.component';


@Component({
  selector: 'app-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.css']
})
export class TrackComponent implements OnInit {

  private data: any = [];
  private trackClicked: boolean = false;

  constructor(
    private dataService: DataService,
    private trackMapComponent: TrackMapComponent,
  ) {}

  ngOnInit() {
    // this.get();
  }

  get(): void{
    this.dataService.getByMac("\"f4:f1:5a:bc:8f:fd\"").subscribe((res)=>{
      console.log(res);
      this.data = res;
    });
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
    this.trackMapComponent.clientMac = "\"f4:f1:5a:bc:8f:fd\"";
    this.trackClicked = true;
  }

}
