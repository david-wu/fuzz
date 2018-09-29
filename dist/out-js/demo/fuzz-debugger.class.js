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

var FuzzDebugger =
/*#__PURE__*/
function () {
  function FuzzDebugger() {
    _classCallCheck(this, FuzzDebugger);
  }

  _createClass(FuzzDebugger, [{
    key: "debugFuzzItem",
    value: function debugFuzzItem(fuzzItem) {
      var tableHeader = fuzzItem.subject.split('').map(function (character) {
        return padString(character, 6);
      }).join('');
      var tableRows = fuzzItem.editMatrix.map(function (row, rowIndex) {
        var rowString = row.map(function (cell) {
          return padString(cell, 6);
        }).join('');
        return "".concat(fuzzItem.query[rowIndex - 1] || ' ', " ").concat(rowString);
      });
      return ["\nquery: ".concat(fuzzItem.query, ", subject: ").concat(fuzzItem.subject, ", editDistance: ").concat(fuzzItem.editDistance), "        ".concat(tableHeader)].concat(_toConsumableArray(tableRows)).join('\n');
    }
  }]);

  return FuzzDebugger;
}();

exports.FuzzDebugger = FuzzDebugger;

function padString(subject, padding) {
  return (' '.repeat(padding) + subject).slice(-padding);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kZW1vL2Z1enotZGVidWdnZXIuY2xhc3MudHMiXSwibmFtZXMiOlsiRnV6ekRlYnVnZ2VyIiwiZnV6ekl0ZW0iLCJ0YWJsZUhlYWRlciIsInN1YmplY3QiLCJzcGxpdCIsIm1hcCIsImNoYXJhY3RlciIsInBhZFN0cmluZyIsImpvaW4iLCJ0YWJsZVJvd3MiLCJlZGl0TWF0cml4Iiwicm93Iiwicm93SW5kZXgiLCJyb3dTdHJpbmciLCJjZWxsIiwicXVlcnkiLCJlZGl0RGlzdGFuY2UiLCJwYWRkaW5nIiwicmVwZWF0Iiwic2xpY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQUVhQSxZOzs7Ozs7Ozs7a0NBRVNDLFEsRUFBNEI7QUFDaEQsVUFBTUMsV0FBbUIsR0FBR0QsUUFBUSxDQUFDRSxPQUFULENBQWlCQyxLQUFqQixDQUF1QixFQUF2QixFQUEyQkMsR0FBM0IsQ0FBK0IsVUFBQ0MsU0FBRDtBQUFBLGVBQXVCQyxTQUFTLENBQUNELFNBQUQsRUFBWSxDQUFaLENBQWhDO0FBQUEsT0FBL0IsRUFBK0VFLElBQS9FLENBQW9GLEVBQXBGLENBQTVCO0FBQ0EsVUFBTUMsU0FBbUIsR0FBR1IsUUFBUSxDQUFDUyxVQUFULENBQW9CTCxHQUFwQixDQUF3QixVQUFDTSxHQUFELEVBQWdCQyxRQUFoQixFQUFxQztBQUN4RixZQUFNQyxTQUFTLEdBQUdGLEdBQUcsQ0FBQ04sR0FBSixDQUFRLFVBQUNTLElBQUQ7QUFBQSxpQkFBa0JQLFNBQVMsQ0FBQ08sSUFBRCxFQUFPLENBQVAsQ0FBM0I7QUFBQSxTQUFSLEVBQThDTixJQUE5QyxDQUFtRCxFQUFuRCxDQUFsQjtBQUNBLHlCQUFVUCxRQUFRLENBQUNjLEtBQVQsQ0FBZUgsUUFBUSxHQUFHLENBQTFCLEtBQWdDLEdBQTFDLGNBQWlEQyxTQUFqRDtBQUNBLE9BSDJCLENBQTVCO0FBSUEsYUFBTyxvQkFDTVosUUFBUSxDQUFDYyxLQURmLHdCQUNrQ2QsUUFBUSxDQUFDRSxPQUQzQyw2QkFDcUVGLFFBQVEsQ0FBQ2UsWUFEOUUscUJBRUtkLFdBRkwsNkJBR0hPLFNBSEcsR0FJTEQsSUFKSyxDQUlBLElBSkEsQ0FBUDtBQUtBOzs7Ozs7OztBQUlGLFNBQVNELFNBQVQsQ0FBbUJKLE9BQW5CLEVBQWlDYyxPQUFqQyxFQUEwRDtBQUN6RCxTQUFPLENBQUMsSUFBSUMsTUFBSixDQUFXRCxPQUFYLElBQXNCZCxPQUF2QixFQUFnQ2dCLEtBQWhDLENBQXNDLENBQUNGLE9BQXZDLENBQVA7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEVkaXRDb3N0cywgRnV6ekl0ZW0gfSBmcm9tICcuLi9tb2RlbHMnO1xuXG5leHBvcnQgY2xhc3MgRnV6ekRlYnVnZ2VyIHtcblxuXHRwdWJsaWMgZGVidWdGdXp6SXRlbShmdXp6SXRlbTogRnV6ekl0ZW0pOiBzdHJpbmcge1xuXHRcdGNvbnN0IHRhYmxlSGVhZGVyOiBzdHJpbmcgPSBmdXp6SXRlbS5zdWJqZWN0LnNwbGl0KCcnKS5tYXAoKGNoYXJhY3Rlcjogc3RyaW5nKSA9PiBwYWRTdHJpbmcoY2hhcmFjdGVyLCA2KSkuam9pbignJyk7XG5cdFx0Y29uc3QgdGFibGVSb3dzOiBzdHJpbmdbXSA9IGZ1enpJdGVtLmVkaXRNYXRyaXgubWFwKChyb3c6IG51bWJlcltdLCByb3dJbmRleDogbnVtYmVyKSA9PiB7XG5cdFx0XHRjb25zdCByb3dTdHJpbmcgPSByb3cubWFwKChjZWxsOiBudW1iZXIpID0+IHBhZFN0cmluZyhjZWxsLCA2KSkuam9pbignJyk7XG5cdFx0XHRyZXR1cm4gYCR7ZnV6ekl0ZW0ucXVlcnlbcm93SW5kZXggLSAxXSB8fCAnICd9ICR7cm93U3RyaW5nfWA7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIFtcblx0XHRcdGBcXG5xdWVyeTogJHtmdXp6SXRlbS5xdWVyeX0sIHN1YmplY3Q6ICR7ZnV6ekl0ZW0uc3ViamVjdH0sIGVkaXREaXN0YW5jZTogJHtmdXp6SXRlbS5lZGl0RGlzdGFuY2V9YCxcblx0XHRcdGAgICAgICAgICR7dGFibGVIZWFkZXJ9YCxcblx0XHRcdC4uLnRhYmxlUm93cyxcblx0XHRdLmpvaW4oJ1xcbicpXG5cdH1cblxufVxuXG5mdW5jdGlvbiBwYWRTdHJpbmcoc3ViamVjdDogYW55LCBwYWRkaW5nOiBudW1iZXIpOiBzdHJpbmcge1xuXHRyZXR1cm4gKCcgJy5yZXBlYXQocGFkZGluZykgKyBzdWJqZWN0KS5zbGljZSgtcGFkZGluZyk7XG59XG4iXX0=