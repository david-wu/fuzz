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
      return ["\nQuery: ".concat(fuzzItem.query, ", subject: ").concat(fuzzItem.subject, ", editDistance: ").concat(fuzzItem.editDistance), 'Edit Matrix:', this.debugEditMatrix(fuzzItem), 'Operation Matrix:', this.debugOperationMatrix(fuzzItem)].join('\n');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kZW1vL2Z1enotZGVidWdnZXIuY2xhc3MudHMiXSwibmFtZXMiOlsiRnV6ekRlYnVnZ2VyIiwiZnV6ekl0ZW0iLCJxdWVyeSIsInN1YmplY3QiLCJlZGl0RGlzdGFuY2UiLCJkZWJ1Z0VkaXRNYXRyaXgiLCJkZWJ1Z09wZXJhdGlvbk1hdHJpeCIsImpvaW4iLCJ0YWJsZUhlYWRlciIsInNwbGl0IiwibWFwIiwiY2hhcmFjdGVyIiwicGFkU3RyaW5nIiwidGFibGVSb3dzIiwiZWRpdE1hdHJpeCIsInJvdyIsInJvd0luZGV4Iiwicm93U3RyaW5nIiwiY2VsbCIsIm9wZXJhdGlvbk1hdHJpeCIsIm9wZXJhdGlvblN0cmluZ0J5T3BlcmF0aW9uIiwicGFkZGluZyIsInJlcGVhdCIsInNsaWNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQUVhQSxZOzs7Ozs7Ozs7a0NBU1NDLFEsRUFBNEI7QUFDaEQsYUFBTyxvQkFDTUEsUUFBUSxDQUFDQyxLQURmLHdCQUNrQ0QsUUFBUSxDQUFDRSxPQUQzQyw2QkFDcUVGLFFBQVEsQ0FBQ0csWUFEOUUsR0FFTixjQUZNLEVBR04sS0FBS0MsZUFBTCxDQUFxQkosUUFBckIsQ0FITSxFQUlOLG1CQUpNLEVBS04sS0FBS0ssb0JBQUwsQ0FBMEJMLFFBQTFCLENBTE0sRUFNTE0sSUFOSyxDQU1BLElBTkEsQ0FBUDtBQU9BOzs7b0NBRXNCTixRLEVBQTRCO0FBQ2xELFVBQU1PLFdBQW1CLEdBQUdQLFFBQVEsQ0FBQ0UsT0FBVCxDQUFpQk0sS0FBakIsQ0FBdUIsRUFBdkIsRUFBMkJDLEdBQTNCLENBQStCLFVBQUNDLFNBQUQ7QUFBQSxlQUF1QkMsU0FBUyxDQUFDRCxTQUFELEVBQVksQ0FBWixDQUFoQztBQUFBLE9BQS9CLEVBQStFSixJQUEvRSxDQUFvRixFQUFwRixDQUE1QjtBQUNBLFVBQU1NLFNBQW1CLEdBQUdaLFFBQVEsQ0FBQ2EsVUFBVCxDQUFvQkosR0FBcEIsQ0FBd0IsVUFBQ0ssR0FBRCxFQUFnQkMsUUFBaEIsRUFBcUM7QUFDeEYsWUFBTUMsU0FBUyxHQUFHRixHQUFHLENBQUNMLEdBQUosQ0FBUSxVQUFDUSxJQUFEO0FBQUEsaUJBQWtCTixTQUFTLENBQUNNLElBQUQsRUFBTyxDQUFQLENBQTNCO0FBQUEsU0FBUixFQUE4Q1gsSUFBOUMsQ0FBbUQsRUFBbkQsQ0FBbEI7QUFDQSx5QkFBVU4sUUFBUSxDQUFDQyxLQUFULENBQWVjLFFBQVEsR0FBRyxDQUExQixLQUFnQyxHQUExQyxjQUFpREMsU0FBakQ7QUFDQSxPQUgyQixDQUE1QjtBQUlBLGFBQU8sbUJBQ0tULFdBREwsNkJBRUhLLFNBRkcsR0FHTE4sSUFISyxDQUdBLElBSEEsQ0FBUDtBQUlBOzs7eUNBRTJCTixRLEVBQTRCO0FBQ3ZELFVBQU1PLFdBQW1CLEdBQUdQLFFBQVEsQ0FBQ0UsT0FBVCxDQUFpQk0sS0FBakIsQ0FBdUIsRUFBdkIsRUFBMkJDLEdBQTNCLENBQStCLFVBQUNDLFNBQUQ7QUFBQSxlQUF1QkMsU0FBUyxDQUFDRCxTQUFELEVBQVksQ0FBWixDQUFoQztBQUFBLE9BQS9CLEVBQStFSixJQUEvRSxDQUFvRixFQUFwRixDQUE1QjtBQUNBLFVBQU1NLFNBQW1CLEdBQUdaLFFBQVEsQ0FBQ2tCLGVBQVQsQ0FBeUJULEdBQXpCLENBQTZCLFVBQUNLLEdBQUQsRUFBZ0JDLFFBQWhCLEVBQXFDO0FBQzdGLFlBQU1DLFNBQVMsR0FBR0YsR0FBRyxDQUFDTCxHQUFKLENBQVEsVUFBQ1EsSUFBRDtBQUFBLGlCQUFrQk4sU0FBUyxDQUFDWixZQUFZLENBQUNvQiwwQkFBYixDQUF3Q0YsSUFBeEMsQ0FBRCxFQUFnRCxDQUFoRCxDQUEzQjtBQUFBLFNBQVIsRUFBdUZYLElBQXZGLENBQTRGLEVBQTVGLENBQWxCO0FBQ0EseUJBQVVOLFFBQVEsQ0FBQ0MsS0FBVCxDQUFlYyxRQUFRLEdBQUcsQ0FBMUIsS0FBZ0MsR0FBMUMsY0FBaURDLFNBQWpEO0FBQ0EsT0FIMkIsQ0FBNUI7QUFJQSxhQUFPLG1CQUNLVCxXQURMLDZCQUVISyxTQUZHLEdBR0xOLElBSEssQ0FHQSxJQUhBLENBQVA7QUFJQTs7Ozs7Ozs7Z0JBekNXUCxZLGdDQUV1RTtBQUNsRixLQUFHLEtBRCtFO0FBRWxGLEtBQUcsS0FGK0U7QUFHbEYsS0FBRyxLQUgrRTtBQUlsRixLQUFHO0FBSitFLEM7O0FBMkNwRixTQUFTWSxTQUFULENBQW1CVCxPQUFuQixFQUFpQ2tCLE9BQWpDLEVBQTBEO0FBQ3pELFNBQU8sQ0FBQyxJQUFJQyxNQUFKLENBQVdELE9BQVgsSUFBc0JsQixPQUF2QixFQUFnQ29CLEtBQWhDLENBQXNDLENBQUNGLE9BQXZDLENBQVA7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEVkaXRDb3N0cywgRnV6ekl0ZW0gfSBmcm9tICcuLi9tb2RlbHMnO1xuXG5leHBvcnQgY2xhc3MgRnV6ekRlYnVnZ2VyIHtcblxuXHRwdWJsaWMgc3RhdGljIHJlYWRvbmx5IG9wZXJhdGlvblN0cmluZ0J5T3BlcmF0aW9uOiB7W29wZXJhdGlvbjogbnVtYmVyXTogc3RyaW5nfSA9IHtcblx0XHQwOiAnZGVsJyxcblx0XHQxOiAnaW5zJyxcblx0XHQyOiAnc3ViJyxcblx0XHQzOiAnbm9wJyxcblx0fVxuXG5cdHB1YmxpYyBkZWJ1Z0Z1enpJdGVtKGZ1enpJdGVtOiBGdXp6SXRlbSk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIFtcblx0XHRcdGBcXG5RdWVyeTogJHtmdXp6SXRlbS5xdWVyeX0sIHN1YmplY3Q6ICR7ZnV6ekl0ZW0uc3ViamVjdH0sIGVkaXREaXN0YW5jZTogJHtmdXp6SXRlbS5lZGl0RGlzdGFuY2V9YCxcblx0XHRcdCdFZGl0IE1hdHJpeDonLFxuXHRcdFx0dGhpcy5kZWJ1Z0VkaXRNYXRyaXgoZnV6ekl0ZW0pLFxuXHRcdFx0J09wZXJhdGlvbiBNYXRyaXg6Jyxcblx0XHRcdHRoaXMuZGVidWdPcGVyYXRpb25NYXRyaXgoZnV6ekl0ZW0pLFxuXHRcdF0uam9pbignXFxuJylcblx0fVxuXG5cdHB1YmxpYyBkZWJ1Z0VkaXRNYXRyaXgoZnV6ekl0ZW06IEZ1enpJdGVtKTogc3RyaW5nIHtcblx0XHRjb25zdCB0YWJsZUhlYWRlcjogc3RyaW5nID0gZnV6ekl0ZW0uc3ViamVjdC5zcGxpdCgnJykubWFwKChjaGFyYWN0ZXI6IHN0cmluZykgPT4gcGFkU3RyaW5nKGNoYXJhY3RlciwgNikpLmpvaW4oJycpO1xuXHRcdGNvbnN0IHRhYmxlUm93czogc3RyaW5nW10gPSBmdXp6SXRlbS5lZGl0TWF0cml4Lm1hcCgocm93OiBudW1iZXJbXSwgcm93SW5kZXg6IG51bWJlcikgPT4ge1xuXHRcdFx0Y29uc3Qgcm93U3RyaW5nID0gcm93Lm1hcCgoY2VsbDogbnVtYmVyKSA9PiBwYWRTdHJpbmcoY2VsbCwgNikpLmpvaW4oJycpO1xuXHRcdFx0cmV0dXJuIGAke2Z1enpJdGVtLnF1ZXJ5W3Jvd0luZGV4IC0gMV0gfHwgJyAnfSAke3Jvd1N0cmluZ31gO1xuXHRcdH0pO1xuXHRcdHJldHVybiBbXG5cdFx0XHRgICAgICAgICAke3RhYmxlSGVhZGVyfWAsXG5cdFx0XHQuLi50YWJsZVJvd3MsXG5cdFx0XS5qb2luKCdcXG4nKVxuXHR9XG5cblx0cHVibGljIGRlYnVnT3BlcmF0aW9uTWF0cml4KGZ1enpJdGVtOiBGdXp6SXRlbSk6IHN0cmluZyB7XG5cdFx0Y29uc3QgdGFibGVIZWFkZXI6IHN0cmluZyA9IGZ1enpJdGVtLnN1YmplY3Quc3BsaXQoJycpLm1hcCgoY2hhcmFjdGVyOiBzdHJpbmcpID0+IHBhZFN0cmluZyhjaGFyYWN0ZXIsIDYpKS5qb2luKCcnKTtcblx0XHRjb25zdCB0YWJsZVJvd3M6IHN0cmluZ1tdID0gZnV6ekl0ZW0ub3BlcmF0aW9uTWF0cml4Lm1hcCgocm93OiBudW1iZXJbXSwgcm93SW5kZXg6IG51bWJlcikgPT4ge1xuXHRcdFx0Y29uc3Qgcm93U3RyaW5nID0gcm93Lm1hcCgoY2VsbDogbnVtYmVyKSA9PiBwYWRTdHJpbmcoRnV6ekRlYnVnZ2VyLm9wZXJhdGlvblN0cmluZ0J5T3BlcmF0aW9uW2NlbGxdLCA2KSkuam9pbignJyk7XG5cdFx0XHRyZXR1cm4gYCR7ZnV6ekl0ZW0ucXVlcnlbcm93SW5kZXggLSAxXSB8fCAnICd9ICR7cm93U3RyaW5nfWA7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIFtcblx0XHRcdGAgICAgICAgICR7dGFibGVIZWFkZXJ9YCxcblx0XHRcdC4uLnRhYmxlUm93cyxcblx0XHRdLmpvaW4oJ1xcbicpXG5cdH1cblxufVxuXG5mdW5jdGlvbiBwYWRTdHJpbmcoc3ViamVjdDogYW55LCBwYWRkaW5nOiBudW1iZXIpOiBzdHJpbmcge1xuXHRyZXR1cm4gKCcgJy5yZXBlYXQocGFkZGluZykgKyBzdWJqZWN0KS5zbGljZSgtcGFkZGluZyk7XG59XG4iXX0=