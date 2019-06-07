import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.css']
})
export class TrackComponent implements OnInit {

  private data: any = [];

  constructor(
    private dataService: DataService,
  ) { }

  ngOnInit() {
    this.get();
  }

  get(): void{
    console.log(this.dataService.getByMac("\"f4:f1:5a:bc:8f:fd\"").subscribe((res)=>{
      console.log(res);
      this.data = res;
    }));
  }

}
