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
  {path: setting.nav.route1, component: AboutComponent},
  {path: setting.nav.route3, component: TrackComponent},
  {path: setting.nav.route4, component: HeatComponent},
  {path: setting.nav.route5, component: NearComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
