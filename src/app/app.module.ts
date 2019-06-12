import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule }    from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GuideComponent } from './guide/guide.component';
import { NavComponent } from './nav/nav.component';
import { AboutComponent } from './about/about.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GuideModalComponent } from './guide-modal/guide-modal.component';
import { TrackComponent } from './track/track.component';
import { TrackMapComponent } from './track-map/track-map.component';
import { MapComponent } from './map/map.component';
import { HomeComponent } from './home/home.component';
import { BingMapPComponent } from './bing-map-p/bing-map-p.component';
import { HeatComponent } from './heat/heat.component';
import { HeatMapComponent } from './heat-map/heat-map.component';

@NgModule({
  declarations: [
    AppComponent,
    GuideComponent,
    NavComponent,
    AboutComponent,
    GuideModalComponent,
    TrackComponent,
    TrackMapComponent,
    MapComponent,
    HomeComponent,
    BingMapPComponent,
    HeatComponent,
    HeatMapComponent,
  ],
  entryComponents:[
    GuideModalComponent,
    TrackMapComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule.forRoot(),
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
