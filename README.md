# fuzz-js
fuzz-js is a typo tolerant fuzzy search that sorts strings based on their edit distance
Check out a live demo here!
https://david-wu.github.io/assets/fuzz-js

## Setup
 `npm install --save fuzz-js`

## Usage
```
import { Fuzz } from 'fuzz-js';

const users = [
  { name: 'Allen' },
  { name: 'Maggie' },
  { name: 'Margret' },
  ...
];

Fuzz.filter(users, 'mggi');
  // -> [ { name: "Maggie" } ]

```

## Advanced Usage
Fuzz.search allows passing in options that configure the matching behavior
This allows for custom styled strings, match scores, and subject keys
`Fuzz.search(inputData: any[], searchQuery: string, options: SearchOptions);`

Here's the full interface for the SearchOptions.
```
interface SearchOptions {

    // The keys within your objects to fuzzy search against
    // The default behavior is to search all keys
    subjectKeys: string[] = [];

    // Case sensitive when trying to match
    isCaseSensitive: boolean = false;

    // The lowest score to filter.
    // The scale scale is 0 to 1 (0 being a complete mismatch)
    filterThreshold: number = 0.4;

    // Returns all results, useful if you're just interested in the score
    // Equivalent to "filterThreshold = 0"
    skipFilter: boolean = false;

    // Returns results without sorting them first
    skipSort: boolean = false;

    // The styled string will look something like this "here is some <b>matched</b> text"
    // These determine the tags that surround the matched text
    startDecorator: string = '<b>';
    endDecorator: string = '</b>';
  }
```

Here's an example that changes the default string decorators to italics.
```
import { Fuzz } from 'fuzz-js';

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
   */
```

