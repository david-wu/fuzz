"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FuzzDebugger = void 0;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var FuzzDebugger =
/*#__PURE__*/
function () {
  function FuzzDebugger() {
    _classCallCheck(this, FuzzDebugger);
  }

  _createClass(FuzzDebugger, [{
    key: "debugFuzzItem",
    value: function debugFuzzItem(fuzzItem) {
      return ['\n=======================================\n', "Query: ".concat(fuzzItem.query, ", subject: ").concat(fuzzItem.subject, ", editDistance: ").concat(fuzzItem.editDistance), '\nEdit Matrix:', this.debugEditMatrix(fuzzItem), '\nOperation Matrix:', this.debugOperationMatrix(fuzzItem), '\nMatch Locations:', fuzzItem.matchLocations.join(', '), '\nMatch String:', fuzzItem.matchLocations.map(function (index) {
        return fuzzItem.subject[index];
      }).join('')].join('\n');
    }
  }, {
    key: "debugEditMatrix",
    value: function debugEditMatrix(fuzzItem) {
      var tableHeader = fuzzItem.subject.split('').map(function (character) {
        return padString(character, 6);
      }).join('');
      var tableRows = fuzzItem.editMatrix.map(function (row, rowIndex) {
        var rowString = row.map(function (cell) {
          return padString(cell, 6);
        }).join('');
        return "".concat(fuzzItem.query[rowIndex - 1] || ' ', " ").concat(rowString);
      });
      return ["        ".concat(tableHeader)].concat(_toConsumableArray(tableRows)).join('\n');
    }
  }, {
    key: "debugOperationMatrix",
    value: function debugOperationMatrix(fuzzItem) {
      var tableHeader = fuzzItem.subject.split('').map(function (character) {
        return padString(character, 6);
      }).join('');
      var tableRows = fuzzItem.operationMatrix.map(function (row, rowIndex) {
        var rowString = row.map(function (cell) {
          return padString(FuzzDebugger.operationStringByOperation[cell], 6);
        }).join('');
        return "".concat(fuzzItem.query[rowIndex - 1] || ' ', " ").concat(rowString);
      });
      return ["        ".concat(tableHeader)].concat(_toConsumableArray(tableRows)).join('\n');
    }
  }]);

  return FuzzDebugger;
}();

exports.FuzzDebugger = FuzzDebugger;

_defineProperty(FuzzDebugger, "operationStringByOperation", {
  0: 'del',
  1: 'ins',
  2: 'sub',
  3: 'nop'
});

