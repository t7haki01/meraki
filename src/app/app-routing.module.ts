import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { TrackComponent } from './track/track.component';
import { HeatComponent } from './heat/heat.component';
import { NearComponent } from './near/near.component';
import setting from '../assets/settings.js';

const routes: Routes = [
  {path:'', component: HomeComponent},
  {path: "about", component: AboutComponent},
  {path: "track-device", component: TrackComponent},
  {path: "heat-map", component: HeatComponent},
  {path: "find-device", component: NearComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
