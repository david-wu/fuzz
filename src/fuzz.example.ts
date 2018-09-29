import {Fuzz} from './fuzz.class';


export function demoFuzz() {

    const testStrings = [
        'cat',
        'catatonic',
        'tonic',
        'taton',
        'titon'
    ];

    const testItems = testStrings.map((testString: string) => {
        return {
            label: testString,
        };
    });


    const fuzz = new Fuzz();

    fuzz.sort(testItems)

    console.log('fuzz', fuzz);
}

demoFuzz()