
import { Fuzz } from './fuzz.class';

export function demoFuzz() {

    const testStrings = [
        'cat',
        'catatonic',
        'tonic',
        'taton',
        'titon    '
    ];

    const testItems = testStrings.map((testString: string) => {
        return {
            label: testString,
        };
    });

    const fuzz = new Fuzz();
    const fuzzItems = fuzz.filterSort(testItems, ['label'], 'cat');

    fuzzItems.forEach((fuzzItem) => {
        console.log(fuzz.debugFuzzItem(fuzzItem));
    });
}

demoFuzz()