
import { Fuzz } from '../fuzz.class';
import { FuzzDebugger } from './fuzz-debugger.class';

export function demoFuzz() {

    // const testStrings = [
    //     'vrsion',
    //     'varsion',
    //     'vr3ion',
    //     'app version',
    //     'version 100',
    //     'revision',
    //     '  version ',
    //     'v e r s i o n',
    // ];

    // const testItems = testStrings.map((testString: string) => {
    //     return {
    //         randomKey: 'da version cat',
    //         label: testString,
    //     };
    // });

    // const fuzz = new Fuzz();
    // const fuzzItems = fuzz.filterSort(testItems, ['label', 'randomKey'], 'version');

    // const fuzzDebugger = new FuzzDebugger();

    // fuzzItems.forEach((fuzzItem) => {
    //     console.log(fuzzDebugger.debugFuzzItem(fuzzItem));
    // });
}

demoFuzz()