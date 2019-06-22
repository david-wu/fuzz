import { AfterViewInit, Component, ElementRef } from '@angular/core';

import hljs from 'highlight.js/lib/highlight';
import typescript from 'highlight.js/lib/languages/typescript';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [
    './styles/pre-code.scss',
    './app.component.scss',
  ],
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
  { name: 'Margret', occupation: 'magician' },
];
const options = {
  subjectKeys: ['occupation'],
  startDecorator: '<i>',
  endDecorator: '</i>',
};
const results = Fuzz.search(users, 'maggi', options);
  /**
   *
   *  [
   *    {
   *      "original": { "name": "Margret", "occupation": "magician" },
   *      "key": "occupation",
   *      "subject": "magician",
   *      "query": "maggi",
   *      "editDistance": 108,
   *      "score": 0.7874015748031495,
   *      "matchRanges": [[0, 3]],
   *      "styledString": "<i>magi</i>cian"
   *    }
   *  ]
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
