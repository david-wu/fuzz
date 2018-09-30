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
        return fuzzItem.query[index];
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kZW1vL2Z1enotZGVidWdnZXIuY2xhc3MudHMiXSwibmFtZXMiOlsiRnV6ekRlYnVnZ2VyIiwiZnV6ekl0ZW0iLCJxdWVyeSIsInN1YmplY3QiLCJlZGl0RGlzdGFuY2UiLCJkZWJ1Z0VkaXRNYXRyaXgiLCJkZWJ1Z09wZXJhdGlvbk1hdHJpeCIsIm1hdGNoTG9jYXRpb25zIiwiam9pbiIsIm1hcCIsImluZGV4IiwidGFibGVIZWFkZXIiLCJzcGxpdCIsImNoYXJhY3RlciIsInBhZFN0cmluZyIsInRhYmxlUm93cyIsImVkaXRNYXRyaXgiLCJyb3ciLCJyb3dJbmRleCIsInJvd1N0cmluZyIsImNlbGwiLCJvcGVyYXRpb25NYXRyaXgiLCJvcGVyYXRpb25TdHJpbmdCeU9wZXJhdGlvbiIsInBhZGRpbmciLCJyZXBlYXQiLCJzbGljZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFFYUEsWTs7Ozs7Ozs7O2tDQVNTQyxRLEVBQTRCO0FBQ2hELGFBQU8sQ0FDTiw2Q0FETSxtQkFFSUEsUUFBUSxDQUFDQyxLQUZiLHdCQUVnQ0QsUUFBUSxDQUFDRSxPQUZ6Qyw2QkFFbUVGLFFBQVEsQ0FBQ0csWUFGNUUsR0FHTixnQkFITSxFQUlOLEtBQUtDLGVBQUwsQ0FBcUJKLFFBQXJCLENBSk0sRUFLTixxQkFMTSxFQU1OLEtBQUtLLG9CQUFMLENBQTBCTCxRQUExQixDQU5NLEVBT04sb0JBUE0sRUFRTkEsUUFBUSxDQUFDTSxjQUFULENBQXdCQyxJQUF4QixDQUE2QixJQUE3QixDQVJNLEVBU04saUJBVE0sRUFVTlAsUUFBUSxDQUFDTSxjQUFULENBQXdCRSxHQUF4QixDQUE0QixVQUFDQyxLQUFEO0FBQUEsZUFBbUJULFFBQVEsQ0FBQ0MsS0FBVCxDQUFlUSxLQUFmLENBQW5CO0FBQUEsT0FBNUIsRUFBc0VGLElBQXRFLENBQTJFLEVBQTNFLENBVk0sRUFXTEEsSUFYSyxDQVdBLElBWEEsQ0FBUDtBQVlBOzs7b0NBRXNCUCxRLEVBQTRCO0FBQ2xELFVBQU1VLFdBQW1CLEdBQUdWLFFBQVEsQ0FBQ0UsT0FBVCxDQUFpQlMsS0FBakIsQ0FBdUIsRUFBdkIsRUFBMkJILEdBQTNCLENBQStCLFVBQUNJLFNBQUQ7QUFBQSxlQUF1QkMsU0FBUyxDQUFDRCxTQUFELEVBQVksQ0FBWixDQUFoQztBQUFBLE9BQS9CLEVBQStFTCxJQUEvRSxDQUFvRixFQUFwRixDQUE1QjtBQUNBLFVBQU1PLFNBQW1CLEdBQUdkLFFBQVEsQ0FBQ2UsVUFBVCxDQUFvQlAsR0FBcEIsQ0FBd0IsVUFBQ1EsR0FBRCxFQUFnQkMsUUFBaEIsRUFBcUM7QUFDeEYsWUFBTUMsU0FBUyxHQUFHRixHQUFHLENBQUNSLEdBQUosQ0FBUSxVQUFDVyxJQUFEO0FBQUEsaUJBQWtCTixTQUFTLENBQUNNLElBQUQsRUFBTyxDQUFQLENBQTNCO0FBQUEsU0FBUixFQUE4Q1osSUFBOUMsQ0FBbUQsRUFBbkQsQ0FBbEI7QUFDQSx5QkFBVVAsUUFBUSxDQUFDQyxLQUFULENBQWVnQixRQUFRLEdBQUcsQ0FBMUIsS0FBZ0MsR0FBMUMsY0FBaURDLFNBQWpEO0FBQ0EsT0FIMkIsQ0FBNUI7QUFJQSxhQUFPLG1CQUNLUixXQURMLDZCQUVISSxTQUZHLEdBR0xQLElBSEssQ0FHQSxJQUhBLENBQVA7QUFJQTs7O3lDQUUyQlAsUSxFQUE0QjtBQUN2RCxVQUFNVSxXQUFtQixHQUFHVixRQUFRLENBQUNFLE9BQVQsQ0FBaUJTLEtBQWpCLENBQXVCLEVBQXZCLEVBQTJCSCxHQUEzQixDQUErQixVQUFDSSxTQUFEO0FBQUEsZUFBdUJDLFNBQVMsQ0FBQ0QsU0FBRCxFQUFZLENBQVosQ0FBaEM7QUFBQSxPQUEvQixFQUErRUwsSUFBL0UsQ0FBb0YsRUFBcEYsQ0FBNUI7QUFDQSxVQUFNTyxTQUFtQixHQUFHZCxRQUFRLENBQUNvQixlQUFULENBQXlCWixHQUF6QixDQUE2QixVQUFDUSxHQUFELEVBQWdCQyxRQUFoQixFQUFxQztBQUM3RixZQUFNQyxTQUFTLEdBQUdGLEdBQUcsQ0FBQ1IsR0FBSixDQUFRLFVBQUNXLElBQUQ7QUFBQSxpQkFBa0JOLFNBQVMsQ0FBQ2QsWUFBWSxDQUFDc0IsMEJBQWIsQ0FBd0NGLElBQXhDLENBQUQsRUFBZ0QsQ0FBaEQsQ0FBM0I7QUFBQSxTQUFSLEVBQXVGWixJQUF2RixDQUE0RixFQUE1RixDQUFsQjtBQUNBLHlCQUFVUCxRQUFRLENBQUNDLEtBQVQsQ0FBZWdCLFFBQVEsR0FBRyxDQUExQixLQUFnQyxHQUExQyxjQUFpREMsU0FBakQ7QUFDQSxPQUgyQixDQUE1QjtBQUlBLGFBQU8sbUJBQ0tSLFdBREwsNkJBRUhJLFNBRkcsR0FHTFAsSUFISyxDQUdBLElBSEEsQ0FBUDtBQUlBOzs7Ozs7OztnQkE5Q1dSLFksZ0NBRXVFO0FBQ2xGLEtBQUcsS0FEK0U7QUFFbEYsS0FBRyxLQUYrRTtBQUdsRixLQUFHLEtBSCtFO0FBSWxGLEtBQUc7QUFKK0UsQzs7QUFnRHBGLFNBQVNjLFNBQVQsQ0FBbUJYLE9BQW5CLEVBQWlDb0IsT0FBakMsRUFBMEQ7QUFDekQsU0FBTyxDQUFDLElBQUlDLE1BQUosQ0FBV0QsT0FBWCxJQUFzQnBCLE9BQXZCLEVBQWdDc0IsS0FBaEMsQ0FBc0MsQ0FBQ0YsT0FBdkMsQ0FBUDtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRWRpdENvc3RzLCBGdXp6SXRlbSB9IGZyb20gJy4uL21vZGVscyc7XG5cbmV4cG9ydCBjbGFzcyBGdXp6RGVidWdnZXIge1xuXG5cdHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgb3BlcmF0aW9uU3RyaW5nQnlPcGVyYXRpb246IHtbb3BlcmF0aW9uOiBudW1iZXJdOiBzdHJpbmd9ID0ge1xuXHRcdDA6ICdkZWwnLFxuXHRcdDE6ICdpbnMnLFxuXHRcdDI6ICdzdWInLFxuXHRcdDM6ICdub3AnLFxuXHR9XG5cblx0cHVibGljIGRlYnVnRnV6ekl0ZW0oZnV6ekl0ZW06IEZ1enpJdGVtKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gW1xuXHRcdFx0J1xcbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxcbicsXG5cdFx0XHRgUXVlcnk6ICR7ZnV6ekl0ZW0ucXVlcnl9LCBzdWJqZWN0OiAke2Z1enpJdGVtLnN1YmplY3R9LCBlZGl0RGlzdGFuY2U6ICR7ZnV6ekl0ZW0uZWRpdERpc3RhbmNlfWAsXG5cdFx0XHQnXFxuRWRpdCBNYXRyaXg6Jyxcblx0XHRcdHRoaXMuZGVidWdFZGl0TWF0cml4KGZ1enpJdGVtKSxcblx0XHRcdCdcXG5PcGVyYXRpb24gTWF0cml4OicsXG5cdFx0XHR0aGlzLmRlYnVnT3BlcmF0aW9uTWF0cml4KGZ1enpJdGVtKSxcblx0XHRcdCdcXG5NYXRjaCBMb2NhdGlvbnM6Jyxcblx0XHRcdGZ1enpJdGVtLm1hdGNoTG9jYXRpb25zLmpvaW4oJywgJyksXG5cdFx0XHQnXFxuTWF0Y2ggU3RyaW5nOicsXG5cdFx0XHRmdXp6SXRlbS5tYXRjaExvY2F0aW9ucy5tYXAoKGluZGV4OiBudW1iZXIpID0+IGZ1enpJdGVtLnF1ZXJ5W2luZGV4XSkuam9pbignJyksXG5cdFx0XS5qb2luKCdcXG4nKVxuXHR9XG5cblx0cHVibGljIGRlYnVnRWRpdE1hdHJpeChmdXp6SXRlbTogRnV6ekl0ZW0pOiBzdHJpbmcge1xuXHRcdGNvbnN0IHRhYmxlSGVhZGVyOiBzdHJpbmcgPSBmdXp6SXRlbS5zdWJqZWN0LnNwbGl0KCcnKS5tYXAoKGNoYXJhY3Rlcjogc3RyaW5nKSA9PiBwYWRTdHJpbmcoY2hhcmFjdGVyLCA2KSkuam9pbignJyk7XG5cdFx0Y29uc3QgdGFibGVSb3dzOiBzdHJpbmdbXSA9IGZ1enpJdGVtLmVkaXRNYXRyaXgubWFwKChyb3c6IG51bWJlcltdLCByb3dJbmRleDogbnVtYmVyKSA9PiB7XG5cdFx0XHRjb25zdCByb3dTdHJpbmcgPSByb3cubWFwKChjZWxsOiBudW1iZXIpID0+IHBhZFN0cmluZyhjZWxsLCA2KSkuam9pbignJyk7XG5cdFx0XHRyZXR1cm4gYCR7ZnV6ekl0ZW0ucXVlcnlbcm93SW5kZXggLSAxXSB8fCAnICd9ICR7cm93U3RyaW5nfWA7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIFtcblx0XHRcdGAgICAgICAgICR7dGFibGVIZWFkZXJ9YCxcblx0XHRcdC4uLnRhYmxlUm93cyxcblx0XHRdLmpvaW4oJ1xcbicpXG5cdH1cblxuXHRwdWJsaWMgZGVidWdPcGVyYXRpb25NYXRyaXgoZnV6ekl0ZW06IEZ1enpJdGVtKTogc3RyaW5nIHtcblx0XHRjb25zdCB0YWJsZUhlYWRlcjogc3RyaW5nID0gZnV6ekl0ZW0uc3ViamVjdC5zcGxpdCgnJykubWFwKChjaGFyYWN0ZXI6IHN0cmluZykgPT4gcGFkU3RyaW5nKGNoYXJhY3RlciwgNikpLmpvaW4oJycpO1xuXHRcdGNvbnN0IHRhYmxlUm93czogc3RyaW5nW10gPSBmdXp6SXRlbS5vcGVyYXRpb25NYXRyaXgubWFwKChyb3c6IG51bWJlcltdLCByb3dJbmRleDogbnVtYmVyKSA9PiB7XG5cdFx0XHRjb25zdCByb3dTdHJpbmcgPSByb3cubWFwKChjZWxsOiBudW1iZXIpID0+IHBhZFN0cmluZyhGdXp6RGVidWdnZXIub3BlcmF0aW9uU3RyaW5nQnlPcGVyYXRpb25bY2VsbF0sIDYpKS5qb2luKCcnKTtcblx0XHRcdHJldHVybiBgJHtmdXp6SXRlbS5xdWVyeVtyb3dJbmRleCAtIDFdIHx8ICcgJ30gJHtyb3dTdHJpbmd9YDtcblx0XHR9KTtcblx0XHRyZXR1cm4gW1xuXHRcdFx0YCAgICAgICAgJHt0YWJsZUhlYWRlcn1gLFxuXHRcdFx0Li4udGFibGVSb3dzLFxuXHRcdF0uam9pbignXFxuJylcblx0fVxuXG59XG5cbmZ1bmN0aW9uIHBhZFN0cmluZyhzdWJqZWN0OiBhbnksIHBhZGRpbmc6IG51bWJlcik6IHN0cmluZyB7XG5cdHJldHVybiAoJyAnLnJlcGVhdChwYWRkaW5nKSArIHN1YmplY3QpLnNsaWNlKC1wYWRkaW5nKTtcbn1cbiJdfQ==