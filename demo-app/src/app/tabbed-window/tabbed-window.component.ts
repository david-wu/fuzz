import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tabbed-window',
  templateUrl: './tabbed-window.component.html',
  styleUrls: ['./tabbed-window.component.scss']
})
export class TabbedWindowComponent {

  @Input() headerTabs: any[] = [];
  @Input() activeTab: any;

  constructor() { }

}
