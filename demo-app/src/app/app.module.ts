import { BrowserModule } from '@angular/platform-browser';
import { NgModule} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from '@angular/cdk/layout';

import { AppComponent } from './app.component';
import { DemoPageModule } from './demo-page/demo-page.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    DemoPageModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
