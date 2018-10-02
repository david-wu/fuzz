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
      return ['\n=======================================\n', "Query: ".concat(fuzzItem.query, ", subject: ").concat(fuzzItem.subject, ", key: ").concat(fuzzItem.key, ", editDistance: ").concat(fuzzItem.editDistance), '\nEdit Matrix:', this.debugEditMatrix(fuzzItem), '\nOperation Matrix:', this.debugOperationMatrix(fuzzItem), '\nMatch Ranges:', this.debugMatchRanges(fuzzItem.matchRanges)].join('\n');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kZW1vL2Z1enotZGVidWdnZXIuY2xhc3MudHMiXSwibmFtZXMiOlsiRnV6ekRlYnVnZ2VyIiwiZnV6ekl0ZW0iLCJxdWVyeSIsInN1YmplY3QiLCJrZXkiLCJlZGl0RGlzdGFuY2UiLCJkZWJ1Z0VkaXRNYXRyaXgiLCJkZWJ1Z09wZXJhdGlvbk1hdHJpeCIsImRlYnVnTWF0Y2hSYW5nZXMiLCJtYXRjaFJhbmdlcyIsImpvaW4iLCJ0YWJsZUhlYWRlciIsInNwbGl0IiwibWFwIiwiY2hhcmFjdGVyIiwicGFkU3RyaW5nIiwidGFibGVSb3dzIiwiZWRpdE1hdHJpeCIsInJvdyIsInJvd0luZGV4Iiwicm93U3RyaW5nIiwiY2VsbCIsIm9wZXJhdGlvbk1hdHJpeCIsIm9wZXJhdGlvblN0cmluZ0J5T3BlcmF0aW9uIiwicmFuZ2VzIiwicmFuZ2UiLCJwYWRkaW5nIiwicmVwZWF0Iiwic2xpY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBRWFBLFk7Ozs7Ozs7OztrQ0FTU0MsUSxFQUE0QjtBQUNoRCxhQUFPLENBQ04sNkNBRE0sbUJBRUlBLFFBQVEsQ0FBQ0MsS0FGYix3QkFFZ0NELFFBQVEsQ0FBQ0UsT0FGekMsb0JBRTBERixRQUFRLENBQUNHLEdBRm5FLDZCQUV5RkgsUUFBUSxDQUFDSSxZQUZsRyxHQUdOLGdCQUhNLEVBSU4sS0FBS0MsZUFBTCxDQUFxQkwsUUFBckIsQ0FKTSxFQUtOLHFCQUxNLEVBTU4sS0FBS00sb0JBQUwsQ0FBMEJOLFFBQTFCLENBTk0sRUFPTixpQkFQTSxFQVFOLEtBQUtPLGdCQUFMLENBQXNCUCxRQUFRLENBQUNRLFdBQS9CLENBUk0sRUFTTEMsSUFUSyxDQVNBLElBVEEsQ0FBUDtBQVVBOzs7b0NBRXNCVCxRLEVBQTRCO0FBQ2xELFVBQU1VLFdBQW1CLEdBQUdWLFFBQVEsQ0FBQ0UsT0FBVCxDQUFpQlMsS0FBakIsQ0FBdUIsRUFBdkIsRUFBMkJDLEdBQTNCLENBQStCLFVBQUNDLFNBQUQ7QUFBQSxlQUF1QkMsU0FBUyxDQUFDRCxTQUFELEVBQVksQ0FBWixDQUFoQztBQUFBLE9BQS9CLEVBQStFSixJQUEvRSxDQUFvRixFQUFwRixDQUE1QjtBQUNBLFVBQU1NLFNBQW1CLEdBQUdmLFFBQVEsQ0FBQ2dCLFVBQVQsQ0FBb0JKLEdBQXBCLENBQXdCLFVBQUNLLEdBQUQsRUFBZ0JDLFFBQWhCLEVBQXFDO0FBQ3hGLFlBQU1DLFNBQVMsR0FBR0YsR0FBRyxDQUFDTCxHQUFKLENBQVEsVUFBQ1EsSUFBRDtBQUFBLGlCQUFrQk4sU0FBUyxDQUFDTSxJQUFELEVBQU8sQ0FBUCxDQUEzQjtBQUFBLFNBQVIsRUFBOENYLElBQTlDLENBQW1ELEVBQW5ELENBQWxCO0FBQ0EseUJBQVVULFFBQVEsQ0FBQ0MsS0FBVCxDQUFlaUIsUUFBUSxHQUFHLENBQTFCLEtBQWdDLEdBQTFDLGNBQWlEQyxTQUFqRDtBQUNBLE9BSDJCLENBQTVCO0FBSUEsYUFBTyxtQkFDS1QsV0FETCw2QkFFSEssU0FGRyxHQUdMTixJQUhLLENBR0EsSUFIQSxDQUFQO0FBSUE7Ozt5Q0FFMkJULFEsRUFBNEI7QUFDdkQsVUFBTVUsV0FBbUIsR0FBR1YsUUFBUSxDQUFDRSxPQUFULENBQWlCUyxLQUFqQixDQUF1QixFQUF2QixFQUEyQkMsR0FBM0IsQ0FBK0IsVUFBQ0MsU0FBRDtBQUFBLGVBQXVCQyxTQUFTLENBQUNELFNBQUQsRUFBWSxDQUFaLENBQWhDO0FBQUEsT0FBL0IsRUFBK0VKLElBQS9FLENBQW9GLEVBQXBGLENBQTVCO0FBQ0EsVUFBTU0sU0FBbUIsR0FBR2YsUUFBUSxDQUFDcUIsZUFBVCxDQUF5QlQsR0FBekIsQ0FBNkIsVUFBQ0ssR0FBRCxFQUFnQkMsUUFBaEIsRUFBcUM7QUFDN0YsWUFBTUMsU0FBUyxHQUFHRixHQUFHLENBQUNMLEdBQUosQ0FBUSxVQUFDUSxJQUFEO0FBQUEsaUJBQWtCTixTQUFTLENBQUNmLFlBQVksQ0FBQ3VCLDBCQUFiLENBQXdDRixJQUF4QyxDQUFELEVBQWdELENBQWhELENBQTNCO0FBQUEsU0FBUixFQUF1RlgsSUFBdkYsQ0FBNEYsRUFBNUYsQ0FBbEI7QUFDQSx5QkFBVVQsUUFBUSxDQUFDQyxLQUFULENBQWVpQixRQUFRLEdBQUcsQ0FBMUIsS0FBZ0MsR0FBMUMsY0FBaURDLFNBQWpEO0FBQ0EsT0FIMkIsQ0FBNUI7QUFJQSxhQUFPLG1CQUNLVCxXQURMLDZCQUVISyxTQUZHLEdBR0xOLElBSEssQ0FHQSxJQUhBLENBQVA7QUFJQTs7O3FDQUV1QmMsTSxFQUFvQjtBQUMzQyxhQUFPQSxNQUFNLENBQUNYLEdBQVAsQ0FBVyxVQUFDWSxLQUFELEVBQXFCO0FBQ3RDLDBCQUFXQSxLQUFLLENBQUNmLElBQU4sQ0FBVyxJQUFYLENBQVg7QUFDQSxPQUZNLEVBRUpBLElBRkksQ0FFQyxJQUZELENBQVA7QUFHQTs7Ozs7Ozs7Z0JBbERXVixZLGdDQUV1RTtBQUNsRixLQUFHLEtBRCtFO0FBRWxGLEtBQUcsS0FGK0U7QUFHbEYsS0FBRyxLQUgrRTtBQUlsRixLQUFHO0FBSitFLEM7O0FBb0RwRixTQUFTZSxTQUFULENBQW1CWixPQUFuQixFQUFpQ3VCLE9BQWpDLEVBQTBEO0FBQ3pELFNBQU8sQ0FBQyxJQUFJQyxNQUFKLENBQVdELE9BQVgsSUFBc0J2QixPQUF2QixFQUFnQ3lCLEtBQWhDLENBQXNDLENBQUNGLE9BQXZDLENBQVA7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEVkaXRDb3N0cywgRnV6ekl0ZW0gfSBmcm9tICcuLi9tb2RlbHMnO1xuXG5leHBvcnQgY2xhc3MgRnV6ekRlYnVnZ2VyIHtcblxuXHRwdWJsaWMgc3RhdGljIHJlYWRvbmx5IG9wZXJhdGlvblN0cmluZ0J5T3BlcmF0aW9uOiB7W29wZXJhdGlvbjogbnVtYmVyXTogc3RyaW5nfSA9IHtcblx0XHQwOiAnZGVsJyxcblx0XHQxOiAnaW5zJyxcblx0XHQyOiAnc3ViJyxcblx0XHQzOiAnbm9wJyxcblx0fVxuXG5cdHB1YmxpYyBkZWJ1Z0Z1enpJdGVtKGZ1enpJdGVtOiBGdXp6SXRlbSk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIFtcblx0XHRcdCdcXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cXG4nLFxuXHRcdFx0YFF1ZXJ5OiAke2Z1enpJdGVtLnF1ZXJ5fSwgc3ViamVjdDogJHtmdXp6SXRlbS5zdWJqZWN0fSwga2V5OiAke2Z1enpJdGVtLmtleX0sIGVkaXREaXN0YW5jZTogJHtmdXp6SXRlbS5lZGl0RGlzdGFuY2V9YCxcblx0XHRcdCdcXG5FZGl0IE1hdHJpeDonLFxuXHRcdFx0dGhpcy5kZWJ1Z0VkaXRNYXRyaXgoZnV6ekl0ZW0pLFxuXHRcdFx0J1xcbk9wZXJhdGlvbiBNYXRyaXg6Jyxcblx0XHRcdHRoaXMuZGVidWdPcGVyYXRpb25NYXRyaXgoZnV6ekl0ZW0pLFxuXHRcdFx0J1xcbk1hdGNoIFJhbmdlczonLFxuXHRcdFx0dGhpcy5kZWJ1Z01hdGNoUmFuZ2VzKGZ1enpJdGVtLm1hdGNoUmFuZ2VzKSxcblx0XHRdLmpvaW4oJ1xcbicpXG5cdH1cblxuXHRwdWJsaWMgZGVidWdFZGl0TWF0cml4KGZ1enpJdGVtOiBGdXp6SXRlbSk6IHN0cmluZyB7XG5cdFx0Y29uc3QgdGFibGVIZWFkZXI6IHN0cmluZyA9IGZ1enpJdGVtLnN1YmplY3Quc3BsaXQoJycpLm1hcCgoY2hhcmFjdGVyOiBzdHJpbmcpID0+IHBhZFN0cmluZyhjaGFyYWN0ZXIsIDYpKS5qb2luKCcnKTtcblx0XHRjb25zdCB0YWJsZVJvd3M6IHN0cmluZ1tdID0gZnV6ekl0ZW0uZWRpdE1hdHJpeC5tYXAoKHJvdzogbnVtYmVyW10sIHJvd0luZGV4OiBudW1iZXIpID0+IHtcblx0XHRcdGNvbnN0IHJvd1N0cmluZyA9IHJvdy5tYXAoKGNlbGw6IG51bWJlcikgPT4gcGFkU3RyaW5nKGNlbGwsIDYpKS5qb2luKCcnKTtcblx0XHRcdHJldHVybiBgJHtmdXp6SXRlbS5xdWVyeVtyb3dJbmRleCAtIDFdIHx8ICcgJ30gJHtyb3dTdHJpbmd9YDtcblx0XHR9KTtcblx0XHRyZXR1cm4gW1xuXHRcdFx0YCAgICAgICAgJHt0YWJsZUhlYWRlcn1gLFxuXHRcdFx0Li4udGFibGVSb3dzLFxuXHRcdF0uam9pbignXFxuJylcblx0fVxuXG5cdHB1YmxpYyBkZWJ1Z09wZXJhdGlvbk1hdHJpeChmdXp6SXRlbTogRnV6ekl0ZW0pOiBzdHJpbmcge1xuXHRcdGNvbnN0IHRhYmxlSGVhZGVyOiBzdHJpbmcgPSBmdXp6SXRlbS5zdWJqZWN0LnNwbGl0KCcnKS5tYXAoKGNoYXJhY3Rlcjogc3RyaW5nKSA9PiBwYWRTdHJpbmcoY2hhcmFjdGVyLCA2KSkuam9pbignJyk7XG5cdFx0Y29uc3QgdGFibGVSb3dzOiBzdHJpbmdbXSA9IGZ1enpJdGVtLm9wZXJhdGlvbk1hdHJpeC5tYXAoKHJvdzogbnVtYmVyW10sIHJvd0luZGV4OiBudW1iZXIpID0+IHtcblx0XHRcdGNvbnN0IHJvd1N0cmluZyA9IHJvdy5tYXAoKGNlbGw6IG51bWJlcikgPT4gcGFkU3RyaW5nKEZ1enpEZWJ1Z2dlci5vcGVyYXRpb25TdHJpbmdCeU9wZXJhdGlvbltjZWxsXSwgNikpLmpvaW4oJycpO1xuXHRcdFx0cmV0dXJuIGAke2Z1enpJdGVtLnF1ZXJ5W3Jvd0luZGV4IC0gMV0gfHwgJyAnfSAke3Jvd1N0cmluZ31gO1xuXHRcdH0pO1xuXHRcdHJldHVybiBbXG5cdFx0XHRgICAgICAgICAke3RhYmxlSGVhZGVyfWAsXG5cdFx0XHQuLi50YWJsZVJvd3MsXG5cdFx0XS5qb2luKCdcXG4nKVxuXHR9XG5cblx0cHVibGljIGRlYnVnTWF0Y2hSYW5nZXMocmFuZ2VzOiBudW1iZXJbXVtdKSB7XG5cdFx0cmV0dXJuIHJhbmdlcy5tYXAoKHJhbmdlOiBudW1iZXJbXSkgPT4ge1xuXHRcdFx0cmV0dXJuIGBbJHtyYW5nZS5qb2luKCcsICcpfV1gO1xuXHRcdH0pLmpvaW4oJywgJyk7XG5cdH1cblxufVxuXG5mdW5jdGlvbiBwYWRTdHJpbmcoc3ViamVjdDogYW55LCBwYWRkaW5nOiBudW1iZXIpOiBzdHJpbmcge1xuXHRyZXR1cm4gKCcgJy5yZXBlYXQocGFkZGluZykgKyBzdWJqZWN0KS5zbGljZSgtcGFkZGluZyk7XG59XG4iXX0=