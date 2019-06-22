import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import hljs from 'highlight.js/lib/highlight';
import typescript from 'highlight.js/lib/languages/typescript';

enum DecoratorPair {
  BOLD,
  ITALIC,
}

@Component({
  selector: 'app-options-and-code',
  templateUrl: './options-and-code.component.html',
  styleUrls: [
    '../styles/pre-code.scss',
    './options-and-code.component.scss',
  ]
})
export class OptionsAndCodeComponent implements OnInit {

  @Input() options: Partial<FuzzItem>;
  @Output() optionsChange: EventEmitter<Partial<FuzzItem>> = new EventEmitter<Partial<FuzzItem>>();

  @ViewChild('codeEl', { static: false }) codeEl;

  public optionsFormGroup: FormGroup = this.fb.group({
    caseSensitive: [false],
    skipFilter: [false],
    skipSort: [false],
    filterThreshold: [0.4],
    decorator: [undefined],
    startDecorator: ['<b>'],
    endDecorator: ['</b>'],
  });

  public DecoratorPair = DecoratorPair;

  constructor(
    public fb: FormBuilder,
  ) {

    this.optionsFormGroup.valueChanges
      .subscribe((values: any) => {
        this.optionsChange.emit(values);
      });
  }

  public ngOnChanges(changes: SimpleChanges) {

    if (changes.options) {
      this.optionsFormGroup.patchValue({
        ...this.options,
      }, { emitEvent: false });

      this.styleCodeEl();
    }

  }

  public ngAfterViewInit() {
    this.styleCodeEl();
  }

  public getCodeString() {
    const optionValues = this.optionsFormGroup.value;
    const optionsBody = `
  caseSensitive: ${optionValues.caseSensitive},
  skipFilter: ${optionValues.skipFilter},
  skipSort: ${optionValues.skipSort},
  filterThreshold: ${optionValues.filterThreshold},
  startDecorator: '${optionValues.startDecorator}',
  endDecorator: '${optionValues.endDecorator}',
`;

    const codeString =
`import { Fuzz } from 'fuzz-js';

const inputData = [
  // ...
];
const options = {${optionsBody}};
const results = Fuzz.search(inputData, 'search query', options);
`;
    return codeString;
    return JSON.stringify(this.optionsFormGroup.value);
    return String(Math.random());
  }

  public styleCodeEl() {
    if (!this.codeEl) {
      return;
    }
    this.codeEl.nativeElement.textContent = this.getCodeString();
    console.log('stylingCode', this.codeEl)
    hljs.registerLanguage('typescript', typescript);
    hljs.highlightBlock(this.codeEl.nativeElement);
  }

}
