import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LayoutModule } from '@angular/cdk/layout';

import { AppComponent } from './app.component';
import { DemoPageComponent } from './demo-page/demo-page.component';
import { TabbedWindowComponent } from './tabbed-window/tabbed-window.component';
import { FuzzItemListViewerComponent } from './fuzz-item-list-viewer/fuzz-item-list-viewer.component';
import { FuzzalyticsComponent } from './fuzzalytics/fuzzalytics.component';

@NgModule({
  declarations: [
    AppComponent,
    DemoPageComponent,
    TabbedWindowComponent,
    FuzzItemListViewerComponent,
    FuzzalyticsComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    LayoutModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
