import { BrowserModule } from '@angular/platform-browser';
import { NgModule} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from '@angular/cdk/layout';

import { AppComponent } from './app.component';
import { DemoPageModule } from './demo-page/demo-page.module';
import { DemoPageWrapperComponent } from './demo-page-wrapper/demo-page-wrapper.component';

@NgModule({
  declarations: [
    AppComponent,
    DemoPageWrapperComponent,
  ],
  imports: [
    DemoPageModule,
  ],
  exports: [
    DemoPageWrapperComponent,
    DemoPageModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
