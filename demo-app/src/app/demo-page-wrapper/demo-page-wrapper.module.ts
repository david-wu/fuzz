import { CommonModule } from '@angular/common';
import { NgModule} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from '@angular/cdk/layout';
import { DemoPageWrapperComponent } from './demo-page-wrapper.component';
import { DemoPageModule } from '../demo-page/demo-page.module';

@NgModule({
  declarations: [
    DemoPageWrapperComponent,
  ],
  imports: [
    DemoPageModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutModule,
  ],
  exports: [
    DemoPageWrapperComponent,
  ]
})
export class DemoPageWrapperModule { }
