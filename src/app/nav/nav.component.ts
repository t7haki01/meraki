import { Component, OnInit } from '@angular/core';
import setting from '../../assets/settings.js';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  appTitle: string = setting.appTitle;
  route1: string = setting.nav.route1;
  route2: string = setting.nav.route2;
  route3: string = setting.nav.route3;
  route4: string = setting.nav.route4;
  
  constructor() { }

  ngOnInit() {
  }

}
