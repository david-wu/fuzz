import { Component, EventEmitter, Input, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Fuzz, FuzzItem } from 'fuzz-js';
import { each, isEqual, mapValues } from 'lodash';

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
    '../../styles/pre-code.scss',
    '../../styles/monokai.css',
    './options-and-code.component.scss',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class OptionsAndCodeComponent {

  @Input() options: Partial<Fuzz>;
  @Output() optionsChange: EventEmitter<Partial<FuzzItem>> = new EventEmitter<Partial<FuzzItem>>();

  @ViewChild('codeEl', { static: false }) codeEl;

  public decoratorsByDecoratorPair = {
    [DecoratorPair.BOLD]: {
      startDecorator: '<b>',
      endDecorator: '</b>',
    },
    [DecoratorPair.ITALIC]: {
      startDecorator: '<i>',
      endDecorator: '</i>',
    },
  }

  public optionsFormGroup: FormGroup = this.fb.group({
    caseSensitive: [false],
    skipFilter: [false],
    skipSort: [false],
    filterThreshold: [0.4],
    decoratorPair: [DecoratorPair.BOLD],
  });

  public DecoratorPair = DecoratorPair;

  /**
   * constructor
   * @param {FormBuilder} fb
   * @param {[type]}
   */
  constructor(
    public fb: FormBuilder,
  ) {
    this.optionsFormGroup.valueChanges.subscribe((values: any) => {
      const options = this.formGroupValuesToOptions(values);
      this.optionsChange.emit(options);
    });
  }

  /**
   * ngOnChanges
   * @param {SimpleChanges} changes
   */
  public ngOnChanges(changes: SimpleChanges) {
    if (changes.options) {
      this.optionsFormGroup.patchValue(
        this.optionsToFormGroupValues(this.options),
        { emitEvent: false },
      );
      this.styleCodeEl();
    }
  }

  /**
   * ngAfterViewInit
   */
  public ngAfterViewInit() {
    hljs.registerLanguage('typescript', typescript);
    this.styleCodeEl();
  }

  /**
   * optionsToFormGroupValues
   * @param  {Partial<Fuzz>} options
   * @return {any}
   */
  public optionsToFormGroupValues (options: Partial<Fuzz>): any {
    const optionsDecorators = {
      startDecorator: options.startDecorator,
      endDecorator: options.endDecorator,
    };

    let decoratorPair;
    each(this.decoratorsByDecoratorPair, (decorators, pairKey) => {
      if (isEqual(optionsDecorators, decorators)) {
        decoratorPair = Number(pairKey);
      }
    });

    return mapValues(this.optionsFormGroup.value, (formValue, formKey) => {
      if ((formKey === 'decoratorPair') && (decoratorPair !== undefined)) {
        return decoratorPair;
      }
      return (options[formKey] === undefined)
        ? formValue
        : options[formKey];
    });
  }

  /**
   * formGroupValuesToOptions
   * @param {any} values
   */
  public formGroupValuesToOptions (values: any): any {
    const options = {
      ...values,
      ...this.decoratorsByDecoratorPair[values.decoratorPair],
    };
    delete options.decoratorPair;
    return options;
  }

  /**
   * styleCodeEl
   * @return {string}
   */
  public styleCodeEl(): string {
    if (!this.codeEl) {
      return;
    }
    this.codeEl.nativeElement.textContent = this.getCodeString();
    hljs.highlightBlock(this.codeEl.nativeElement);
  }

  /**
   * getCodeString
   * @return {string}
   */
  public getCodeString(): string {
    const optionValues = this.formGroupValuesToOptions(this.optionsFormGroup.value);
    const optionsString = this.getOptionsString(optionValues);
    if (optionsString) {
      return (
`import { Fuzz } from 'fuzz-js';

const inputData = [
  // ...
];
${optionsString}
const results = Fuzz.search(inputData, 'searchQuery', options);
`);
    } else {
      return (
`import { Fuzz } from 'fuzz-js';

const inputData = [
  // ...
];
const results = Fuzz.search(inputData, 'searchQuery');
`);
    }
  }

  /**
   * getOptionsString
   * @param  {any}    options
   * @return {string}
   */
  public getOptionsString(options: any) : string {
    const baseFuzz = new Fuzz();
    const optionDiffs = [];
    each(options, (value, key) => {
      if (baseFuzz[key] !== value) {
        optionDiffs.push([key, value]);
      }
    });

    if (!optionDiffs.length) {
      return '';
    }

    const optionsBody = optionDiffs
      .map((optionDiff) => {
        return typeof optionDiff[1] === 'string'
          ? `  ${optionDiff[0]}: '${optionDiff[1]}'`
          : `  ${optionDiff[0]}: ${optionDiff[1]}`;
      })
      .join(',\n');

    return (
`const options = {
${optionsBody}
};`);
  }

}
