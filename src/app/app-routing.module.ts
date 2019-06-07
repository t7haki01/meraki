import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GuideComponent } from './guide/guide.component';
import { AboutComponent } from './about/about.component';
import { TrackComponent } from './track/track.component';
import setting from '../assets/settings.js';

const routes: Routes = [
  // Example of route setting, define the path then set the component imported above
  // {path:'', component: HomeComponent},
  {path: setting.nav.route1, component: AboutComponent},
  //currently not using it 5.6.2019
  {path: setting.nav.route2, component: GuideComponent},
  {path: setting.nav.route3, component: TrackComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
