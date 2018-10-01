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
      return ['\n=======================================\n', "Query: ".concat(fuzzItem.query, ", subject: ").concat(fuzzItem.subject, ", editDistance: ").concat(fuzzItem.editDistance), '\nEdit Matrix:', this.debugEditMatrix(fuzzItem), '\nOperation Matrix:', this.debugOperationMatrix(fuzzItem), '\nMatch Ranges:', this.debugMatchRanges(fuzzItem.matchRanges)].join('\n');
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
  }, {
    key: "debugMatchRanges",
    value: function debugMatchRanges(ranges) {
      return ranges.map(function (range) {
        return "[".concat(range.join(', '), "]");
      }).join(', ');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kZW1vL2Z1enotZGVidWdnZXIuY2xhc3MudHMiXSwibmFtZXMiOlsiRnV6ekRlYnVnZ2VyIiwiZnV6ekl0ZW0iLCJxdWVyeSIsInN1YmplY3QiLCJlZGl0RGlzdGFuY2UiLCJkZWJ1Z0VkaXRNYXRyaXgiLCJkZWJ1Z09wZXJhdGlvbk1hdHJpeCIsImRlYnVnTWF0Y2hSYW5nZXMiLCJtYXRjaFJhbmdlcyIsImpvaW4iLCJ0YWJsZUhlYWRlciIsInNwbGl0IiwibWFwIiwiY2hhcmFjdGVyIiwicGFkU3RyaW5nIiwidGFibGVSb3dzIiwiZWRpdE1hdHJpeCIsInJvdyIsInJvd0luZGV4Iiwicm93U3RyaW5nIiwiY2VsbCIsIm9wZXJhdGlvbk1hdHJpeCIsIm9wZXJhdGlvblN0cmluZ0J5T3BlcmF0aW9uIiwicmFuZ2VzIiwicmFuZ2UiLCJwYWRkaW5nIiwicmVwZWF0Iiwic2xpY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBRWFBLFk7Ozs7Ozs7OztrQ0FTU0MsUSxFQUE0QjtBQUNoRCxhQUFPLENBQ04sNkNBRE0sbUJBRUlBLFFBQVEsQ0FBQ0MsS0FGYix3QkFFZ0NELFFBQVEsQ0FBQ0UsT0FGekMsNkJBRW1FRixRQUFRLENBQUNHLFlBRjVFLEdBR04sZ0JBSE0sRUFJTixLQUFLQyxlQUFMLENBQXFCSixRQUFyQixDQUpNLEVBS04scUJBTE0sRUFNTixLQUFLSyxvQkFBTCxDQUEwQkwsUUFBMUIsQ0FOTSxFQU9OLGlCQVBNLEVBUU4sS0FBS00sZ0JBQUwsQ0FBc0JOLFFBQVEsQ0FBQ08sV0FBL0IsQ0FSTSxFQVNMQyxJQVRLLENBU0EsSUFUQSxDQUFQO0FBVUE7OztvQ0FFc0JSLFEsRUFBNEI7QUFDbEQsVUFBTVMsV0FBbUIsR0FBR1QsUUFBUSxDQUFDRSxPQUFULENBQWlCUSxLQUFqQixDQUF1QixFQUF2QixFQUEyQkMsR0FBM0IsQ0FBK0IsVUFBQ0MsU0FBRDtBQUFBLGVBQXVCQyxTQUFTLENBQUNELFNBQUQsRUFBWSxDQUFaLENBQWhDO0FBQUEsT0FBL0IsRUFBK0VKLElBQS9FLENBQW9GLEVBQXBGLENBQTVCO0FBQ0EsVUFBTU0sU0FBbUIsR0FBR2QsUUFBUSxDQUFDZSxVQUFULENBQW9CSixHQUFwQixDQUF3QixVQUFDSyxHQUFELEVBQWdCQyxRQUFoQixFQUFxQztBQUN4RixZQUFNQyxTQUFTLEdBQUdGLEdBQUcsQ0FBQ0wsR0FBSixDQUFRLFVBQUNRLElBQUQ7QUFBQSxpQkFBa0JOLFNBQVMsQ0FBQ00sSUFBRCxFQUFPLENBQVAsQ0FBM0I7QUFBQSxTQUFSLEVBQThDWCxJQUE5QyxDQUFtRCxFQUFuRCxDQUFsQjtBQUNBLHlCQUFVUixRQUFRLENBQUNDLEtBQVQsQ0FBZWdCLFFBQVEsR0FBRyxDQUExQixLQUFnQyxHQUExQyxjQUFpREMsU0FBakQ7QUFDQSxPQUgyQixDQUE1QjtBQUlBLGFBQU8sbUJBQ0tULFdBREwsNkJBRUhLLFNBRkcsR0FHTE4sSUFISyxDQUdBLElBSEEsQ0FBUDtBQUlBOzs7eUNBRTJCUixRLEVBQTRCO0FBQ3ZELFVBQU1TLFdBQW1CLEdBQUdULFFBQVEsQ0FBQ0UsT0FBVCxDQUFpQlEsS0FBakIsQ0FBdUIsRUFBdkIsRUFBMkJDLEdBQTNCLENBQStCLFVBQUNDLFNBQUQ7QUFBQSxlQUF1QkMsU0FBUyxDQUFDRCxTQUFELEVBQVksQ0FBWixDQUFoQztBQUFBLE9BQS9CLEVBQStFSixJQUEvRSxDQUFvRixFQUFwRixDQUE1QjtBQUNBLFVBQU1NLFNBQW1CLEdBQUdkLFFBQVEsQ0FBQ29CLGVBQVQsQ0FBeUJULEdBQXpCLENBQTZCLFVBQUNLLEdBQUQsRUFBZ0JDLFFBQWhCLEVBQXFDO0FBQzdGLFlBQU1DLFNBQVMsR0FBR0YsR0FBRyxDQUFDTCxHQUFKLENBQVEsVUFBQ1EsSUFBRDtBQUFBLGlCQUFrQk4sU0FBUyxDQUFDZCxZQUFZLENBQUNzQiwwQkFBYixDQUF3Q0YsSUFBeEMsQ0FBRCxFQUFnRCxDQUFoRCxDQUEzQjtBQUFBLFNBQVIsRUFBdUZYLElBQXZGLENBQTRGLEVBQTVGLENBQWxCO0FBQ0EseUJBQVVSLFFBQVEsQ0FBQ0MsS0FBVCxDQUFlZ0IsUUFBUSxHQUFHLENBQTFCLEtBQWdDLEdBQTFDLGNBQWlEQyxTQUFqRDtBQUNBLE9BSDJCLENBQTVCO0FBSUEsYUFBTyxtQkFDS1QsV0FETCw2QkFFSEssU0FGRyxHQUdMTixJQUhLLENBR0EsSUFIQSxDQUFQO0FBSUE7OztxQ0FFdUJjLE0sRUFBb0I7QUFDM0MsYUFBT0EsTUFBTSxDQUFDWCxHQUFQLENBQVcsVUFBQ1ksS0FBRCxFQUFxQjtBQUN0QywwQkFBV0EsS0FBSyxDQUFDZixJQUFOLENBQVcsSUFBWCxDQUFYO0FBQ0EsT0FGTSxFQUVKQSxJQUZJLENBRUMsSUFGRCxDQUFQO0FBR0E7Ozs7Ozs7O2dCQWxEV1QsWSxnQ0FFdUU7QUFDbEYsS0FBRyxLQUQrRTtBQUVsRixLQUFHLEtBRitFO0FBR2xGLEtBQUcsS0FIK0U7QUFJbEYsS0FBRztBQUorRSxDOztBQW9EcEYsU0FBU2MsU0FBVCxDQUFtQlgsT0FBbkIsRUFBaUNzQixPQUFqQyxFQUEwRDtBQUN6RCxTQUFPLENBQUMsSUFBSUMsTUFBSixDQUFXRCxPQUFYLElBQXNCdEIsT0FBdkIsRUFBZ0N3QixLQUFoQyxDQUFzQyxDQUFDRixPQUF2QyxDQUFQO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFZGl0Q29zdHMsIEZ1enpJdGVtIH0gZnJvbSAnLi4vbW9kZWxzJztcblxuZXhwb3J0IGNsYXNzIEZ1enpEZWJ1Z2dlciB7XG5cblx0cHVibGljIHN0YXRpYyByZWFkb25seSBvcGVyYXRpb25TdHJpbmdCeU9wZXJhdGlvbjoge1tvcGVyYXRpb246IG51bWJlcl06IHN0cmluZ30gPSB7XG5cdFx0MDogJ2RlbCcsXG5cdFx0MTogJ2lucycsXG5cdFx0MjogJ3N1YicsXG5cdFx0MzogJ25vcCcsXG5cdH1cblxuXHRwdWJsaWMgZGVidWdGdXp6SXRlbShmdXp6SXRlbTogRnV6ekl0ZW0pOiBzdHJpbmcge1xuXHRcdHJldHVybiBbXG5cdFx0XHQnXFxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XFxuJyxcblx0XHRcdGBRdWVyeTogJHtmdXp6SXRlbS5xdWVyeX0sIHN1YmplY3Q6ICR7ZnV6ekl0ZW0uc3ViamVjdH0sIGVkaXREaXN0YW5jZTogJHtmdXp6SXRlbS5lZGl0RGlzdGFuY2V9YCxcblx0XHRcdCdcXG5FZGl0IE1hdHJpeDonLFxuXHRcdFx0dGhpcy5kZWJ1Z0VkaXRNYXRyaXgoZnV6ekl0ZW0pLFxuXHRcdFx0J1xcbk9wZXJhdGlvbiBNYXRyaXg6Jyxcblx0XHRcdHRoaXMuZGVidWdPcGVyYXRpb25NYXRyaXgoZnV6ekl0ZW0pLFxuXHRcdFx0J1xcbk1hdGNoIFJhbmdlczonLFxuXHRcdFx0dGhpcy5kZWJ1Z01hdGNoUmFuZ2VzKGZ1enpJdGVtLm1hdGNoUmFuZ2VzKSxcblx0XHRdLmpvaW4oJ1xcbicpXG5cdH1cblxuXHRwdWJsaWMgZGVidWdFZGl0TWF0cml4KGZ1enpJdGVtOiBGdXp6SXRlbSk6IHN0cmluZyB7XG5cdFx0Y29uc3QgdGFibGVIZWFkZXI6IHN0cmluZyA9IGZ1enpJdGVtLnN1YmplY3Quc3BsaXQoJycpLm1hcCgoY2hhcmFjdGVyOiBzdHJpbmcpID0+IHBhZFN0cmluZyhjaGFyYWN0ZXIsIDYpKS5qb2luKCcnKTtcblx0XHRjb25zdCB0YWJsZVJvd3M6IHN0cmluZ1tdID0gZnV6ekl0ZW0uZWRpdE1hdHJpeC5tYXAoKHJvdzogbnVtYmVyW10sIHJvd0luZGV4OiBudW1iZXIpID0+IHtcblx0XHRcdGNvbnN0IHJvd1N0cmluZyA9IHJvdy5tYXAoKGNlbGw6IG51bWJlcikgPT4gcGFkU3RyaW5nKGNlbGwsIDYpKS5qb2luKCcnKTtcblx0XHRcdHJldHVybiBgJHtmdXp6SXRlbS5xdWVyeVtyb3dJbmRleCAtIDFdIHx8ICcgJ30gJHtyb3dTdHJpbmd9YDtcblx0XHR9KTtcblx0XHRyZXR1cm4gW1xuXHRcdFx0YCAgICAgICAgJHt0YWJsZUhlYWRlcn1gLFxuXHRcdFx0Li4udGFibGVSb3dzLFxuXHRcdF0uam9pbignXFxuJylcblx0fVxuXG5cdHB1YmxpYyBkZWJ1Z09wZXJhdGlvbk1hdHJpeChmdXp6SXRlbTogRnV6ekl0ZW0pOiBzdHJpbmcge1xuXHRcdGNvbnN0IHRhYmxlSGVhZGVyOiBzdHJpbmcgPSBmdXp6SXRlbS5zdWJqZWN0LnNwbGl0KCcnKS5tYXAoKGNoYXJhY3Rlcjogc3RyaW5nKSA9PiBwYWRTdHJpbmcoY2hhcmFjdGVyLCA2KSkuam9pbignJyk7XG5cdFx0Y29uc3QgdGFibGVSb3dzOiBzdHJpbmdbXSA9IGZ1enpJdGVtLm9wZXJhdGlvbk1hdHJpeC5tYXAoKHJvdzogbnVtYmVyW10sIHJvd0luZGV4OiBudW1iZXIpID0+IHtcblx0XHRcdGNvbnN0IHJvd1N0cmluZyA9IHJvdy5tYXAoKGNlbGw6IG51bWJlcikgPT4gcGFkU3RyaW5nKEZ1enpEZWJ1Z2dlci5vcGVyYXRpb25TdHJpbmdCeU9wZXJhdGlvbltjZWxsXSwgNikpLmpvaW4oJycpO1xuXHRcdFx0cmV0dXJuIGAke2Z1enpJdGVtLnF1ZXJ5W3Jvd0luZGV4IC0gMV0gfHwgJyAnfSAke3Jvd1N0cmluZ31gO1xuXHRcdH0pO1xuXHRcdHJldHVybiBbXG5cdFx0XHRgICAgICAgICAke3RhYmxlSGVhZGVyfWAsXG5cdFx0XHQuLi50YWJsZVJvd3MsXG5cdFx0XS5qb2luKCdcXG4nKVxuXHR9XG5cblx0cHVibGljIGRlYnVnTWF0Y2hSYW5nZXMocmFuZ2VzOiBudW1iZXJbXVtdKSB7XG5cdFx0cmV0dXJuIHJhbmdlcy5tYXAoKHJhbmdlOiBudW1iZXJbXSkgPT4ge1xuXHRcdFx0cmV0dXJuIGBbJHtyYW5nZS5qb2luKCcsICcpfV1gO1xuXHRcdH0pLmpvaW4oJywgJyk7XG5cdH1cblxufVxuXG5mdW5jdGlvbiBwYWRTdHJpbmcoc3ViamVjdDogYW55LCBwYWRkaW5nOiBudW1iZXIpOiBzdHJpbmcge1xuXHRyZXR1cm4gKCcgJy5yZXBlYXQocGFkZGluZykgKyBzdWJqZWN0KS5zbGljZSgtcGFkZGluZyk7XG59XG4iXX0=