function padString(subject, padding) {
  return (' '.repeat(padding) + subject).slice(-padding);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kZW1vL2Z1enotZGVidWdnZXIuY2xhc3MudHMiXSwibmFtZXMiOlsiRnV6ekRlYnVnZ2VyIiwiZnV6ekl0ZW0iLCJxdWVyeSIsInN1YmplY3QiLCJlZGl0RGlzdGFuY2UiLCJkZWJ1Z0VkaXRNYXRyaXgiLCJkZWJ1Z09wZXJhdGlvbk1hdHJpeCIsIm1hdGNoTG9jYXRpb25zIiwiam9pbiIsIm1hcCIsImluZGV4IiwidGFibGVIZWFkZXIiLCJzcGxpdCIsImNoYXJhY3RlciIsInBhZFN0cmluZyIsInRhYmxlUm93cyIsImVkaXRNYXRyaXgiLCJyb3ciLCJyb3dJbmRleCIsInJvd1N0cmluZyIsImNlbGwiLCJvcGVyYXRpb25NYXRyaXgiLCJvcGVyYXRpb25TdHJpbmdCeU9wZXJhdGlvbiIsInBhZGRpbmciLCJyZXBlYXQiLCJzbGljZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFFYUEsWTs7Ozs7Ozs7O2tDQVNTQyxRLEVBQTRCO0FBQ2hELGFBQU8sQ0FDTiw2Q0FETSxtQkFFSUEsUUFBUSxDQUFDQyxLQUZiLHdCQUVnQ0QsUUFBUSxDQUFDRSxPQUZ6Qyw2QkFFbUVGLFFBQVEsQ0FBQ0csWUFGNUUsR0FHTixnQkFITSxFQUlOLEtBQUtDLGVBQUwsQ0FBcUJKLFFBQXJCLENBSk0sRUFLTixxQkFMTSxFQU1OLEtBQUtLLG9CQUFMLENBQTBCTCxRQUExQixDQU5NLEVBT04sb0JBUE0sRUFRTkEsUUFBUSxDQUFDTSxjQUFULENBQXdCQyxJQUF4QixDQUE2QixJQUE3QixDQVJNLEVBU04saUJBVE0sRUFVTlAsUUFBUSxDQUFDTSxjQUFULENBQXdCRSxHQUF4QixDQUE0QixVQUFDQyxLQUFEO0FBQUEsZUFBbUJULFFBQVEsQ0FBQ0UsT0FBVCxDQUFpQk8sS0FBakIsQ0FBbkI7QUFBQSxPQUE1QixFQUF3RUYsSUFBeEUsQ0FBNkUsRUFBN0UsQ0FWTSxFQVdMQSxJQVhLLENBV0EsSUFYQSxDQUFQO0FBWUE7OztvQ0FFc0JQLFEsRUFBNEI7QUFDbEQsVUFBTVUsV0FBbUIsR0FBR1YsUUFBUSxDQUFDRSxPQUFULENBQWlCUyxLQUFqQixDQUF1QixFQUF2QixFQUEyQkgsR0FBM0IsQ0FBK0IsVUFBQ0ksU0FBRDtBQUFBLGVBQXVCQyxTQUFTLENBQUNELFNBQUQsRUFBWSxDQUFaLENBQWhDO0FBQUEsT0FBL0IsRUFBK0VMLElBQS9FLENBQW9GLEVBQXBGLENBQTVCO0FBQ0EsVUFBTU8sU0FBbUIsR0FBR2QsUUFBUSxDQUFDZSxVQUFULENBQW9CUCxHQUFwQixDQUF3QixVQUFDUSxHQUFELEVBQWdCQyxRQUFoQixFQUFxQztBQUN4RixZQUFNQyxTQUFTLEdBQUdGLEdBQUcsQ0FBQ1IsR0FBSixDQUFRLFVBQUNXLElBQUQ7QUFBQSxpQkFBa0JOLFNBQVMsQ0FBQ00sSUFBRCxFQUFPLENBQVAsQ0FBM0I7QUFBQSxTQUFSLEVBQThDWixJQUE5QyxDQUFtRCxFQUFuRCxDQUFsQjtBQUNBLHlCQUFVUCxRQUFRLENBQUNDLEtBQVQsQ0FBZWdCLFFBQVEsR0FBRyxDQUExQixLQUFnQyxHQUExQyxjQUFpREMsU0FBakQ7QUFDQSxPQUgyQixDQUE1QjtBQUlBLGFBQU8sbUJBQ0tSLFdBREwsNkJBRUhJLFNBRkcsR0FHTFAsSUFISyxDQUdBLElBSEEsQ0FBUDtBQUlBOzs7eUNBRTJCUCxRLEVBQTRCO0FBQ3ZELFVBQU1VLFdBQW1CLEdBQUdWLFFBQVEsQ0FBQ0UsT0FBVCxDQUFpQlMsS0FBakIsQ0FBdUIsRUFBdkIsRUFBMkJILEdBQTNCLENBQStCLFVBQUNJLFNBQUQ7QUFBQSxlQUF1QkMsU0FBUyxDQUFDRCxTQUFELEVBQVksQ0FBWixDQUFoQztBQUFBLE9BQS9CLEVBQStFTCxJQUEvRSxDQUFvRixFQUFwRixDQUE1QjtBQUNBLFVBQU1PLFNBQW1CLEdBQUdkLFFBQVEsQ0FBQ29CLGVBQVQsQ0FBeUJaLEdBQXpCLENBQTZCLFVBQUNRLEdBQUQsRUFBZ0JDLFFBQWhCLEVBQXFDO0FBQzdGLFlBQU1DLFNBQVMsR0FBR0YsR0FBRyxDQUFDUixHQUFKLENBQVEsVUFBQ1csSUFBRDtBQUFBLGlCQUFrQk4sU0FBUyxDQUFDZCxZQUFZLENBQUNzQiwwQkFBYixDQUF3Q0YsSUFBeEMsQ0FBRCxFQUFnRCxDQUFoRCxDQUEzQjtBQUFBLFNBQVIsRUFBdUZaLElBQXZGLENBQTRGLEVBQTVGLENBQWxCO0FBQ0EseUJBQVVQLFFBQVEsQ0FBQ0MsS0FBVCxDQUFlZ0IsUUFBUSxHQUFHLENBQTFCLEtBQWdDLEdBQTFDLGNBQWlEQyxTQUFqRDtBQUNBLE9BSDJCLENBQTVCO0FBSUEsYUFBTyxtQkFDS1IsV0FETCw2QkFFSEksU0FGRyxHQUdMUCxJQUhLLENBR0EsSUFIQSxDQUFQO0FBSUE7Ozs7Ozs7O2dCQTlDV1IsWSxnQ0FFdUU7QUFDbEYsS0FBRyxLQUQrRTtBQUVsRixLQUFHLEtBRitFO0FBR2xGLEtBQUcsS0FIK0U7QUFJbEYsS0FBRztBQUorRSxDOztBQWdEcEYsU0FBU2MsU0FBVCxDQUFtQlgsT0FBbkIsRUFBaUNvQixPQUFqQyxFQUEwRDtBQUN6RCxTQUFPLENBQUMsSUFBSUMsTUFBSixDQUFXRCxPQUFYLElBQXNCcEIsT0FBdkIsRUFBZ0NzQixLQUFoQyxDQUFzQyxDQUFDRixPQUF2QyxDQUFQO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFZGl0Q29zdHMsIEZ1enpJdGVtIH0gZnJvbSAnLi4vbW9kZWxzJztcblxuZXhwb3J0IGNsYXNzIEZ1enpEZWJ1Z2dlciB7XG5cblx0cHVibGljIHN0YXRpYyByZWFkb25seSBvcGVyYXRpb25TdHJpbmdCeU9wZXJhdGlvbjoge1tvcGVyYXRpb246IG51bWJlcl06IHN0cmluZ30gPSB7XG5cdFx0MDogJ2RlbCcsXG5cdFx0MTogJ2lucycsXG5cdFx0MjogJ3N1YicsXG5cdFx0MzogJ25vcCcsXG5cdH1cblxuXHRwdWJsaWMgZGVidWdGdXp6SXRlbShmdXp6SXRlbTogRnV6ekl0ZW0pOiBzdHJpbmcge1xuXHRcdHJldHVybiBbXG5cdFx0XHQnXFxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XFxuJyxcblx0XHRcdGBRdWVyeTogJHtmdXp6SXRlbS5xdWVyeX0sIHN1YmplY3Q6ICR7ZnV6ekl0ZW0uc3ViamVjdH0sIGVkaXREaXN0YW5jZTogJHtmdXp6SXRlbS5lZGl0RGlzdGFuY2V9YCxcblx0XHRcdCdcXG5FZGl0IE1hdHJpeDonLFxuXHRcdFx0dGhpcy5kZWJ1Z0VkaXRNYXRyaXgoZnV6ekl0ZW0pLFxuXHRcdFx0J1xcbk9wZXJhdGlvbiBNYXRyaXg6Jyxcblx0XHRcdHRoaXMuZGVidWdPcGVyYXRpb25NYXRyaXgoZnV6ekl0ZW0pLFxuXHRcdFx0J1xcbk1hdGNoIExvY2F0aW9uczonLFxuXHRcdFx0ZnV6ekl0ZW0ubWF0Y2hMb2NhdGlvbnMuam9pbignLCAnKSxcblx0XHRcdCdcXG5NYXRjaCBTdHJpbmc6Jyxcblx0XHRcdGZ1enpJdGVtLm1hdGNoTG9jYXRpb25zLm1hcCgoaW5kZXg6IG51bWJlcikgPT4gZnV6ekl0ZW0uc3ViamVjdFtpbmRleF0pLmpvaW4oJycpLFxuXHRcdF0uam9pbignXFxuJylcblx0fVxuXG5cdHB1YmxpYyBkZWJ1Z0VkaXRNYXRyaXgoZnV6ekl0ZW06IEZ1enpJdGVtKTogc3RyaW5nIHtcblx0XHRjb25zdCB0YWJsZUhlYWRlcjogc3RyaW5nID0gZnV6ekl0ZW0uc3ViamVjdC5zcGxpdCgnJykubWFwKChjaGFyYWN0ZXI6IHN0cmluZykgPT4gcGFkU3RyaW5nKGNoYXJhY3RlciwgNikpLmpvaW4oJycpO1xuXHRcdGNvbnN0IHRhYmxlUm93czogc3RyaW5nW10gPSBmdXp6SXRlbS5lZGl0TWF0cml4Lm1hcCgocm93OiBudW1iZXJbXSwgcm93SW5kZXg6IG51bWJlcikgPT4ge1xuXHRcdFx0Y29uc3Qgcm93U3RyaW5nID0gcm93Lm1hcCgoY2VsbDogbnVtYmVyKSA9PiBwYWRTdHJpbmcoY2VsbCwgNikpLmpvaW4oJycpO1xuXHRcdFx0cmV0dXJuIGAke2Z1enpJdGVtLnF1ZXJ5W3Jvd0luZGV4IC0gMV0gfHwgJyAnfSAke3Jvd1N0cmluZ31gO1xuXHRcdH0pO1xuXHRcdHJldHVybiBbXG5cdFx0XHRgICAgICAgICAke3RhYmxlSGVhZGVyfWAsXG5cdFx0XHQuLi50YWJsZVJvd3MsXG5cdFx0XS5qb2luKCdcXG4nKVxuXHR9XG5cblx0cHVibGljIGRlYnVnT3BlcmF0aW9uTWF0cml4KGZ1enpJdGVtOiBGdXp6SXRlbSk6IHN0cmluZyB7XG5cdFx0Y29uc3QgdGFibGVIZWFkZXI6IHN0cmluZyA9IGZ1enpJdGVtLnN1YmplY3Quc3BsaXQoJycpLm1hcCgoY2hhcmFjdGVyOiBzdHJpbmcpID0+IHBhZFN0cmluZyhjaGFyYWN0ZXIsIDYpKS5qb2luKCcnKTtcblx0XHRjb25zdCB0YWJsZVJvd3M6IHN0cmluZ1tdID0gZnV6ekl0ZW0ub3BlcmF0aW9uTWF0cml4Lm1hcCgocm93OiBudW1iZXJbXSwgcm93SW5kZXg6IG51bWJlcikgPT4ge1xuXHRcdFx0Y29uc3Qgcm93U3RyaW5nID0gcm93Lm1hcCgoY2VsbDogbnVtYmVyKSA9PiBwYWRTdHJpbmcoRnV6ekRlYnVnZ2VyLm9wZXJhdGlvblN0cmluZ0J5T3BlcmF0aW9uW2NlbGxdLCA2KSkuam9pbignJyk7XG5cdFx0XHRyZXR1cm4gYCR7ZnV6ekl0ZW0ucXVlcnlbcm93SW5kZXggLSAxXSB8fCAnICd9ICR7cm93U3RyaW5nfWA7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIFtcblx0XHRcdGAgICAgICAgICR7dGFibGVIZWFkZXJ9YCxcblx0XHRcdC4uLnRhYmxlUm93cyxcblx0XHRdLmpvaW4oJ1xcbicpXG5cdH1cblxufVxuXG5mdW5jdGlvbiBwYWRTdHJpbmcoc3ViamVjdDogYW55LCBwYWRkaW5nOiBudW1iZXIpOiBzdHJpbmcge1xuXHRyZXR1cm4gKCcgJy5yZXBlYXQocGFkZGluZykgKyBzdWJqZWN0KS5zbGljZSgtcGFkZGluZyk7XG59XG4iXX0=