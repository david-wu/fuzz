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
      return ["\nQuery: ".concat(fuzzItem.query, ", subject: ").concat(fuzzItem.subject, ", editDistance: ").concat(fuzzItem.editDistance), 'Edit Matrix:', this.debugEditMatrix(fuzzItem), 'Operation Matrix:', this.debugOperationMatrix(fuzzItem), 'Match Locations:', fuzzItem.matchLocations].join('\n');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kZW1vL2Z1enotZGVidWdnZXIuY2xhc3MudHMiXSwibmFtZXMiOlsiRnV6ekRlYnVnZ2VyIiwiZnV6ekl0ZW0iLCJxdWVyeSIsInN1YmplY3QiLCJlZGl0RGlzdGFuY2UiLCJkZWJ1Z0VkaXRNYXRyaXgiLCJkZWJ1Z09wZXJhdGlvbk1hdHJpeCIsIm1hdGNoTG9jYXRpb25zIiwiam9pbiIsInRhYmxlSGVhZGVyIiwic3BsaXQiLCJtYXAiLCJjaGFyYWN0ZXIiLCJwYWRTdHJpbmciLCJ0YWJsZVJvd3MiLCJlZGl0TWF0cml4Iiwicm93Iiwicm93SW5kZXgiLCJyb3dTdHJpbmciLCJjZWxsIiwib3BlcmF0aW9uTWF0cml4Iiwib3BlcmF0aW9uU3RyaW5nQnlPcGVyYXRpb24iLCJwYWRkaW5nIiwicmVwZWF0Iiwic2xpY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBRWFBLFk7Ozs7Ozs7OztrQ0FTU0MsUSxFQUE0QjtBQUNoRCxhQUFPLG9CQUNNQSxRQUFRLENBQUNDLEtBRGYsd0JBQ2tDRCxRQUFRLENBQUNFLE9BRDNDLDZCQUNxRUYsUUFBUSxDQUFDRyxZQUQ5RSxHQUVOLGNBRk0sRUFHTixLQUFLQyxlQUFMLENBQXFCSixRQUFyQixDQUhNLEVBSU4sbUJBSk0sRUFLTixLQUFLSyxvQkFBTCxDQUEwQkwsUUFBMUIsQ0FMTSxFQU1OLGtCQU5NLEVBT05BLFFBQVEsQ0FBQ00sY0FQSCxFQVFMQyxJQVJLLENBUUEsSUFSQSxDQUFQO0FBU0E7OztvQ0FFc0JQLFEsRUFBNEI7QUFDbEQsVUFBTVEsV0FBbUIsR0FBR1IsUUFBUSxDQUFDRSxPQUFULENBQWlCTyxLQUFqQixDQUF1QixFQUF2QixFQUEyQkMsR0FBM0IsQ0FBK0IsVUFBQ0MsU0FBRDtBQUFBLGVBQXVCQyxTQUFTLENBQUNELFNBQUQsRUFBWSxDQUFaLENBQWhDO0FBQUEsT0FBL0IsRUFBK0VKLElBQS9FLENBQW9GLEVBQXBGLENBQTVCO0FBQ0EsVUFBTU0sU0FBbUIsR0FBR2IsUUFBUSxDQUFDYyxVQUFULENBQW9CSixHQUFwQixDQUF3QixVQUFDSyxHQUFELEVBQWdCQyxRQUFoQixFQUFxQztBQUN4RixZQUFNQyxTQUFTLEdBQUdGLEdBQUcsQ0FBQ0wsR0FBSixDQUFRLFVBQUNRLElBQUQ7QUFBQSxpQkFBa0JOLFNBQVMsQ0FBQ00sSUFBRCxFQUFPLENBQVAsQ0FBM0I7QUFBQSxTQUFSLEVBQThDWCxJQUE5QyxDQUFtRCxFQUFuRCxDQUFsQjtBQUNBLHlCQUFVUCxRQUFRLENBQUNDLEtBQVQsQ0FBZWUsUUFBUSxHQUFHLENBQTFCLEtBQWdDLEdBQTFDLGNBQWlEQyxTQUFqRDtBQUNBLE9BSDJCLENBQTVCO0FBSUEsYUFBTyxtQkFDS1QsV0FETCw2QkFFSEssU0FGRyxHQUdMTixJQUhLLENBR0EsSUFIQSxDQUFQO0FBSUE7Ozt5Q0FFMkJQLFEsRUFBNEI7QUFDdkQsVUFBTVEsV0FBbUIsR0FBR1IsUUFBUSxDQUFDRSxPQUFULENBQWlCTyxLQUFqQixDQUF1QixFQUF2QixFQUEyQkMsR0FBM0IsQ0FBK0IsVUFBQ0MsU0FBRDtBQUFBLGVBQXVCQyxTQUFTLENBQUNELFNBQUQsRUFBWSxDQUFaLENBQWhDO0FBQUEsT0FBL0IsRUFBK0VKLElBQS9FLENBQW9GLEVBQXBGLENBQTVCO0FBQ0EsVUFBTU0sU0FBbUIsR0FBR2IsUUFBUSxDQUFDbUIsZUFBVCxDQUF5QlQsR0FBekIsQ0FBNkIsVUFBQ0ssR0FBRCxFQUFnQkMsUUFBaEIsRUFBcUM7QUFDN0YsWUFBTUMsU0FBUyxHQUFHRixHQUFHLENBQUNMLEdBQUosQ0FBUSxVQUFDUSxJQUFEO0FBQUEsaUJBQWtCTixTQUFTLENBQUNiLFlBQVksQ0FBQ3FCLDBCQUFiLENBQXdDRixJQUF4QyxDQUFELEVBQWdELENBQWhELENBQTNCO0FBQUEsU0FBUixFQUF1RlgsSUFBdkYsQ0FBNEYsRUFBNUYsQ0FBbEI7QUFDQSx5QkFBVVAsUUFBUSxDQUFDQyxLQUFULENBQWVlLFFBQVEsR0FBRyxDQUExQixLQUFnQyxHQUExQyxjQUFpREMsU0FBakQ7QUFDQSxPQUgyQixDQUE1QjtBQUlBLGFBQU8sbUJBQ0tULFdBREwsNkJBRUhLLFNBRkcsR0FHTE4sSUFISyxDQUdBLElBSEEsQ0FBUDtBQUlBOzs7Ozs7OztnQkEzQ1dSLFksZ0NBRXVFO0FBQ2xGLEtBQUcsS0FEK0U7QUFFbEYsS0FBRyxLQUYrRTtBQUdsRixLQUFHLEtBSCtFO0FBSWxGLEtBQUc7QUFKK0UsQzs7QUE2Q3BGLFNBQVNhLFNBQVQsQ0FBbUJWLE9BQW5CLEVBQWlDbUIsT0FBakMsRUFBMEQ7QUFDekQsU0FBTyxDQUFDLElBQUlDLE1BQUosQ0FBV0QsT0FBWCxJQUFzQm5CLE9BQXZCLEVBQWdDcUIsS0FBaEMsQ0FBc0MsQ0FBQ0YsT0FBdkMsQ0FBUDtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRWRpdENvc3RzLCBGdXp6SXRlbSB9IGZyb20gJy4uL21vZGVscyc7XG5cbmV4cG9ydCBjbGFzcyBGdXp6RGVidWdnZXIge1xuXG5cdHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgb3BlcmF0aW9uU3RyaW5nQnlPcGVyYXRpb246IHtbb3BlcmF0aW9uOiBudW1iZXJdOiBzdHJpbmd9ID0ge1xuXHRcdDA6ICdkZWwnLFxuXHRcdDE6ICdpbnMnLFxuXHRcdDI6ICdzdWInLFxuXHRcdDM6ICdub3AnLFxuXHR9XG5cblx0cHVibGljIGRlYnVnRnV6ekl0ZW0oZnV6ekl0ZW06IEZ1enpJdGVtKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gW1xuXHRcdFx0YFxcblF1ZXJ5OiAke2Z1enpJdGVtLnF1ZXJ5fSwgc3ViamVjdDogJHtmdXp6SXRlbS5zdWJqZWN0fSwgZWRpdERpc3RhbmNlOiAke2Z1enpJdGVtLmVkaXREaXN0YW5jZX1gLFxuXHRcdFx0J0VkaXQgTWF0cml4OicsXG5cdFx0XHR0aGlzLmRlYnVnRWRpdE1hdHJpeChmdXp6SXRlbSksXG5cdFx0XHQnT3BlcmF0aW9uIE1hdHJpeDonLFxuXHRcdFx0dGhpcy5kZWJ1Z09wZXJhdGlvbk1hdHJpeChmdXp6SXRlbSksXG5cdFx0XHQnTWF0Y2ggTG9jYXRpb25zOicsXG5cdFx0XHRmdXp6SXRlbS5tYXRjaExvY2F0aW9ucyxcblx0XHRdLmpvaW4oJ1xcbicpXG5cdH1cblxuXHRwdWJsaWMgZGVidWdFZGl0TWF0cml4KGZ1enpJdGVtOiBGdXp6SXRlbSk6IHN0cmluZyB7XG5cdFx0Y29uc3QgdGFibGVIZWFkZXI6IHN0cmluZyA9IGZ1enpJdGVtLnN1YmplY3Quc3BsaXQoJycpLm1hcCgoY2hhcmFjdGVyOiBzdHJpbmcpID0+IHBhZFN0cmluZyhjaGFyYWN0ZXIsIDYpKS5qb2luKCcnKTtcblx0XHRjb25zdCB0YWJsZVJvd3M6IHN0cmluZ1tdID0gZnV6ekl0ZW0uZWRpdE1hdHJpeC5tYXAoKHJvdzogbnVtYmVyW10sIHJvd0luZGV4OiBudW1iZXIpID0+IHtcblx0XHRcdGNvbnN0IHJvd1N0cmluZyA9IHJvdy5tYXAoKGNlbGw6IG51bWJlcikgPT4gcGFkU3RyaW5nKGNlbGwsIDYpKS5qb2luKCcnKTtcblx0XHRcdHJldHVybiBgJHtmdXp6SXRlbS5xdWVyeVtyb3dJbmRleCAtIDFdIHx8ICcgJ30gJHtyb3dTdHJpbmd9YDtcblx0XHR9KTtcblx0XHRyZXR1cm4gW1xuXHRcdFx0YCAgICAgICAgJHt0YWJsZUhlYWRlcn1gLFxuXHRcdFx0Li4udGFibGVSb3dzLFxuXHRcdF0uam9pbignXFxuJylcblx0fVxuXG5cdHB1YmxpYyBkZWJ1Z09wZXJhdGlvbk1hdHJpeChmdXp6SXRlbTogRnV6ekl0ZW0pOiBzdHJpbmcge1xuXHRcdGNvbnN0IHRhYmxlSGVhZGVyOiBzdHJpbmcgPSBmdXp6SXRlbS5zdWJqZWN0LnNwbGl0KCcnKS5tYXAoKGNoYXJhY3Rlcjogc3RyaW5nKSA9PiBwYWRTdHJpbmcoY2hhcmFjdGVyLCA2KSkuam9pbignJyk7XG5cdFx0Y29uc3QgdGFibGVSb3dzOiBzdHJpbmdbXSA9IGZ1enpJdGVtLm9wZXJhdGlvbk1hdHJpeC5tYXAoKHJvdzogbnVtYmVyW10sIHJvd0luZGV4OiBudW1iZXIpID0+IHtcblx0XHRcdGNvbnN0IHJvd1N0cmluZyA9IHJvdy5tYXAoKGNlbGw6IG51bWJlcikgPT4gcGFkU3RyaW5nKEZ1enpEZWJ1Z2dlci5vcGVyYXRpb25TdHJpbmdCeU9wZXJhdGlvbltjZWxsXSwgNikpLmpvaW4oJycpO1xuXHRcdFx0cmV0dXJuIGAke2Z1enpJdGVtLnF1ZXJ5W3Jvd0luZGV4IC0gMV0gfHwgJyAnfSAke3Jvd1N0cmluZ31gO1xuXHRcdH0pO1xuXHRcdHJldHVybiBbXG5cdFx0XHRgICAgICAgICAke3RhYmxlSGVhZGVyfWAsXG5cdFx0XHQuLi50YWJsZVJvd3MsXG5cdFx0XS5qb2luKCdcXG4nKVxuXHR9XG5cbn1cblxuZnVuY3Rpb24gcGFkU3RyaW5nKHN1YmplY3Q6IGFueSwgcGFkZGluZzogbnVtYmVyKTogc3RyaW5nIHtcblx0cmV0dXJuICgnICcucmVwZWF0KHBhZGRpbmcpICsgc3ViamVjdCkuc2xpY2UoLXBhZGRpbmcpO1xufVxuIl19