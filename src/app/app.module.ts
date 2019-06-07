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

@NgModule({
  declarations: [
    AppComponent,
    GuideComponent,
    NavComponent,
    AboutComponent,
    GuideModalComponent,
    TrackComponent
  ],
  entryComponents:[
    GuideModalComponent,
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
