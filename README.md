# fuzz
  Filters and sorts items based on edit distance

## Installing
`npm install --save fuzz-js`

## Usage:
```
import { Fuzz } from 'fuzz-js';

const users = [
  { name: 'Allen' },
  { name: 'Maggie' },
  { name: 'Margret' },
];
const results = Fuzz.filter(users, 'mggi');
  // -> [ { name: "Maggie" } ]

```

## Advanced Usage
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

## Similar to..
  FuseJs - https://fusejs.io/
