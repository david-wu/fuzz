
import { DEMO_PAGE_COMPONENTS } from './demo-page/index';
import { DemoPageWrapperComponent } from './demo-page-wrapper/demo-page-wrapper.component';
import { AppComponent } from './app.component';

export const COMPONENTS = [
	...DEMO_PAGE_COMPONENTS,
	DemoPageWrapperComponent,
	AppComponent,
];

export * from './demo-page/index';
export * from './demo-page-wrapper/demo-page-wrapper.component';
export * from './app.component';
