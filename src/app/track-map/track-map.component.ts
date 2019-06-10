import { Injectable, Component, OnInit, Input } from '@angular/core';
import { DataService } from '../data.service';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-track-map',
  templateUrl: './track-map.component.html',
  styleUrls: ['./track-map.component.css']
})

export class TrackMapComponent implements OnInit {

  private data: any = [];
  clientMac : string ;

  constructor(
    private dataService: DataService,
  ) { }

  ngOnInit() {
    this.setData();
  }

  setData(){
    console.log(this.clientMac);
    this.dataService.getByMac(this.clientMac).subscribe((res)=>{
      console.log(res);
      this.data = res;
    });
  }

}
