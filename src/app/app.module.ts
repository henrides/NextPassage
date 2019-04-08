import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StopPassageListComponent } from './stop-passage-list/stop-passage-list.component';
import { StopPassageComponent } from './stop-passage/stop-passage.component';
import { FromNowPipe } from './from-now.pipe';

@NgModule({
  declarations: [
    AppComponent,
    StopPassageListComponent,
    StopPassageComponent,
    FromNowPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
