import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { DemoPageComponent } from './demo-page/demo-page.component';
import { TabbedWindowComponent } from './tabbed-window/tabbed-window.component';

@NgModule({
  declarations: [
    AppComponent,
    DemoPageComponent,
    TabbedWindowComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
