
import { Fuzz } from '../fuzz.class';
import { FuzzDebugger } from './fuzz-debugger.class';

export function demoFuzz() {

    const testStrings = [
        'cat',
        'catatonic',
        'tonic',
        'taton',
        'jcetf',
        'c a t',
        ' cat ',
    ];

    const testItems = testStrings.map((testString: string) => {
        return {
            label: testString,
        };
    });

    const fuzz = new Fuzz();
    const fuzzItems = fuzz.filterSort(testItems, ['label'], 'cat');

    const fuzzDebugger = new FuzzDebugger();

    fuzzItems.forEach((fuzzItem) => {
        console.log(fuzzDebugger.debugFuzzItem(fuzzItem));
    });
}

demoFuzz()