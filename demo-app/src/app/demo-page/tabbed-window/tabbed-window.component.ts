import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-tabbed-window',
  templateUrl: './tabbed-window.component.html',
  styleUrls: ['./tabbed-window.component.scss']
})
export class TabbedWindowComponent implements OnChanges {

  @Input() headerTabs: any[] = [];
  @Input() footerTabs: any[] = [];
  @Input() activeTab: any;
  @Input() canUnselect: any = false;

  @Output() activeTabChange: EventEmitter<any> = new EventEmitter<any>();

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.activeTab || changes.headerTabs || changes.footerTabs) {
      const allTabs = [...this.headerTabs, ...this.footerTabs];

      this.activeTab = allTabs.includes(this.activeTab)
        ? this.activeTab
        : allTabs[0];
    }
  }

  public selectActiveTab (activeTab: any) {
    this.activeTab = (this.canUnselect && (this.activeTab === activeTab)) ? undefined : activeTab;
    this.activeTabChange.emit(activeTab);
  }
}
