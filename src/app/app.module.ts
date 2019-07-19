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
import { MapComponent } from './map/map.component';
import { HomeComponent } from './home/home.component';
import { BingMapPComponent } from './bing-map-p/bing-map-p.component';
import { HeatComponent } from './heat/heat.component';
import { NearComponent } from './near/near.component';

@NgModule({
  declarations: [
    AppComponent,
    GuideComponent,
    NavComponent,
    AboutComponent,
    GuideModalComponent,
    TrackComponent,
    MapComponent,
    HomeComponent,
    BingMapPComponent,
    HeatComponent,
    NearComponent,
  ],
  entryComponents:[
    GuideModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
