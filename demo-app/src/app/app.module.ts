import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DemoPageWrapperModule } from './demo-page-wrapper/demo-page-wrapper.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    DemoPageWrapperModule,
  ],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
