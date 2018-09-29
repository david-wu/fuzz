# fuzz
  Filters and sorts items based on edit distance

## Usage
`npm install --save fuzz-js`

Javascript:
```
const Fuzz = require('fuzz-js').Fuzz;
const fuzz = new Fuzz();

const fuzzItems = fuzz.filterSort([
  { label: 'app overview' },
  { label: 'view chart' },
  { label: 'mini view' },
  { label: 'random text' },
], ['label'], 'orview')
```

Typescript:
```
import { Fuzz, FuzzItem } from 'fuzz-js';
const fuzz = new Fuzz();

const fuzzItems: FuzzItem[] = fuzz.filterSort([
  { label: 'app overview' },
  { label: 'view chart' },
  { label: 'mini view' },
  { label: 'random text' },
], ['label'], 'orview')

```
