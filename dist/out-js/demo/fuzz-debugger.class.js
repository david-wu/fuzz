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
      return ['\n=======================================\n', "Query: ".concat(fuzzItem.query, ", subject: ").concat(fuzzItem.subject, ", editDistance: ").concat(fuzzItem.editDistance), '\nEdit Matrix:', this.debugEditMatrix(fuzzItem), '\nOperation Matrix:', this.debugOperationMatrix(fuzzItem), '\nMatch Locations:', _toConsumableArray(fuzzItem.subjectMatchIndexSet).join(', '), '\nMatch String:', _toConsumableArray(fuzzItem.subjectMatchIndexSet).map(function (index) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kZW1vL2Z1enotZGVidWdnZXIuY2xhc3MudHMiXSwibmFtZXMiOlsiRnV6ekRlYnVnZ2VyIiwiZnV6ekl0ZW0iLCJxdWVyeSIsInN1YmplY3QiLCJlZGl0RGlzdGFuY2UiLCJkZWJ1Z0VkaXRNYXRyaXgiLCJkZWJ1Z09wZXJhdGlvbk1hdHJpeCIsInN1YmplY3RNYXRjaEluZGV4U2V0Iiwiam9pbiIsIm1hcCIsImluZGV4IiwidGFibGVIZWFkZXIiLCJzcGxpdCIsImNoYXJhY3RlciIsInBhZFN0cmluZyIsInRhYmxlUm93cyIsImVkaXRNYXRyaXgiLCJyb3ciLCJyb3dJbmRleCIsInJvd1N0cmluZyIsImNlbGwiLCJvcGVyYXRpb25NYXRyaXgiLCJvcGVyYXRpb25TdHJpbmdCeU9wZXJhdGlvbiIsInBhZGRpbmciLCJyZXBlYXQiLCJzbGljZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFFYUEsWTs7Ozs7Ozs7O2tDQVNTQyxRLEVBQTRCO0FBQ2hELGFBQU8sQ0FDTiw2Q0FETSxtQkFFSUEsUUFBUSxDQUFDQyxLQUZiLHdCQUVnQ0QsUUFBUSxDQUFDRSxPQUZ6Qyw2QkFFbUVGLFFBQVEsQ0FBQ0csWUFGNUUsR0FHTixnQkFITSxFQUlOLEtBQUtDLGVBQUwsQ0FBcUJKLFFBQXJCLENBSk0sRUFLTixxQkFMTSxFQU1OLEtBQUtLLG9CQUFMLENBQTBCTCxRQUExQixDQU5NLEVBT04sb0JBUE0sRUFRTixtQkFBSUEsUUFBUSxDQUFDTSxvQkFBYixFQUFtQ0MsSUFBbkMsQ0FBd0MsSUFBeEMsQ0FSTSxFQVNOLGlCQVRNLEVBVU4sbUJBQUlQLFFBQVEsQ0FBQ00sb0JBQWIsRUFBbUNFLEdBQW5DLENBQXVDLFVBQUNDLEtBQUQ7QUFBQSxlQUFtQlQsUUFBUSxDQUFDRSxPQUFULENBQWlCTyxLQUFqQixDQUFuQjtBQUFBLE9BQXZDLEVBQW1GRixJQUFuRixDQUF3RixFQUF4RixDQVZNLEVBV0xBLElBWEssQ0FXQSxJQVhBLENBQVA7QUFZQTs7O29DQUVzQlAsUSxFQUE0QjtBQUNsRCxVQUFNVSxXQUFtQixHQUFHVixRQUFRLENBQUNFLE9BQVQsQ0FBaUJTLEtBQWpCLENBQXVCLEVBQXZCLEVBQTJCSCxHQUEzQixDQUErQixVQUFDSSxTQUFEO0FBQUEsZUFBdUJDLFNBQVMsQ0FBQ0QsU0FBRCxFQUFZLENBQVosQ0FBaEM7QUFBQSxPQUEvQixFQUErRUwsSUFBL0UsQ0FBb0YsRUFBcEYsQ0FBNUI7QUFDQSxVQUFNTyxTQUFtQixHQUFHZCxRQUFRLENBQUNlLFVBQVQsQ0FBb0JQLEdBQXBCLENBQXdCLFVBQUNRLEdBQUQsRUFBZ0JDLFFBQWhCLEVBQXFDO0FBQ3hGLFlBQU1DLFNBQVMsR0FBR0YsR0FBRyxDQUFDUixHQUFKLENBQVEsVUFBQ1csSUFBRDtBQUFBLGlCQUFrQk4sU0FBUyxDQUFDTSxJQUFELEVBQU8sQ0FBUCxDQUEzQjtBQUFBLFNBQVIsRUFBOENaLElBQTlDLENBQW1ELEVBQW5ELENBQWxCO0FBQ0EseUJBQVVQLFFBQVEsQ0FBQ0MsS0FBVCxDQUFlZ0IsUUFBUSxHQUFHLENBQTFCLEtBQWdDLEdBQTFDLGNBQWlEQyxTQUFqRDtBQUNBLE9BSDJCLENBQTVCO0FBSUEsYUFBTyxtQkFDS1IsV0FETCw2QkFFSEksU0FGRyxHQUdMUCxJQUhLLENBR0EsSUFIQSxDQUFQO0FBSUE7Ozt5Q0FFMkJQLFEsRUFBNEI7QUFDdkQsVUFBTVUsV0FBbUIsR0FBR1YsUUFBUSxDQUFDRSxPQUFULENBQWlCUyxLQUFqQixDQUF1QixFQUF2QixFQUEyQkgsR0FBM0IsQ0FBK0IsVUFBQ0ksU0FBRDtBQUFBLGVBQXVCQyxTQUFTLENBQUNELFNBQUQsRUFBWSxDQUFaLENBQWhDO0FBQUEsT0FBL0IsRUFBK0VMLElBQS9FLENBQW9GLEVBQXBGLENBQTVCO0FBQ0EsVUFBTU8sU0FBbUIsR0FBR2QsUUFBUSxDQUFDb0IsZUFBVCxDQUF5QlosR0FBekIsQ0FBNkIsVUFBQ1EsR0FBRCxFQUFnQkMsUUFBaEIsRUFBcUM7QUFDN0YsWUFBTUMsU0FBUyxHQUFHRixHQUFHLENBQUNSLEdBQUosQ0FBUSxVQUFDVyxJQUFEO0FBQUEsaUJBQWtCTixTQUFTLENBQUNkLFlBQVksQ0FBQ3NCLDBCQUFiLENBQXdDRixJQUF4QyxDQUFELEVBQWdELENBQWhELENBQTNCO0FBQUEsU0FBUixFQUF1RlosSUFBdkYsQ0FBNEYsRUFBNUYsQ0FBbEI7QUFDQSx5QkFBVVAsUUFBUSxDQUFDQyxLQUFULENBQWVnQixRQUFRLEdBQUcsQ0FBMUIsS0FBZ0MsR0FBMUMsY0FBaURDLFNBQWpEO0FBQ0EsT0FIMkIsQ0FBNUI7QUFJQSxhQUFPLG1CQUNLUixXQURMLDZCQUVISSxTQUZHLEdBR0xQLElBSEssQ0FHQSxJQUhBLENBQVA7QUFJQTs7Ozs7Ozs7Z0JBOUNXUixZLGdDQUV1RTtBQUNsRixLQUFHLEtBRCtFO0FBRWxGLEtBQUcsS0FGK0U7QUFHbEYsS0FBRyxLQUgrRTtBQUlsRixLQUFHO0FBSitFLEM7O0FBZ0RwRixTQUFTYyxTQUFULENBQW1CWCxPQUFuQixFQUFpQ29CLE9BQWpDLEVBQTBEO0FBQ3pELFNBQU8sQ0FBQyxJQUFJQyxNQUFKLENBQVdELE9BQVgsSUFBc0JwQixPQUF2QixFQUFnQ3NCLEtBQWhDLENBQXNDLENBQUNGLE9BQXZDLENBQVA7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEVkaXRDb3N0cywgRnV6ekl0ZW0gfSBmcm9tICcuLi9tb2RlbHMnO1xuXG5leHBvcnQgY2xhc3MgRnV6ekRlYnVnZ2VyIHtcblxuXHRwdWJsaWMgc3RhdGljIHJlYWRvbmx5IG9wZXJhdGlvblN0cmluZ0J5T3BlcmF0aW9uOiB7W29wZXJhdGlvbjogbnVtYmVyXTogc3RyaW5nfSA9IHtcblx0XHQwOiAnZGVsJyxcblx0XHQxOiAnaW5zJyxcblx0XHQyOiAnc3ViJyxcblx0XHQzOiAnbm9wJyxcblx0fVxuXG5cdHB1YmxpYyBkZWJ1Z0Z1enpJdGVtKGZ1enpJdGVtOiBGdXp6SXRlbSk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIFtcblx0XHRcdCdcXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cXG4nLFxuXHRcdFx0YFF1ZXJ5OiAke2Z1enpJdGVtLnF1ZXJ5fSwgc3ViamVjdDogJHtmdXp6SXRlbS5zdWJqZWN0fSwgZWRpdERpc3RhbmNlOiAke2Z1enpJdGVtLmVkaXREaXN0YW5jZX1gLFxuXHRcdFx0J1xcbkVkaXQgTWF0cml4OicsXG5cdFx0XHR0aGlzLmRlYnVnRWRpdE1hdHJpeChmdXp6SXRlbSksXG5cdFx0XHQnXFxuT3BlcmF0aW9uIE1hdHJpeDonLFxuXHRcdFx0dGhpcy5kZWJ1Z09wZXJhdGlvbk1hdHJpeChmdXp6SXRlbSksXG5cdFx0XHQnXFxuTWF0Y2ggTG9jYXRpb25zOicsXG5cdFx0XHRbLi4uZnV6ekl0ZW0uc3ViamVjdE1hdGNoSW5kZXhTZXRdLmpvaW4oJywgJyksXG5cdFx0XHQnXFxuTWF0Y2ggU3RyaW5nOicsXG5cdFx0XHRbLi4uZnV6ekl0ZW0uc3ViamVjdE1hdGNoSW5kZXhTZXRdLm1hcCgoaW5kZXg6IG51bWJlcikgPT4gZnV6ekl0ZW0uc3ViamVjdFtpbmRleF0pLmpvaW4oJycpLFxuXHRcdF0uam9pbignXFxuJylcblx0fVxuXG5cdHB1YmxpYyBkZWJ1Z0VkaXRNYXRyaXgoZnV6ekl0ZW06IEZ1enpJdGVtKTogc3RyaW5nIHtcblx0XHRjb25zdCB0YWJsZUhlYWRlcjogc3RyaW5nID0gZnV6ekl0ZW0uc3ViamVjdC5zcGxpdCgnJykubWFwKChjaGFyYWN0ZXI6IHN0cmluZykgPT4gcGFkU3RyaW5nKGNoYXJhY3RlciwgNikpLmpvaW4oJycpO1xuXHRcdGNvbnN0IHRhYmxlUm93czogc3RyaW5nW10gPSBmdXp6SXRlbS5lZGl0TWF0cml4Lm1hcCgocm93OiBudW1iZXJbXSwgcm93SW5kZXg6IG51bWJlcikgPT4ge1xuXHRcdFx0Y29uc3Qgcm93U3RyaW5nID0gcm93Lm1hcCgoY2VsbDogbnVtYmVyKSA9PiBwYWRTdHJpbmcoY2VsbCwgNikpLmpvaW4oJycpO1xuXHRcdFx0cmV0dXJuIGAke2Z1enpJdGVtLnF1ZXJ5W3Jvd0luZGV4IC0gMV0gfHwgJyAnfSAke3Jvd1N0cmluZ31gO1xuXHRcdH0pO1xuXHRcdHJldHVybiBbXG5cdFx0XHRgICAgICAgICAke3RhYmxlSGVhZGVyfWAsXG5cdFx0XHQuLi50YWJsZVJvd3MsXG5cdFx0XS5qb2luKCdcXG4nKVxuXHR9XG5cblx0cHVibGljIGRlYnVnT3BlcmF0aW9uTWF0cml4KGZ1enpJdGVtOiBGdXp6SXRlbSk6IHN0cmluZyB7XG5cdFx0Y29uc3QgdGFibGVIZWFkZXI6IHN0cmluZyA9IGZ1enpJdGVtLnN1YmplY3Quc3BsaXQoJycpLm1hcCgoY2hhcmFjdGVyOiBzdHJpbmcpID0+IHBhZFN0cmluZyhjaGFyYWN0ZXIsIDYpKS5qb2luKCcnKTtcblx0XHRjb25zdCB0YWJsZVJvd3M6IHN0cmluZ1tdID0gZnV6ekl0ZW0ub3BlcmF0aW9uTWF0cml4Lm1hcCgocm93OiBudW1iZXJbXSwgcm93SW5kZXg6IG51bWJlcikgPT4ge1xuXHRcdFx0Y29uc3Qgcm93U3RyaW5nID0gcm93Lm1hcCgoY2VsbDogbnVtYmVyKSA9PiBwYWRTdHJpbmcoRnV6ekRlYnVnZ2VyLm9wZXJhdGlvblN0cmluZ0J5T3BlcmF0aW9uW2NlbGxdLCA2KSkuam9pbignJyk7XG5cdFx0XHRyZXR1cm4gYCR7ZnV6ekl0ZW0ucXVlcnlbcm93SW5kZXggLSAxXSB8fCAnICd9ICR7cm93U3RyaW5nfWA7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIFtcblx0XHRcdGAgICAgICAgICR7dGFibGVIZWFkZXJ9YCxcblx0XHRcdC4uLnRhYmxlUm93cyxcblx0XHRdLmpvaW4oJ1xcbicpXG5cdH1cblxufVxuXG5mdW5jdGlvbiBwYWRTdHJpbmcoc3ViamVjdDogYW55LCBwYWRkaW5nOiBudW1iZXIpOiBzdHJpbmcge1xuXHRyZXR1cm4gKCcgJy5yZXBlYXQocGFkZGluZykgKyBzdWJqZWN0KS5zbGljZSgtcGFkZGluZyk7XG59XG4iXX0=