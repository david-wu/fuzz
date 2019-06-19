import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-tabbed-window',
  templateUrl: './tabbed-window.component.html',
  styleUrls: ['./tabbed-window.component.scss']
})
export class TabbedWindowComponent {

  @Input() headerTabs: any[] = [];
  @Input() activeTab: any;

  @Output() activeTabChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  public selectActiveTab (activeTab: any) {
    this.activeTab = activeTab;
    this.activeTabChange.emit(activeTab);
  }
}
