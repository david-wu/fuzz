// import { Fuzz } from '../fuzz.class';
// import { FuzzDebugger } from './fuzz-debugger.class';
// export function demoFuzz() {
//     const testStrings = [
//         'vrsion',
//         'varsion',
//         'vr3ion',
//         'app version',
//         'version 100',
//         'revision',
//         '  version ',
//         'v e r s i o n',
//     ];
//     const testItems = testStrings.map((testString: string) => {
//         return {
//             randomKey: 'da version cat',
//             label: testString,
//         };
//     });
//     const fuzz = new Fuzz();
//     const fuzzItems = fuzz.filterSort(testItems, ['label', 'randomKey'], 'version');
//     const fuzzDebugger = new FuzzDebugger();
//     fuzzItems.forEach((fuzzItem) => {
//         console.log(fuzzDebugger.debugFuzzItem(fuzzItem));
//     });
// }
// demoFuzz()
"use strict";
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy90ZXN0cy9mdXp6LnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBIiwic291cmNlc0NvbnRlbnQiOlsiXG4vLyBpbXBvcnQgeyBGdXp6IH0gZnJvbSAnLi4vZnV6ei5jbGFzcyc7XG4vLyBpbXBvcnQgeyBGdXp6RGVidWdnZXIgfSBmcm9tICcuL2Z1enotZGVidWdnZXIuY2xhc3MnO1xuXG4vLyBleHBvcnQgZnVuY3Rpb24gZGVtb0Z1enooKSB7XG5cbi8vICAgICBjb25zdCB0ZXN0U3RyaW5ncyA9IFtcbi8vICAgICAgICAgJ3Zyc2lvbicsXG4vLyAgICAgICAgICd2YXJzaW9uJyxcbi8vICAgICAgICAgJ3ZyM2lvbicsXG4vLyAgICAgICAgICdhcHAgdmVyc2lvbicsXG4vLyAgICAgICAgICd2ZXJzaW9uIDEwMCcsXG4vLyAgICAgICAgICdyZXZpc2lvbicsXG4vLyAgICAgICAgICcgIHZlcnNpb24gJyxcbi8vICAgICAgICAgJ3YgZSByIHMgaSBvIG4nLFxuLy8gICAgIF07XG5cbi8vICAgICBjb25zdCB0ZXN0SXRlbXMgPSB0ZXN0U3RyaW5ncy5tYXAoKHRlc3RTdHJpbmc6IHN0cmluZykgPT4ge1xuLy8gICAgICAgICByZXR1cm4ge1xuLy8gICAgICAgICAgICAgcmFuZG9tS2V5OiAnZGEgdmVyc2lvbiBjYXQnLFxuLy8gICAgICAgICAgICAgbGFiZWw6IHRlc3RTdHJpbmcsXG4vLyAgICAgICAgIH07XG4vLyAgICAgfSk7XG5cbi8vICAgICBjb25zdCBmdXp6ID0gbmV3IEZ1enooKTtcbi8vICAgICBjb25zdCBmdXp6SXRlbXMgPSBmdXp6LmZpbHRlclNvcnQodGVzdEl0ZW1zLCBbJ2xhYmVsJywgJ3JhbmRvbUtleSddLCAndmVyc2lvbicpO1xuXG4vLyAgICAgY29uc3QgZnV6ekRlYnVnZ2VyID0gbmV3IEZ1enpEZWJ1Z2dlcigpO1xuXG4vLyAgICAgZnV6ekl0ZW1zLmZvckVhY2goKGZ1enpJdGVtKSA9PiB7XG4vLyAgICAgICAgIGNvbnNvbGUubG9nKGZ1enpEZWJ1Z2dlci5kZWJ1Z0Z1enpJdGVtKGZ1enpJdGVtKSk7XG4vLyAgICAgfSk7XG4vLyB9XG5cbi8vIGRlbW9GdXp6KCkiXX0=