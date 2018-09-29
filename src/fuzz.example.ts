import {Fuzz} from './fuzz.class';


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

    const fuzzItems = fuzz.sort(testItems, ['label'], 'cat');

    const prettyLog = fuzzItems.map((fuzzyItem) => {
        return `${fuzzyItem.subject}, ${fuzzyItem.editDistance}`
    })

    fuzzItems.forEach((fuzzItem) => {
        fuzz.debugFuzzItem(fuzzItem);
    });

}

demoFuzz()