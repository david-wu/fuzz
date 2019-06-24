import { BrowserModule } from '@angular/platform-browser';
import { NgModule} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from '@angular/cdk/layout';

import { DemoPageComponent } from './demo-page.component';
import { TabbedWindowComponent } from './tabbed-window/tabbed-window.component';
import { FuzzItemListViewerComponent } from './fuzz-item-list-viewer/fuzz-item-list-viewer.component';
import { FuzzalyticsComponent } from './fuzzalytics/fuzzalytics.component';
import { OptionsAndCodeComponent } from './options-and-code/options-and-code.component';

@NgModule({
  declarations: [
    DemoPageComponent,
    TabbedWindowComponent,
    FuzzItemListViewerComponent,
    FuzzalyticsComponent,
    OptionsAndCodeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutModule,
  ],
  exports: [
    DemoPageComponent,
  ]
})
export class DemoPageModule { }
