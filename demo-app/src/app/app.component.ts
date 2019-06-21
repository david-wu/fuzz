import { AfterViewInit, Component, ElementRef } from '@angular/core';

import hljs from 'highlight.js/lib/highlight';
import typescript from 'highlight.js/lib/languages/typescript';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  public readonly codeBlocks = {
    howToUse:
`import { Fuzz } from 'fuzz-js';

const users = [
  { name: 'Allen' },
  { name: 'Maggie' },
  { name: 'Margret' },
];
const results = Fuzz.filter(users, 'mggi');
  // -> [ { name: "Maggie" } ]`,
    howToUseHard:
`import { Fuzz } from 'fuzz-js';

const users = [
  { name: 'Allen', occupation: 'therapist' },
  { name: 'Maggie', occupation: 'musician' },
  { name: 'Margret', occuation: 'magician' },
];
const options = {
  startDecorator: '<i>',
  endDecorator: '</i>',
};
const results = Fuzz.search(users, 'mggi', options);
  /**
   * [
   *   {
   *     "original": { "name": "Maggie" },
   *     "key": "name",
   *     "subject": "Maggie",
   *     "query": "mggi",
   *     "editDistance": 102,
   *     "score": 0.7487684729064039,
   *     "matchRanges": [[0, 0], [2, 4]],
   *     "styledString": "<i>M</i>a<i>ggi</i>e"
   *   }
   * ]
   */`,
  };

  constructor(
    private hostEl: ElementRef,
  ) {

  }

  public ngAfterViewInit() {
    hljs.registerLanguage('typescript', typescript);
    const allCodeBlocks = this.hostEl.nativeElement.querySelectorAll('pre code')
      .forEach((codeBlock: HTMLElement) => hljs.highlightBlock(codeBlock));
  }
}
