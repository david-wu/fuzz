"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Fuzz = void 0;

var _fuzzStringStyler = require("./fuzz-string-styler.class");

var _fuzzDeepKeyFinder = require("./fuzz-deep-key-finder.class");

var _fuzzDiagnostics = require("./fuzz-diagnostics.class");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Fuzz
 */
var Fuzz =
/*#__PURE__*/
function () {
  _createClass(Fuzz, null, [{
    key: "getAllKeys",
    value: function getAllKeys(items) {
      var fdkf = new _fuzzDeepKeyFinder.FuzzDeepKeyFinder();
      return fdkf.getAllKeys(items);
    }
  }, {
    key: "filter",
    value: function filter(items, query) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return Fuzz.search(items, query, options).map(function (fuzzItem) {
        return fuzzItem.original;
      });
    }
  }, {
    key: "search",
    value: function search(items, query) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var fuzz = new Fuzz();
      return fuzz.search(items, query, options);
    }
  }]);

  function Fuzz() {
    var stringStyler = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new _fuzzStringStyler.FuzzStringStyler();
    var keyFinder = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new _fuzzDeepKeyFinder.FuzzDeepKeyFinder();
    var diagnostics = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new _fuzzDiagnostics.FuzzDiagnostics();

    _classCallCheck(this, Fuzz);

    this.stringStyler = stringStyler;
    this.keyFinder = keyFinder;
    this.diagnostics = diagnostics;

    _defineProperty(this, "subjectKeys", []);

    _defineProperty(this, "caseSensitive", false);

    _defineProperty(this, "skipFilter", false);

    _defineProperty(this, "skipSort", false);

    _defineProperty(this, "startDecorator", '<b>');

    _defineProperty(this, "endDecorator", '</b>');

    _defineProperty(this, "filterThreshold", 0.4);

    _defineProperty(this, "editCosts", _objectSpread({}, Fuzz.DEFAULT_EDIT_COSTS));
  }

  _createClass(Fuzz, [{
    key: "search",
    value: function search(items, query) {
      var _this = this;

      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      Object.assign(this, options);
      var fuzzItems = this.getScoredFuzzItems(items, query, this.subjectKeys);
      this.diagnostics.indexFuzzItems(fuzzItems);

      if (!this.skipFilter && query) {
        fuzzItems = fuzzItems.filter(function (fuzzItem) {
          return fuzzItem.score >= _this.filterThreshold;
        });
      }

      if (!this.skipSort) {
        fuzzItems.sort(function (a, b) {
          return b.score - a.score;
        });
      }

      return uniqBy(fuzzItems, function (fuzzItem) {
        return fuzzItem.original;
      });
    }
  }, {
    key: "getScoredFuzzItems",
    value: function getScoredFuzzItems(items, query) {
      var subjectKeys = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
      subjectKeys = subjectKeys.length ? subjectKeys : this.keyFinder.getAllKeys(items);
      var fuzzItems = this.getFuzzItems(items, subjectKeys, query);
      this.scoreFuzzItems(fuzzItems);
      return fuzzItems;
    }
  }, {
    key: "getFuzzItems",
    value: function getFuzzItems(items, subjectKeys, query) {
      var fuzzItems = [];
      items.forEach(function (item) {
        subjectKeys.forEach(function (key) {
          var subject = get(item, key);

          if (subject === undefined) {
            return;
          }

          fuzzItems.push({
            original: item,
            key: key,
            subject: String(subject),
            query: String(query)
          });
        });
      });
      return fuzzItems;
    }
  }, {
    key: "scoreFuzzItems",
    value: function scoreFuzzItems(fuzzItems) {
      var _this2 = this;

      fuzzItems.forEach(function (fuzzItem) {
        var editMatrix = _this2.getInitialEditMatrix(fuzzItem.query, fuzzItem.subject, _this2.editCosts);

        var operationMatrix = _this2.fillEditMatrix(editMatrix, _this2.caseSensitive ? fuzzItem.query : fuzzItem.query.toLowerCase(), _this2.caseSensitive ? fuzzItem.subject : fuzzItem.subject.toLowerCase(), _this2.editCosts);

        var _this2$getMatchRanges = _this2.getMatchRanges(operationMatrix),
            _this2$getMatchRanges2 = _slicedToArray(_this2$getMatchRanges, 2),
            matchRanges = _this2$getMatchRanges2[0],
            traversedCells = _this2$getMatchRanges2[1];

        var worstPossibleEditDistance = fuzzItem.query.length * _this2.editCosts.deletion;

        if (!fuzzItem.query.length) {
          worstPossibleEditDistance += fuzzItem.subject.length * _this2.editCosts.preQueryInsertion;
        } else {
          worstPossibleEditDistance += fuzzItem.subject.length * Math.min(_this2.editCosts.postQueryInsertion, _this2.editCosts.preQueryInsertion);
        }

        fuzzItem.editDistance = editMatrix[editMatrix.length - 1][editMatrix[0].length - 1];
        fuzzItem.score = worstPossibleEditDistance === 0 ? 1 : 1 - fuzzItem.editDistance / worstPossibleEditDistance;
        fuzzItem.matchRanges = matchRanges;
        fuzzItem.styledString = _this2.stringStyler.styleWithTags(fuzzItem.subject, matchRanges, _this2.startDecorator, _this2.endDecorator);

        _this2.diagnostics.setFuzzalyticsForFuzzItem(fuzzItem, {
          editMatrix: editMatrix,
          operationMatrix: operationMatrix,
          traversedCells: traversedCells,
          worstPossibleEditDistance: worstPossibleEditDistance
        });
      });
    }
  }, {
    key: "getInitialEditMatrix",
    value: function getInitialEditMatrix(query, subject, editCosts) {
      var height = query.length + 1;
      var width = subject.length + 1;
      var firstRow = [];

      for (var i = 0; i < width; i++) {
        firstRow.push(i * editCosts.preQueryInsertion);
      }

      var initialEditMatrix = [firstRow];

      for (var _i2 = 1; _i2 < height; _i2++) {
        var row = new Array(width);
        row[0] = _i2 * editCosts.deletion;
        initialEditMatrix.push(row);
      }

      return initialEditMatrix;
    }
    /**
     * fillEditMatrix
     * todo: reuse matrices to reduce gc
     * @return {number[]}
     */

  }, {
    key: "fillEditMatrix",
    value: function fillEditMatrix(matrix, query, subject, editCosts) {
      var height = matrix.length;
      var width = matrix[0].length;
      var operationMatrix = this.getInitialOperationMatrix(height, width);

      for (var rowIndex = 1; rowIndex < height; rowIndex++) {
        var insertionCost = rowIndex === height - 1 ? editCosts.postQueryInsertion : editCosts.insertion;

        for (var columnIndex = 1; columnIndex < width; columnIndex++) {
          var doesSubstitutionReplace = query[rowIndex - 1] !== subject[columnIndex - 1];
          var substitutionCost = doesSubstitutionReplace ? editCosts.substitution : 0;
          var operationCosts = [matrix[rowIndex - 1][columnIndex] + editCosts.deletion, matrix[rowIndex][columnIndex - 1] + insertionCost, matrix[rowIndex - 1][columnIndex - 1] + substitutionCost];
          var operationIndex = getMinIndex(operationCosts);
          matrix[rowIndex][columnIndex] = operationCosts[operationIndex];

          if (operationIndex === 2 && !doesSubstitutionReplace) {
            operationMatrix[rowIndex][columnIndex] = 3;
          } else {
            operationMatrix[rowIndex][columnIndex] = operationIndex;
          }
        }
      }

      return operationMatrix;
    }
    /**
     * getInitialOperationMatrix
     * @return {number[]}
     */

  }, {
    key: "getInitialOperationMatrix",
    value: function getInitialOperationMatrix(height, width) {
      var firstRow = [];

      for (var i = 0; i < width; i++) {
        firstRow.push(1);
      }

      var operationMatrix = [firstRow];

      for (var _i3 = 1; _i3 < height; _i3++) {
        var row = new Array(width);
        row[0] = 0;
        operationMatrix.push(row);
      }

      return operationMatrix;
    }
    /**
     * getMatchRanges
     * operationMatrix numbers stand for { 0: delete, 1: insert, 2: sub, 3: noop }
     * @return {number[]}
     */

  }, {
    key: "getMatchRanges",
    value: function getMatchRanges(operationMatrix) {
      var yLoc = operationMatrix.length - 1;
      var xLoc = operationMatrix[0].length - 1;
      var matchRanges = [];
      var range;
      var traversedCells = [[0, 0]];

      while (yLoc !== 0 || xLoc !== 0) {
        traversedCells.push([yLoc, xLoc]);

        switch (operationMatrix[yLoc][xLoc]) {
          case 0:
            yLoc--; // deleting a character from subject does not break the matchRange streak

            break;

          case 1:
            xLoc--;

            if (range) {
              matchRanges.push(range);
              range = undefined;
            }

            break;

          case 2:
            yLoc--;
            xLoc--;

            if (range) {
              matchRanges.push(range);
              range = undefined;
            }

            break;

          case 3:
            yLoc--;
            xLoc--;

            if (range) {
              // continues matchRange streak
              range[0] = xLoc;
            } else {
              // starts the matchRange streak
              range = [xLoc, xLoc];
            }

            break;
        }
      }

      if (range) {
        matchRanges.push(range);
      }

      return [matchRanges.reverse(), traversedCells];
    }
  }]);

  return Fuzz;
}();

exports.Fuzz = Fuzz;

_defineProperty(Fuzz, "DEFAULT_EDIT_COSTS", {
  substitution: 101,
  deletion: 100,
  insertion: 100,
  preQueryInsertion: 1,
  postQueryInsertion: 0
});

function get(item, keysString) {
  var keys = keysString.split('.');

  for (var i = 0; i < keys.length; i++) {
    if (item === undefined || item === null) {
      return;
    }

    item = item[keys[i]];
  }

  return item;
}

function uniqBy(items) {
  var getItemKey = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : identity;
  var itemKeySet = new Set();
  return items.filter(function (item) {
    var key = getItemKey(item);

    if (itemKeySet.has(key)) {
      return false;
    } else {
      itemKeySet.add(key);
      return true;
    }
  });
}

function identity(item) {
  return item;
}

function getMinIndex(numbers) {
  var minIndex = 0;
  var minValue = numbers[0];

  for (var nextIndex = 1; nextIndex < numbers.length; nextIndex++) {
    var nextValue = numbers[nextIndex];

    if (nextValue < minValue) {
      minIndex = nextIndex;
      minValue = nextValue;
    }
  }

  return minIndex;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mdXp6LmNsYXNzLnRzIl0sIm5hbWVzIjpbIkZ1enoiLCJpdGVtcyIsImZka2YiLCJGdXp6RGVlcEtleUZpbmRlciIsImdldEFsbEtleXMiLCJxdWVyeSIsIm9wdGlvbnMiLCJzZWFyY2giLCJtYXAiLCJmdXp6SXRlbSIsIm9yaWdpbmFsIiwiZnV6eiIsInN0cmluZ1N0eWxlciIsIkZ1enpTdHJpbmdTdHlsZXIiLCJrZXlGaW5kZXIiLCJkaWFnbm9zdGljcyIsIkZ1enpEaWFnbm9zdGljcyIsIkRFRkFVTFRfRURJVF9DT1NUUyIsIk9iamVjdCIsImFzc2lnbiIsImZ1enpJdGVtcyIsImdldFNjb3JlZEZ1enpJdGVtcyIsInN1YmplY3RLZXlzIiwiaW5kZXhGdXp6SXRlbXMiLCJza2lwRmlsdGVyIiwiZmlsdGVyIiwic2NvcmUiLCJmaWx0ZXJUaHJlc2hvbGQiLCJza2lwU29ydCIsInNvcnQiLCJhIiwiYiIsInVuaXFCeSIsImxlbmd0aCIsImdldEZ1enpJdGVtcyIsInNjb3JlRnV6ekl0ZW1zIiwiZm9yRWFjaCIsIml0ZW0iLCJrZXkiLCJzdWJqZWN0IiwiZ2V0IiwidW5kZWZpbmVkIiwicHVzaCIsIlN0cmluZyIsImVkaXRNYXRyaXgiLCJnZXRJbml0aWFsRWRpdE1hdHJpeCIsImVkaXRDb3N0cyIsIm9wZXJhdGlvbk1hdHJpeCIsImZpbGxFZGl0TWF0cml4IiwiY2FzZVNlbnNpdGl2ZSIsInRvTG93ZXJDYXNlIiwiZ2V0TWF0Y2hSYW5nZXMiLCJtYXRjaFJhbmdlcyIsInRyYXZlcnNlZENlbGxzIiwid29yc3RQb3NzaWJsZUVkaXREaXN0YW5jZSIsImRlbGV0aW9uIiwicHJlUXVlcnlJbnNlcnRpb24iLCJNYXRoIiwibWluIiwicG9zdFF1ZXJ5SW5zZXJ0aW9uIiwiZWRpdERpc3RhbmNlIiwic3R5bGVkU3RyaW5nIiwic3R5bGVXaXRoVGFncyIsInN0YXJ0RGVjb3JhdG9yIiwiZW5kRGVjb3JhdG9yIiwic2V0RnV6emFseXRpY3NGb3JGdXp6SXRlbSIsImhlaWdodCIsIndpZHRoIiwiZmlyc3RSb3ciLCJpIiwiaW5pdGlhbEVkaXRNYXRyaXgiLCJyb3ciLCJBcnJheSIsIm1hdHJpeCIsImdldEluaXRpYWxPcGVyYXRpb25NYXRyaXgiLCJyb3dJbmRleCIsImluc2VydGlvbkNvc3QiLCJpbnNlcnRpb24iLCJjb2x1bW5JbmRleCIsImRvZXNTdWJzdGl0dXRpb25SZXBsYWNlIiwic3Vic3RpdHV0aW9uQ29zdCIsInN1YnN0aXR1dGlvbiIsIm9wZXJhdGlvbkNvc3RzIiwib3BlcmF0aW9uSW5kZXgiLCJnZXRNaW5JbmRleCIsInlMb2MiLCJ4TG9jIiwicmFuZ2UiLCJyZXZlcnNlIiwia2V5c1N0cmluZyIsImtleXMiLCJzcGxpdCIsImdldEl0ZW1LZXkiLCJpZGVudGl0eSIsIml0ZW1LZXlTZXQiLCJTZXQiLCJoYXMiLCJhZGQiLCJudW1iZXJzIiwibWluSW5kZXgiLCJtaW5WYWx1ZSIsIm5leHRJbmRleCIsIm5leHRWYWx1ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBOzs7SUFHYUEsSTs7Ozs7K0JBVWVDLEssRUFBYztBQUN0QyxVQUFNQyxJQUFJLEdBQUcsSUFBSUMsb0NBQUosRUFBYjtBQUNBLGFBQU9ELElBQUksQ0FBQ0UsVUFBTCxDQUFnQkgsS0FBaEIsQ0FBUDtBQUNEOzs7MkJBR0NBLEssRUFDQUksSyxFQUVBO0FBQUEsVUFEQUMsT0FDQSx1RUFEeUIsRUFDekI7QUFDQSxhQUFPTixJQUFJLENBQUNPLE1BQUwsQ0FDTE4sS0FESyxFQUVMSSxLQUZLLEVBR0xDLE9BSEssRUFJTEUsR0FKSyxDQUlELFVBQUNDLFFBQUQ7QUFBQSxlQUF3QkEsUUFBUSxDQUFDQyxRQUFqQztBQUFBLE9BSkMsQ0FBUDtBQUtEOzs7MkJBR0NULEssRUFDQUksSyxFQUVBO0FBQUEsVUFEQUMsT0FDQSx1RUFEeUIsRUFDekI7QUFDQSxVQUFNSyxJQUFJLEdBQUcsSUFBSVgsSUFBSixFQUFiO0FBQ0EsYUFBT1csSUFBSSxDQUFDSixNQUFMLENBQVlOLEtBQVosRUFBbUJJLEtBQW5CLEVBQTBCQyxPQUExQixDQUFQO0FBQ0Q7OztBQVdELGtCQUlFO0FBQUEsUUFIT00sWUFHUCx1RUFId0MsSUFBSUMsa0NBQUosRUFHeEM7QUFBQSxRQUZPQyxTQUVQLHVFQUZzQyxJQUFJWCxvQ0FBSixFQUV0QztBQUFBLFFBRE9ZLFdBQ1AsdUVBRHNDLElBQUlDLGdDQUFKLEVBQ3RDOztBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQSx5Q0FiNkIsRUFhN0I7O0FBQUEsMkNBWjhCLEtBWTlCOztBQUFBLHdDQVgyQixLQVczQjs7QUFBQSxzQ0FWeUIsS0FVekI7O0FBQUEsNENBVHNCLEtBU3RCOztBQUFBLDBDQVJvQixNQVFwQjs7QUFBQSw2Q0FQK0IsR0FPL0I7O0FBQUEseURBTmlDaEIsSUFBSSxDQUFDaUIsa0JBTXRDO0FBQUU7Ozs7MkJBR0ZoQixLLEVBQ0FJLEssRUFFQTtBQUFBOztBQUFBLFVBREFDLE9BQ0EsdUVBRHlCLEVBQ3pCO0FBQ0FZLE1BQUFBLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjLElBQWQsRUFBb0JiLE9BQXBCO0FBRUEsVUFBSWMsU0FBUyxHQUFHLEtBQUtDLGtCQUFMLENBQXdCcEIsS0FBeEIsRUFBK0JJLEtBQS9CLEVBQXNDLEtBQUtpQixXQUEzQyxDQUFoQjtBQUNBLFdBQUtQLFdBQUwsQ0FBaUJRLGNBQWpCLENBQWdDSCxTQUFoQzs7QUFFQSxVQUFJLENBQUMsS0FBS0ksVUFBTixJQUFvQm5CLEtBQXhCLEVBQStCO0FBQzdCZSxRQUFBQSxTQUFTLEdBQUdBLFNBQVMsQ0FBQ0ssTUFBVixDQUFpQixVQUFDaEIsUUFBRDtBQUFBLGlCQUF3QkEsUUFBUSxDQUFDaUIsS0FBVCxJQUFrQixLQUFJLENBQUNDLGVBQS9DO0FBQUEsU0FBakIsQ0FBWjtBQUNEOztBQUNELFVBQUksQ0FBQyxLQUFLQyxRQUFWLEVBQW9CO0FBQ2xCUixRQUFBQSxTQUFTLENBQUNTLElBQVYsQ0FBZSxVQUFDQyxDQUFELEVBQWNDLENBQWQ7QUFBQSxpQkFBOEJBLENBQUMsQ0FBQ0wsS0FBRixHQUFVSSxDQUFDLENBQUNKLEtBQTFDO0FBQUEsU0FBZjtBQUNEOztBQUNELGFBQU9NLE1BQU0sQ0FBQ1osU0FBRCxFQUFZLFVBQUNYLFFBQUQ7QUFBQSxlQUF3QkEsUUFBUSxDQUFDQyxRQUFqQztBQUFBLE9BQVosQ0FBYjtBQUNEOzs7dUNBR0NULEssRUFDQUksSyxFQUVZO0FBQUEsVUFEWmlCLFdBQ1ksdUVBRFksRUFDWjtBQUNaQSxNQUFBQSxXQUFXLEdBQUdBLFdBQVcsQ0FBQ1csTUFBWixHQUNWWCxXQURVLEdBRVYsS0FBS1IsU0FBTCxDQUFlVixVQUFmLENBQTBCSCxLQUExQixDQUZKO0FBSUEsVUFBTW1CLFNBQXFCLEdBQUcsS0FBS2MsWUFBTCxDQUFrQmpDLEtBQWxCLEVBQXlCcUIsV0FBekIsRUFBc0NqQixLQUF0QyxDQUE5QjtBQUNBLFdBQUs4QixjQUFMLENBQW9CZixTQUFwQjtBQUNBLGFBQU9BLFNBQVA7QUFDRDs7O2lDQUdDbkIsSyxFQUNBcUIsVyxFQUNBakIsSyxFQUNZO0FBQ1osVUFBTWUsU0FBcUIsR0FBRyxFQUE5QjtBQUNBbkIsTUFBQUEsS0FBSyxDQUFDbUMsT0FBTixDQUFjLFVBQUNDLElBQUQsRUFBZTtBQUMzQmYsUUFBQUEsV0FBVyxDQUFDYyxPQUFaLENBQW9CLFVBQUNFLEdBQUQsRUFBaUI7QUFDbkMsY0FBTUMsT0FBTyxHQUFHQyxHQUFHLENBQUNILElBQUQsRUFBT0MsR0FBUCxDQUFuQjs7QUFDQSxjQUFJQyxPQUFPLEtBQUtFLFNBQWhCLEVBQTJCO0FBQ3pCO0FBQ0Q7O0FBQ0RyQixVQUFBQSxTQUFTLENBQUNzQixJQUFWLENBQWU7QUFDYmhDLFlBQUFBLFFBQVEsRUFBRTJCLElBREc7QUFFYkMsWUFBQUEsR0FBRyxFQUFFQSxHQUZRO0FBR2JDLFlBQUFBLE9BQU8sRUFBRUksTUFBTSxDQUFDSixPQUFELENBSEY7QUFJYmxDLFlBQUFBLEtBQUssRUFBRXNDLE1BQU0sQ0FBQ3RDLEtBQUQ7QUFKQSxXQUFmO0FBTUQsU0FYRDtBQVlELE9BYkQ7QUFjQSxhQUFPZSxTQUFQO0FBQ0Q7OzttQ0FFcUJBLFMsRUFBdUI7QUFBQTs7QUFDM0NBLE1BQUFBLFNBQVMsQ0FBQ2dCLE9BQVYsQ0FBa0IsVUFBQzNCLFFBQUQsRUFBd0I7QUFDeEMsWUFBTW1DLFVBQVUsR0FBRyxNQUFJLENBQUNDLG9CQUFMLENBQ2pCcEMsUUFBUSxDQUFDSixLQURRLEVBRWpCSSxRQUFRLENBQUM4QixPQUZRLEVBR2pCLE1BQUksQ0FBQ08sU0FIWSxDQUFuQjs7QUFLQSxZQUFNQyxlQUFlLEdBQUcsTUFBSSxDQUFDQyxjQUFMLENBQ3RCSixVQURzQixFQUV0QixNQUFJLENBQUNLLGFBQUwsR0FBcUJ4QyxRQUFRLENBQUNKLEtBQTlCLEdBQXNDSSxRQUFRLENBQUNKLEtBQVQsQ0FBZTZDLFdBQWYsRUFGaEIsRUFHdEIsTUFBSSxDQUFDRCxhQUFMLEdBQXFCeEMsUUFBUSxDQUFDOEIsT0FBOUIsR0FBd0M5QixRQUFRLENBQUM4QixPQUFULENBQWlCVyxXQUFqQixFQUhsQixFQUl0QixNQUFJLENBQUNKLFNBSmlCLENBQXhCOztBQU53QyxvQ0FZRixNQUFJLENBQUNLLGNBQUwsQ0FBb0JKLGVBQXBCLENBWkU7QUFBQTtBQUFBLFlBWWpDSyxXQVppQztBQUFBLFlBWXBCQyxjQVpvQjs7QUFjeEMsWUFBSUMseUJBQXlCLEdBQUc3QyxRQUFRLENBQUNKLEtBQVQsQ0FBZTRCLE1BQWYsR0FBd0IsTUFBSSxDQUFDYSxTQUFMLENBQWVTLFFBQXZFOztBQUNBLFlBQUksQ0FBQzlDLFFBQVEsQ0FBQ0osS0FBVCxDQUFlNEIsTUFBcEIsRUFBNEI7QUFDMUJxQixVQUFBQSx5QkFBeUIsSUFBSzdDLFFBQVEsQ0FBQzhCLE9BQVQsQ0FBaUJOLE1BQWpCLEdBQTBCLE1BQUksQ0FBQ2EsU0FBTCxDQUFlVSxpQkFBdkU7QUFDRCxTQUZELE1BRU87QUFDTEYsVUFBQUEseUJBQXlCLElBQUs3QyxRQUFRLENBQUM4QixPQUFULENBQWlCTixNQUFqQixHQUEwQndCLElBQUksQ0FBQ0MsR0FBTCxDQUFTLE1BQUksQ0FBQ1osU0FBTCxDQUFlYSxrQkFBeEIsRUFBNEMsTUFBSSxDQUFDYixTQUFMLENBQWVVLGlCQUEzRCxDQUF4RDtBQUNEOztBQUVEL0MsUUFBQUEsUUFBUSxDQUFDbUQsWUFBVCxHQUF3QmhCLFVBQVUsQ0FBQ0EsVUFBVSxDQUFDWCxNQUFYLEdBQW9CLENBQXJCLENBQVYsQ0FBa0NXLFVBQVUsQ0FBQyxDQUFELENBQVYsQ0FBY1gsTUFBZCxHQUF1QixDQUF6RCxDQUF4QjtBQUNBeEIsUUFBQUEsUUFBUSxDQUFDaUIsS0FBVCxHQUFrQjRCLHlCQUF5QixLQUFLLENBQS9CLEdBQ2IsQ0FEYSxHQUViLElBQUs3QyxRQUFRLENBQUNtRCxZQUFULEdBQXdCTix5QkFGakM7QUFJQTdDLFFBQUFBLFFBQVEsQ0FBQzJDLFdBQVQsR0FBdUJBLFdBQXZCO0FBQ0EzQyxRQUFBQSxRQUFRLENBQUNvRCxZQUFULEdBQXdCLE1BQUksQ0FBQ2pELFlBQUwsQ0FBa0JrRCxhQUFsQixDQUN0QnJELFFBQVEsQ0FBQzhCLE9BRGEsRUFFdEJhLFdBRnNCLEVBR3RCLE1BQUksQ0FBQ1csY0FIaUIsRUFJdEIsTUFBSSxDQUFDQyxZQUppQixDQUF4Qjs7QUFPQSxRQUFBLE1BQUksQ0FBQ2pELFdBQUwsQ0FBaUJrRCx5QkFBakIsQ0FDRXhELFFBREYsRUFFRTtBQUNFbUMsVUFBQUEsVUFBVSxFQUFWQSxVQURGO0FBRUVHLFVBQUFBLGVBQWUsRUFBZkEsZUFGRjtBQUdFTSxVQUFBQSxjQUFjLEVBQWRBLGNBSEY7QUFJRUMsVUFBQUEseUJBQXlCLEVBQXpCQTtBQUpGLFNBRkY7QUFTRCxPQTNDRDtBQTRDRDs7O3lDQUdDakQsSyxFQUNBa0MsTyxFQUNBTyxTLEVBQ1k7QUFDWixVQUFNb0IsTUFBTSxHQUFHN0QsS0FBSyxDQUFDNEIsTUFBTixHQUFlLENBQTlCO0FBQ0EsVUFBTWtDLEtBQUssR0FBRzVCLE9BQU8sQ0FBQ04sTUFBUixHQUFpQixDQUEvQjtBQUVBLFVBQU1tQyxRQUFRLEdBQUcsRUFBakI7O0FBQ0EsV0FBSyxJQUFJQyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHRixLQUFwQixFQUEyQkUsQ0FBQyxFQUE1QixFQUFnQztBQUM5QkQsUUFBQUEsUUFBUSxDQUFDMUIsSUFBVCxDQUFjMkIsQ0FBQyxHQUFHdkIsU0FBUyxDQUFDVSxpQkFBNUI7QUFDRDs7QUFFRCxVQUFNYyxpQkFBaUIsR0FBRyxDQUFDRixRQUFELENBQTFCOztBQUNBLFdBQUssSUFBSUMsR0FBQyxHQUFHLENBQWIsRUFBZ0JBLEdBQUMsR0FBR0gsTUFBcEIsRUFBNEJHLEdBQUMsRUFBN0IsRUFBaUM7QUFDL0IsWUFBTUUsR0FBRyxHQUFHLElBQUlDLEtBQUosQ0FBVUwsS0FBVixDQUFaO0FBQ0FJLFFBQUFBLEdBQUcsQ0FBQyxDQUFELENBQUgsR0FBU0YsR0FBQyxHQUFHdkIsU0FBUyxDQUFDUyxRQUF2QjtBQUNBZSxRQUFBQSxpQkFBaUIsQ0FBQzVCLElBQWxCLENBQXVCNkIsR0FBdkI7QUFDRDs7QUFDRCxhQUFPRCxpQkFBUDtBQUNEO0FBRUQ7Ozs7Ozs7O21DQU1FRyxNLEVBQ0FwRSxLLEVBQ0FrQyxPLEVBQ0FPLFMsRUFDWTtBQUNaLFVBQU1vQixNQUFNLEdBQUdPLE1BQU0sQ0FBQ3hDLE1BQXRCO0FBQ0EsVUFBTWtDLEtBQUssR0FBR00sTUFBTSxDQUFDLENBQUQsQ0FBTixDQUFVeEMsTUFBeEI7QUFDQSxVQUFNYyxlQUFlLEdBQUcsS0FBSzJCLHlCQUFMLENBQStCUixNQUEvQixFQUF1Q0MsS0FBdkMsQ0FBeEI7O0FBQ0EsV0FBSyxJQUFJUSxRQUFRLEdBQUcsQ0FBcEIsRUFBdUJBLFFBQVEsR0FBR1QsTUFBbEMsRUFBMENTLFFBQVEsRUFBbEQsRUFBc0Q7QUFDcEQsWUFBTUMsYUFBYSxHQUFHRCxRQUFRLEtBQU1ULE1BQU0sR0FBRyxDQUF2QixHQUE0QnBCLFNBQVMsQ0FBQ2Esa0JBQXRDLEdBQTJEYixTQUFTLENBQUMrQixTQUEzRjs7QUFDQSxhQUFLLElBQUlDLFdBQVcsR0FBRyxDQUF2QixFQUEwQkEsV0FBVyxHQUFHWCxLQUF4QyxFQUErQ1csV0FBVyxFQUExRCxFQUE4RDtBQUM1RCxjQUFNQyx1QkFBdUIsR0FBRzFFLEtBQUssQ0FBQ3NFLFFBQVEsR0FBRyxDQUFaLENBQUwsS0FBd0JwQyxPQUFPLENBQUN1QyxXQUFXLEdBQUcsQ0FBZixDQUEvRDtBQUNBLGNBQU1FLGdCQUFnQixHQUFHRCx1QkFBdUIsR0FBR2pDLFNBQVMsQ0FBQ21DLFlBQWIsR0FBNEIsQ0FBNUU7QUFDQSxjQUFNQyxjQUFjLEdBQUcsQ0FDckJULE1BQU0sQ0FBQ0UsUUFBUSxHQUFHLENBQVosQ0FBTixDQUFxQkcsV0FBckIsSUFBb0NoQyxTQUFTLENBQUNTLFFBRHpCLEVBRXJCa0IsTUFBTSxDQUFDRSxRQUFELENBQU4sQ0FBaUJHLFdBQVcsR0FBRyxDQUEvQixJQUFvQ0YsYUFGZixFQUdyQkgsTUFBTSxDQUFDRSxRQUFRLEdBQUcsQ0FBWixDQUFOLENBQXFCRyxXQUFXLEdBQUcsQ0FBbkMsSUFBd0NFLGdCQUhuQixDQUF2QjtBQUtBLGNBQU1HLGNBQWMsR0FBR0MsV0FBVyxDQUFDRixjQUFELENBQWxDO0FBQ0FULFVBQUFBLE1BQU0sQ0FBQ0UsUUFBRCxDQUFOLENBQWlCRyxXQUFqQixJQUFnQ0ksY0FBYyxDQUFDQyxjQUFELENBQTlDOztBQUNBLGNBQUlBLGNBQWMsS0FBSyxDQUFuQixJQUF3QixDQUFDSix1QkFBN0IsRUFBc0Q7QUFDcERoQyxZQUFBQSxlQUFlLENBQUM0QixRQUFELENBQWYsQ0FBMEJHLFdBQTFCLElBQXlDLENBQXpDO0FBQ0QsV0FGRCxNQUVPO0FBQ0wvQixZQUFBQSxlQUFlLENBQUM0QixRQUFELENBQWYsQ0FBMEJHLFdBQTFCLElBQXlDSyxjQUF6QztBQUNEO0FBQ0Y7QUFDRjs7QUFDRCxhQUFPcEMsZUFBUDtBQUNEO0FBRUQ7Ozs7Ozs7OENBSWlDbUIsTSxFQUFnQkMsSyxFQUEyQjtBQUMxRSxVQUFNQyxRQUFRLEdBQUcsRUFBakI7O0FBQ0EsV0FBSyxJQUFJQyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHRixLQUFwQixFQUEyQkUsQ0FBQyxFQUE1QixFQUFnQztBQUM5QkQsUUFBQUEsUUFBUSxDQUFDMUIsSUFBVCxDQUFjLENBQWQ7QUFDRDs7QUFFRCxVQUFNSyxlQUFlLEdBQUcsQ0FBQ3FCLFFBQUQsQ0FBeEI7O0FBQ0EsV0FBSSxJQUFJQyxHQUFDLEdBQUcsQ0FBWixFQUFlQSxHQUFDLEdBQUdILE1BQW5CLEVBQTJCRyxHQUFDLEVBQTVCLEVBQWdDO0FBQzlCLFlBQU1FLEdBQUcsR0FBRyxJQUFJQyxLQUFKLENBQVVMLEtBQVYsQ0FBWjtBQUNBSSxRQUFBQSxHQUFHLENBQUMsQ0FBRCxDQUFILEdBQVMsQ0FBVDtBQUNBeEIsUUFBQUEsZUFBZSxDQUFDTCxJQUFoQixDQUFxQjZCLEdBQXJCO0FBQ0Q7O0FBQ0QsYUFBT3hCLGVBQVA7QUFDRDtBQUVEOzs7Ozs7OzttQ0FLc0JBLGUsRUFBZ0Q7QUFDcEUsVUFBSXNDLElBQUksR0FBR3RDLGVBQWUsQ0FBQ2QsTUFBaEIsR0FBeUIsQ0FBcEM7QUFDQSxVQUFJcUQsSUFBSSxHQUFHdkMsZUFBZSxDQUFDLENBQUQsQ0FBZixDQUFtQmQsTUFBbkIsR0FBNEIsQ0FBdkM7QUFDQSxVQUFJbUIsV0FBdUIsR0FBRyxFQUE5QjtBQUNBLFVBQUltQyxLQUFKO0FBRUEsVUFBSWxDLGNBQWMsR0FBRyxDQUFDLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBRCxDQUFyQjs7QUFFQSxhQUFPZ0MsSUFBSSxLQUFLLENBQVQsSUFBY0MsSUFBSSxLQUFLLENBQTlCLEVBQWlDO0FBQy9CakMsUUFBQUEsY0FBYyxDQUFDWCxJQUFmLENBQW9CLENBQUMyQyxJQUFELEVBQU9DLElBQVAsQ0FBcEI7O0FBQ0EsZ0JBQU92QyxlQUFlLENBQUNzQyxJQUFELENBQWYsQ0FBc0JDLElBQXRCLENBQVA7QUFDRSxlQUFLLENBQUw7QUFDRUQsWUFBQUEsSUFBSSxHQUROLENBRUU7O0FBQ0E7O0FBQ0YsZUFBSyxDQUFMO0FBQ0VDLFlBQUFBLElBQUk7O0FBQ0osZ0JBQUlDLEtBQUosRUFBVztBQUNUbkMsY0FBQUEsV0FBVyxDQUFDVixJQUFaLENBQWlCNkMsS0FBakI7QUFDQUEsY0FBQUEsS0FBSyxHQUFHOUMsU0FBUjtBQUNEOztBQUNEOztBQUNGLGVBQUssQ0FBTDtBQUNFNEMsWUFBQUEsSUFBSTtBQUNKQyxZQUFBQSxJQUFJOztBQUNKLGdCQUFJQyxLQUFKLEVBQVc7QUFDVG5DLGNBQUFBLFdBQVcsQ0FBQ1YsSUFBWixDQUFpQjZDLEtBQWpCO0FBQ0FBLGNBQUFBLEtBQUssR0FBRzlDLFNBQVI7QUFDRDs7QUFDRDs7QUFDRixlQUFLLENBQUw7QUFDRTRDLFlBQUFBLElBQUk7QUFDSkMsWUFBQUEsSUFBSTs7QUFDSixnQkFBSUMsS0FBSixFQUFXO0FBQ1Q7QUFDQUEsY0FBQUEsS0FBSyxDQUFDLENBQUQsQ0FBTCxHQUFXRCxJQUFYO0FBQ0QsYUFIRCxNQUdPO0FBQ0w7QUFDQUMsY0FBQUEsS0FBSyxHQUFHLENBQUNELElBQUQsRUFBT0EsSUFBUCxDQUFSO0FBQ0Q7O0FBQ0Q7QUE5Qko7QUFnQ0Q7O0FBQ0QsVUFBSUMsS0FBSixFQUFXO0FBQ1RuQyxRQUFBQSxXQUFXLENBQUNWLElBQVosQ0FBaUI2QyxLQUFqQjtBQUNEOztBQUNELGFBQU8sQ0FBQ25DLFdBQVcsQ0FBQ29DLE9BQVosRUFBRCxFQUF3Qm5DLGNBQXhCLENBQVA7QUFDRDs7Ozs7Ozs7Z0JBM1JVckQsSSx3QkFFNEM7QUFDckRpRixFQUFBQSxZQUFZLEVBQUUsR0FEdUM7QUFFckQxQixFQUFBQSxRQUFRLEVBQUUsR0FGMkM7QUFHckRzQixFQUFBQSxTQUFTLEVBQUUsR0FIMEM7QUFJckRyQixFQUFBQSxpQkFBaUIsRUFBRSxDQUprQztBQUtyREcsRUFBQUEsa0JBQWtCLEVBQUU7QUFMaUMsQzs7QUE2UnpELFNBQVNuQixHQUFULENBQ0VILElBREYsRUFFRW9ELFVBRkYsRUFHRTtBQUNBLE1BQU1DLElBQUksR0FBR0QsVUFBVSxDQUFDRSxLQUFYLENBQWlCLEdBQWpCLENBQWI7O0FBQ0EsT0FBSSxJQUFJdEIsQ0FBQyxHQUFHLENBQVosRUFBZUEsQ0FBQyxHQUFHcUIsSUFBSSxDQUFDekQsTUFBeEIsRUFBZ0NvQyxDQUFDLEVBQWpDLEVBQXFDO0FBQ25DLFFBQUdoQyxJQUFJLEtBQUtJLFNBQVQsSUFBc0JKLElBQUksS0FBSyxJQUFsQyxFQUF3QztBQUN0QztBQUNEOztBQUNEQSxJQUFBQSxJQUFJLEdBQUdBLElBQUksQ0FBQ3FELElBQUksQ0FBQ3JCLENBQUQsQ0FBTCxDQUFYO0FBQ0Q7O0FBQ0QsU0FBT2hDLElBQVA7QUFDRDs7QUFFRCxTQUFTTCxNQUFULENBQ0UvQixLQURGLEVBR0U7QUFBQSxNQURBMkYsVUFDQSx1RUFEaUNDLFFBQ2pDO0FBQ0EsTUFBTUMsVUFBVSxHQUFHLElBQUlDLEdBQUosRUFBbkI7QUFDQSxTQUFPOUYsS0FBSyxDQUFDd0IsTUFBTixDQUFhLFVBQUNZLElBQUQsRUFBZTtBQUNqQyxRQUFNQyxHQUFHLEdBQUdzRCxVQUFVLENBQUN2RCxJQUFELENBQXRCOztBQUNBLFFBQUl5RCxVQUFVLENBQUNFLEdBQVgsQ0FBZTFELEdBQWYsQ0FBSixFQUF5QjtBQUN2QixhQUFPLEtBQVA7QUFDRCxLQUZELE1BRU87QUFDTHdELE1BQUFBLFVBQVUsQ0FBQ0csR0FBWCxDQUFlM0QsR0FBZjtBQUNBLGFBQU8sSUFBUDtBQUNEO0FBQ0YsR0FSTSxDQUFQO0FBU0Q7O0FBRUQsU0FBU3VELFFBQVQsQ0FBa0J4RCxJQUFsQixFQUE2QjtBQUMzQixTQUFPQSxJQUFQO0FBQ0Q7O0FBRUQsU0FBUytDLFdBQVQsQ0FBcUJjLE9BQXJCLEVBQWdEO0FBQzlDLE1BQUlDLFFBQVEsR0FBRyxDQUFmO0FBQ0EsTUFBSUMsUUFBUSxHQUFHRixPQUFPLENBQUMsQ0FBRCxDQUF0Qjs7QUFDQSxPQUFLLElBQUlHLFNBQVMsR0FBRyxDQUFyQixFQUF3QkEsU0FBUyxHQUFHSCxPQUFPLENBQUNqRSxNQUE1QyxFQUFvRG9FLFNBQVMsRUFBN0QsRUFBaUU7QUFDL0QsUUFBTUMsU0FBUyxHQUFHSixPQUFPLENBQUNHLFNBQUQsQ0FBekI7O0FBQ0EsUUFBSUMsU0FBUyxHQUFHRixRQUFoQixFQUEwQjtBQUN4QkQsTUFBQUEsUUFBUSxHQUFHRSxTQUFYO0FBQ0FELE1BQUFBLFFBQVEsR0FBR0UsU0FBWDtBQUNEO0FBQ0Y7O0FBQ0QsU0FBT0gsUUFBUDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRWRpdENvc3RzLCBGdXp6SXRlbSB9IGZyb20gJy4vbW9kZWxzL2luZGV4JztcbmltcG9ydCB7IEZ1enpTdHJpbmdTdHlsZXIgfSBmcm9tICcuL2Z1enotc3RyaW5nLXN0eWxlci5jbGFzcyc7XG5pbXBvcnQgeyBGdXp6RGVlcEtleUZpbmRlciB9IGZyb20gJy4vZnV6ei1kZWVwLWtleS1maW5kZXIuY2xhc3MnO1xuaW1wb3J0IHsgRnV6ekRpYWdub3N0aWNzLCBGdXp6YWx5dGljcyB9IGZyb20gJy4vZnV6ei1kaWFnbm9zdGljcy5jbGFzcydcblxuLyoqXG4gKiBGdXp6XG4gKi9cbmV4cG9ydCBjbGFzcyBGdXp6IHtcblxuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IERFRkFVTFRfRURJVF9DT1NUUzogRWRpdENvc3RzID0ge1xuICAgIHN1YnN0aXR1dGlvbjogMTAxLFxuICAgIGRlbGV0aW9uOiAxMDAsXG4gICAgaW5zZXJ0aW9uOiAxMDAsXG4gICAgcHJlUXVlcnlJbnNlcnRpb246IDEsXG4gICAgcG9zdFF1ZXJ5SW5zZXJ0aW9uOiAwLFxuICB9XG5cbiAgcHVibGljIHN0YXRpYyBnZXRBbGxLZXlzIChpdGVtczogYW55W10pIHtcbiAgICBjb25zdCBmZGtmID0gbmV3IEZ1enpEZWVwS2V5RmluZGVyKCk7XG4gICAgcmV0dXJuIGZka2YuZ2V0QWxsS2V5cyhpdGVtcyk7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIGZpbHRlcihcbiAgICBpdGVtczogYW55W10sXG4gICAgcXVlcnk6IHN0cmluZyxcbiAgICBvcHRpb25zOiBQYXJ0aWFsPEZ1eno+ID0ge30sXG4gICkge1xuICAgIHJldHVybiBGdXp6LnNlYXJjaChcbiAgICAgIGl0ZW1zLFxuICAgICAgcXVlcnksXG4gICAgICBvcHRpb25zLFxuICAgICkubWFwKChmdXp6SXRlbTogRnV6ekl0ZW0pID0+IGZ1enpJdGVtLm9yaWdpbmFsKTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgc2VhcmNoKFxuICAgIGl0ZW1zOiBhbnlbXSxcbiAgICBxdWVyeTogc3RyaW5nLFxuICAgIG9wdGlvbnM6IFBhcnRpYWw8RnV6ej4gPSB7fSxcbiAgKSB7XG4gICAgY29uc3QgZnV6eiA9IG5ldyBGdXp6KCk7XG4gICAgcmV0dXJuIGZ1enouc2VhcmNoKGl0ZW1zLCBxdWVyeSwgb3B0aW9ucyk7XG4gIH1cblxuICBwdWJsaWMgc3ViamVjdEtleXM6IHN0cmluZ1tdID0gW107XG4gIHB1YmxpYyBjYXNlU2Vuc2l0aXZlOiBib29sZWFuID0gZmFsc2U7XG4gIHB1YmxpYyBza2lwRmlsdGVyOiBib29sZWFuID0gZmFsc2U7XG4gIHB1YmxpYyBza2lwU29ydDogYm9vbGVhbiA9IGZhbHNlO1xuICBwdWJsaWMgc3RhcnREZWNvcmF0b3IgPSAnPGI+JztcbiAgcHVibGljIGVuZERlY29yYXRvciA9ICc8L2I+JztcbiAgcHVibGljIGZpbHRlclRocmVzaG9sZDogbnVtYmVyID0gMC40O1xuICBwdWJsaWMgZWRpdENvc3RzOiBFZGl0Q29zdHMgPSB7IC4uLkZ1enouREVGQVVMVF9FRElUX0NPU1RTIH07XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIHN0cmluZ1N0eWxlcjogRnV6elN0cmluZ1N0eWxlciA9IG5ldyBGdXp6U3RyaW5nU3R5bGVyKCksXG4gICAgcHVibGljIGtleUZpbmRlcjogRnV6ekRlZXBLZXlGaW5kZXIgPSBuZXcgRnV6ekRlZXBLZXlGaW5kZXIoKSxcbiAgICBwdWJsaWMgZGlhZ25vc3RpY3M6IEZ1enpEaWFnbm9zdGljcyA9IG5ldyBGdXp6RGlhZ25vc3RpY3MoKSxcbiAgKSB7fVxuXG4gIHB1YmxpYyBzZWFyY2goXG4gICAgaXRlbXM6IGFueVtdLFxuICAgIHF1ZXJ5OiBzdHJpbmcsXG4gICAgb3B0aW9uczogUGFydGlhbDxGdXp6PiA9IHt9LFxuICApIHtcbiAgICBPYmplY3QuYXNzaWduKHRoaXMsIG9wdGlvbnMpO1xuXG4gICAgbGV0IGZ1enpJdGVtcyA9IHRoaXMuZ2V0U2NvcmVkRnV6ekl0ZW1zKGl0ZW1zLCBxdWVyeSwgdGhpcy5zdWJqZWN0S2V5cyk7XG4gICAgdGhpcy5kaWFnbm9zdGljcy5pbmRleEZ1enpJdGVtcyhmdXp6SXRlbXMpO1xuXG4gICAgaWYgKCF0aGlzLnNraXBGaWx0ZXIgJiYgcXVlcnkpIHtcbiAgICAgIGZ1enpJdGVtcyA9IGZ1enpJdGVtcy5maWx0ZXIoKGZ1enpJdGVtOiBGdXp6SXRlbSkgPT4gZnV6ekl0ZW0uc2NvcmUgPj0gdGhpcy5maWx0ZXJUaHJlc2hvbGQpO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuc2tpcFNvcnQpIHtcbiAgICAgIGZ1enpJdGVtcy5zb3J0KChhOiBGdXp6SXRlbSwgYjogRnV6ekl0ZW0pID0+IGIuc2NvcmUgLSBhLnNjb3JlKTtcbiAgICB9XG4gICAgcmV0dXJuIHVuaXFCeShmdXp6SXRlbXMsIChmdXp6SXRlbTogRnV6ekl0ZW0pID0+IGZ1enpJdGVtLm9yaWdpbmFsKTtcbiAgfVxuXG4gIHB1YmxpYyBnZXRTY29yZWRGdXp6SXRlbXMoXG4gICAgaXRlbXM6IGFueVtdLFxuICAgIHF1ZXJ5OiBzdHJpbmcsXG4gICAgc3ViamVjdEtleXM6IHN0cmluZ1tdID0gW10sXG4gICk6IEZ1enpJdGVtW10ge1xuICAgIHN1YmplY3RLZXlzID0gc3ViamVjdEtleXMubGVuZ3RoXG4gICAgICA/IHN1YmplY3RLZXlzXG4gICAgICA6IHRoaXMua2V5RmluZGVyLmdldEFsbEtleXMoaXRlbXMpO1xuXG4gICAgY29uc3QgZnV6ekl0ZW1zOiBGdXp6SXRlbVtdID0gdGhpcy5nZXRGdXp6SXRlbXMoaXRlbXMsIHN1YmplY3RLZXlzLCBxdWVyeSk7XG4gICAgdGhpcy5zY29yZUZ1enpJdGVtcyhmdXp6SXRlbXMpO1xuICAgIHJldHVybiBmdXp6SXRlbXM7XG4gIH1cblxuICBwdWJsaWMgZ2V0RnV6ekl0ZW1zKFxuICAgIGl0ZW1zOiBhbnlbXSxcbiAgICBzdWJqZWN0S2V5czogc3RyaW5nW10sXG4gICAgcXVlcnk6IHN0cmluZ1xuICApOiBGdXp6SXRlbVtdIHtcbiAgICBjb25zdCBmdXp6SXRlbXM6IEZ1enpJdGVtW10gPSBbXTtcbiAgICBpdGVtcy5mb3JFYWNoKChpdGVtOiBhbnkpID0+IHtcbiAgICAgIHN1YmplY3RLZXlzLmZvckVhY2goKGtleTogc3RyaW5nKSA9PiB7XG4gICAgICAgIGNvbnN0IHN1YmplY3QgPSBnZXQoaXRlbSwga2V5KTtcbiAgICAgICAgaWYgKHN1YmplY3QgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBmdXp6SXRlbXMucHVzaCh7XG4gICAgICAgICAgb3JpZ2luYWw6IGl0ZW0sXG4gICAgICAgICAga2V5OiBrZXksXG4gICAgICAgICAgc3ViamVjdDogU3RyaW5nKHN1YmplY3QpLFxuICAgICAgICAgIHF1ZXJ5OiBTdHJpbmcocXVlcnkpLFxuICAgICAgICB9IGFzIEZ1enpJdGVtKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiBmdXp6SXRlbXM7XG4gIH1cblxuICBwdWJsaWMgc2NvcmVGdXp6SXRlbXMoZnV6ekl0ZW1zOiBGdXp6SXRlbVtdKSB7XG4gICAgZnV6ekl0ZW1zLmZvckVhY2goKGZ1enpJdGVtOiBGdXp6SXRlbSkgPT4ge1xuICAgICAgY29uc3QgZWRpdE1hdHJpeCA9IHRoaXMuZ2V0SW5pdGlhbEVkaXRNYXRyaXgoXG4gICAgICAgIGZ1enpJdGVtLnF1ZXJ5LFxuICAgICAgICBmdXp6SXRlbS5zdWJqZWN0LFxuICAgICAgICB0aGlzLmVkaXRDb3N0cyxcbiAgICAgICk7XG4gICAgICBjb25zdCBvcGVyYXRpb25NYXRyaXggPSB0aGlzLmZpbGxFZGl0TWF0cml4KFxuICAgICAgICBlZGl0TWF0cml4LFxuICAgICAgICB0aGlzLmNhc2VTZW5zaXRpdmUgPyBmdXp6SXRlbS5xdWVyeSA6IGZ1enpJdGVtLnF1ZXJ5LnRvTG93ZXJDYXNlKCksXG4gICAgICAgIHRoaXMuY2FzZVNlbnNpdGl2ZSA/IGZ1enpJdGVtLnN1YmplY3QgOiBmdXp6SXRlbS5zdWJqZWN0LnRvTG93ZXJDYXNlKCksXG4gICAgICAgIHRoaXMuZWRpdENvc3RzLFxuICAgICAgKTtcbiAgICAgIGNvbnN0IFttYXRjaFJhbmdlcywgdHJhdmVyc2VkQ2VsbHNdID0gdGhpcy5nZXRNYXRjaFJhbmdlcyhvcGVyYXRpb25NYXRyaXgpO1xuXG4gICAgICBsZXQgd29yc3RQb3NzaWJsZUVkaXREaXN0YW5jZSA9IGZ1enpJdGVtLnF1ZXJ5Lmxlbmd0aCAqIHRoaXMuZWRpdENvc3RzLmRlbGV0aW9uO1xuICAgICAgaWYgKCFmdXp6SXRlbS5xdWVyeS5sZW5ndGgpIHtcbiAgICAgICAgd29yc3RQb3NzaWJsZUVkaXREaXN0YW5jZSArPSAoZnV6ekl0ZW0uc3ViamVjdC5sZW5ndGggKiB0aGlzLmVkaXRDb3N0cy5wcmVRdWVyeUluc2VydGlvbik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3b3JzdFBvc3NpYmxlRWRpdERpc3RhbmNlICs9IChmdXp6SXRlbS5zdWJqZWN0Lmxlbmd0aCAqIE1hdGgubWluKHRoaXMuZWRpdENvc3RzLnBvc3RRdWVyeUluc2VydGlvbiwgdGhpcy5lZGl0Q29zdHMucHJlUXVlcnlJbnNlcnRpb24pKTtcbiAgICAgIH1cblxuICAgICAgZnV6ekl0ZW0uZWRpdERpc3RhbmNlID0gZWRpdE1hdHJpeFtlZGl0TWF0cml4Lmxlbmd0aCAtIDFdW2VkaXRNYXRyaXhbMF0ubGVuZ3RoIC0gMV07XG4gICAgICBmdXp6SXRlbS5zY29yZSA9ICh3b3JzdFBvc3NpYmxlRWRpdERpc3RhbmNlID09PSAwKVxuICAgICAgICA/IDFcbiAgICAgICAgOiAxIC0gKGZ1enpJdGVtLmVkaXREaXN0YW5jZSAvIHdvcnN0UG9zc2libGVFZGl0RGlzdGFuY2UpO1xuXG4gICAgICBmdXp6SXRlbS5tYXRjaFJhbmdlcyA9IG1hdGNoUmFuZ2VzO1xuICAgICAgZnV6ekl0ZW0uc3R5bGVkU3RyaW5nID0gdGhpcy5zdHJpbmdTdHlsZXIuc3R5bGVXaXRoVGFncyhcbiAgICAgICAgZnV6ekl0ZW0uc3ViamVjdCxcbiAgICAgICAgbWF0Y2hSYW5nZXMsXG4gICAgICAgIHRoaXMuc3RhcnREZWNvcmF0b3IsXG4gICAgICAgIHRoaXMuZW5kRGVjb3JhdG9yLFxuICAgICAgKTtcblxuICAgICAgdGhpcy5kaWFnbm9zdGljcy5zZXRGdXp6YWx5dGljc0ZvckZ1enpJdGVtKFxuICAgICAgICBmdXp6SXRlbSxcbiAgICAgICAge1xuICAgICAgICAgIGVkaXRNYXRyaXgsXG4gICAgICAgICAgb3BlcmF0aW9uTWF0cml4LFxuICAgICAgICAgIHRyYXZlcnNlZENlbGxzLFxuICAgICAgICAgIHdvcnN0UG9zc2libGVFZGl0RGlzdGFuY2UsXG4gICAgICAgIH0sXG4gICAgICApO1xuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGdldEluaXRpYWxFZGl0TWF0cml4KFxuICAgIHF1ZXJ5OiBzdHJpbmcsXG4gICAgc3ViamVjdDogc3RyaW5nLFxuICAgIGVkaXRDb3N0czogRWRpdENvc3RzLFxuICApOiBudW1iZXJbXVtdIHtcbiAgICBjb25zdCBoZWlnaHQgPSBxdWVyeS5sZW5ndGggKyAxO1xuICAgIGNvbnN0IHdpZHRoID0gc3ViamVjdC5sZW5ndGggKyAxO1xuXG4gICAgY29uc3QgZmlyc3RSb3cgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHdpZHRoOyBpKyspIHtcbiAgICAgIGZpcnN0Um93LnB1c2goaSAqIGVkaXRDb3N0cy5wcmVRdWVyeUluc2VydGlvbik7XG4gICAgfVxuXG4gICAgY29uc3QgaW5pdGlhbEVkaXRNYXRyaXggPSBbZmlyc3RSb3ddO1xuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgaGVpZ2h0OyBpKyspIHtcbiAgICAgIGNvbnN0IHJvdyA9IG5ldyBBcnJheSh3aWR0aCk7XG4gICAgICByb3dbMF0gPSBpICogZWRpdENvc3RzLmRlbGV0aW9uO1xuICAgICAgaW5pdGlhbEVkaXRNYXRyaXgucHVzaChyb3cpO1xuICAgIH1cbiAgICByZXR1cm4gaW5pdGlhbEVkaXRNYXRyaXg7XG4gIH1cblxuICAvKipcbiAgICogZmlsbEVkaXRNYXRyaXhcbiAgICogdG9kbzogcmV1c2UgbWF0cmljZXMgdG8gcmVkdWNlIGdjXG4gICAqIEByZXR1cm4ge251bWJlcltdfVxuICAgKi9cbiAgcHVibGljIGZpbGxFZGl0TWF0cml4KFxuICAgIG1hdHJpeDogbnVtYmVyW11bXSxcbiAgICBxdWVyeTogc3RyaW5nLFxuICAgIHN1YmplY3Q6IHN0cmluZyxcbiAgICBlZGl0Q29zdHM6IEVkaXRDb3N0cyxcbiAgKTogbnVtYmVyW11bXSB7XG4gICAgY29uc3QgaGVpZ2h0ID0gbWF0cml4Lmxlbmd0aDtcbiAgICBjb25zdCB3aWR0aCA9IG1hdHJpeFswXS5sZW5ndGg7XG4gICAgY29uc3Qgb3BlcmF0aW9uTWF0cml4ID0gdGhpcy5nZXRJbml0aWFsT3BlcmF0aW9uTWF0cml4KGhlaWdodCwgd2lkdGgpO1xuICAgIGZvciAobGV0IHJvd0luZGV4ID0gMTsgcm93SW5kZXggPCBoZWlnaHQ7IHJvd0luZGV4KyspIHtcbiAgICAgIGNvbnN0IGluc2VydGlvbkNvc3QgPSByb3dJbmRleCA9PT0gKGhlaWdodCAtIDEpID8gZWRpdENvc3RzLnBvc3RRdWVyeUluc2VydGlvbiA6IGVkaXRDb3N0cy5pbnNlcnRpb247XG4gICAgICBmb3IgKGxldCBjb2x1bW5JbmRleCA9IDE7IGNvbHVtbkluZGV4IDwgd2lkdGg7IGNvbHVtbkluZGV4KyspIHtcbiAgICAgICAgY29uc3QgZG9lc1N1YnN0aXR1dGlvblJlcGxhY2UgPSBxdWVyeVtyb3dJbmRleCAtIDFdICE9PSBzdWJqZWN0W2NvbHVtbkluZGV4IC0gMV07XG4gICAgICAgIGNvbnN0IHN1YnN0aXR1dGlvbkNvc3QgPSBkb2VzU3Vic3RpdHV0aW9uUmVwbGFjZSA/IGVkaXRDb3N0cy5zdWJzdGl0dXRpb24gOiAwO1xuICAgICAgICBjb25zdCBvcGVyYXRpb25Db3N0cyA9IFtcbiAgICAgICAgICBtYXRyaXhbcm93SW5kZXggLSAxXVtjb2x1bW5JbmRleF0gKyBlZGl0Q29zdHMuZGVsZXRpb24sXG4gICAgICAgICAgbWF0cml4W3Jvd0luZGV4XVtjb2x1bW5JbmRleCAtIDFdICsgaW5zZXJ0aW9uQ29zdCxcbiAgICAgICAgICBtYXRyaXhbcm93SW5kZXggLSAxXVtjb2x1bW5JbmRleCAtIDFdICsgc3Vic3RpdHV0aW9uQ29zdCxcbiAgICAgICAgXTtcbiAgICAgICAgY29uc3Qgb3BlcmF0aW9uSW5kZXggPSBnZXRNaW5JbmRleChvcGVyYXRpb25Db3N0cyk7XG4gICAgICAgIG1hdHJpeFtyb3dJbmRleF1bY29sdW1uSW5kZXhdID0gb3BlcmF0aW9uQ29zdHNbb3BlcmF0aW9uSW5kZXhdO1xuICAgICAgICBpZiAob3BlcmF0aW9uSW5kZXggPT09IDIgJiYgIWRvZXNTdWJzdGl0dXRpb25SZXBsYWNlKSB7XG4gICAgICAgICAgb3BlcmF0aW9uTWF0cml4W3Jvd0luZGV4XVtjb2x1bW5JbmRleF0gPSAzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG9wZXJhdGlvbk1hdHJpeFtyb3dJbmRleF1bY29sdW1uSW5kZXhdID0gb3BlcmF0aW9uSW5kZXg7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9wZXJhdGlvbk1hdHJpeDtcbiAgfVxuXG4gIC8qKlxuICAgKiBnZXRJbml0aWFsT3BlcmF0aW9uTWF0cml4XG4gICAqIEByZXR1cm4ge251bWJlcltdfVxuICAgKi9cbiAgcHVibGljIGdldEluaXRpYWxPcGVyYXRpb25NYXRyaXgoaGVpZ2h0OiBudW1iZXIsIHdpZHRoOiBudW1iZXIpOiBudW1iZXJbXVtdIHtcbiAgICBjb25zdCBmaXJzdFJvdyA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgd2lkdGg7IGkrKykge1xuICAgICAgZmlyc3RSb3cucHVzaCgxKTtcbiAgICB9XG5cbiAgICBjb25zdCBvcGVyYXRpb25NYXRyaXggPSBbZmlyc3RSb3ddO1xuICAgIGZvcihsZXQgaSA9IDE7IGkgPCBoZWlnaHQ7IGkrKykge1xuICAgICAgY29uc3Qgcm93ID0gbmV3IEFycmF5KHdpZHRoKTtcbiAgICAgIHJvd1swXSA9IDA7XG4gICAgICBvcGVyYXRpb25NYXRyaXgucHVzaChyb3cpO1xuICAgIH1cbiAgICByZXR1cm4gb3BlcmF0aW9uTWF0cml4O1xuICB9XG5cbiAgLyoqXG4gICAqIGdldE1hdGNoUmFuZ2VzXG4gICAqIG9wZXJhdGlvbk1hdHJpeCBudW1iZXJzIHN0YW5kIGZvciB7IDA6IGRlbGV0ZSwgMTogaW5zZXJ0LCAyOiBzdWIsIDM6IG5vb3AgfVxuICAgKiBAcmV0dXJuIHtudW1iZXJbXX1cbiAgICovXG4gIHB1YmxpYyBnZXRNYXRjaFJhbmdlcyhvcGVyYXRpb25NYXRyaXg6IG51bWJlcltdW10pOiBBcnJheTxudW1iZXJbXVtdPiB7XG4gICAgbGV0IHlMb2MgPSBvcGVyYXRpb25NYXRyaXgubGVuZ3RoIC0gMTtcbiAgICBsZXQgeExvYyA9IG9wZXJhdGlvbk1hdHJpeFswXS5sZW5ndGggLSAxO1xuICAgIGxldCBtYXRjaFJhbmdlczogbnVtYmVyW11bXSA9IFtdO1xuICAgIGxldCByYW5nZTogbnVtYmVyW107XG5cbiAgICBsZXQgdHJhdmVyc2VkQ2VsbHMgPSBbWzAsIDBdXTtcblxuICAgIHdoaWxlICh5TG9jICE9PSAwIHx8IHhMb2MgIT09IDApIHtcbiAgICAgIHRyYXZlcnNlZENlbGxzLnB1c2goW3lMb2MsIHhMb2NdKTtcbiAgICAgIHN3aXRjaChvcGVyYXRpb25NYXRyaXhbeUxvY11beExvY10pIHtcbiAgICAgICAgY2FzZSAwOlxuICAgICAgICAgIHlMb2MtLVxuICAgICAgICAgIC8vIGRlbGV0aW5nIGEgY2hhcmFjdGVyIGZyb20gc3ViamVjdCBkb2VzIG5vdCBicmVhayB0aGUgbWF0Y2hSYW5nZSBzdHJlYWtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgIHhMb2MtLTtcbiAgICAgICAgICBpZiAocmFuZ2UpIHtcbiAgICAgICAgICAgIG1hdGNoUmFuZ2VzLnB1c2gocmFuZ2UpO1xuICAgICAgICAgICAgcmFuZ2UgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgeUxvYy0tO1xuICAgICAgICAgIHhMb2MtLTtcbiAgICAgICAgICBpZiAocmFuZ2UpIHtcbiAgICAgICAgICAgIG1hdGNoUmFuZ2VzLnB1c2gocmFuZ2UpO1xuICAgICAgICAgICAgcmFuZ2UgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgeUxvYy0tO1xuICAgICAgICAgIHhMb2MtLTtcbiAgICAgICAgICBpZiAocmFuZ2UpIHtcbiAgICAgICAgICAgIC8vIGNvbnRpbnVlcyBtYXRjaFJhbmdlIHN0cmVha1xuICAgICAgICAgICAgcmFuZ2VbMF0gPSB4TG9jO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBzdGFydHMgdGhlIG1hdGNoUmFuZ2Ugc3RyZWFrXG4gICAgICAgICAgICByYW5nZSA9IFt4TG9jLCB4TG9jXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChyYW5nZSkge1xuICAgICAgbWF0Y2hSYW5nZXMucHVzaChyYW5nZSk7XG4gICAgfVxuICAgIHJldHVybiBbbWF0Y2hSYW5nZXMucmV2ZXJzZSgpLCB0cmF2ZXJzZWRDZWxsc107XG4gIH1cblxufVxuXG5mdW5jdGlvbiBnZXQoXG4gIGl0ZW06IGFueSxcbiAga2V5c1N0cmluZzogc3RyaW5nLFxuKSB7XG4gIGNvbnN0IGtleXMgPSBrZXlzU3RyaW5nLnNwbGl0KCcuJyk7XG4gIGZvcihsZXQgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYoaXRlbSA9PT0gdW5kZWZpbmVkIHx8IGl0ZW0gPT09IG51bGwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaXRlbSA9IGl0ZW1ba2V5c1tpXV1cbiAgfVxuICByZXR1cm4gaXRlbTtcbn1cblxuZnVuY3Rpb24gdW5pcUJ5KFxuICBpdGVtczogYW55W10sXG4gIGdldEl0ZW1LZXk6IChpdGVtOiBhbnkpID0+IGFueSA9IGlkZW50aXR5LFxuKSB7XG4gIGNvbnN0IGl0ZW1LZXlTZXQgPSBuZXcgU2V0KCk7XG4gIHJldHVybiBpdGVtcy5maWx0ZXIoKGl0ZW06IGFueSkgPT4ge1xuICAgIGNvbnN0IGtleSA9IGdldEl0ZW1LZXkoaXRlbSk7XG4gICAgaWYgKGl0ZW1LZXlTZXQuaGFzKGtleSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgaXRlbUtleVNldC5hZGQoa2V5KTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfSlcbn1cblxuZnVuY3Rpb24gaWRlbnRpdHkoaXRlbTogYW55KSB7XG4gIHJldHVybiBpdGVtO1xufVxuXG5mdW5jdGlvbiBnZXRNaW5JbmRleChudW1iZXJzOiBudW1iZXJbXSk6IG51bWJlciB7XG4gIGxldCBtaW5JbmRleCA9IDA7XG4gIGxldCBtaW5WYWx1ZSA9IG51bWJlcnNbMF07XG4gIGZvciAobGV0IG5leHRJbmRleCA9IDE7IG5leHRJbmRleCA8IG51bWJlcnMubGVuZ3RoOyBuZXh0SW5kZXgrKykge1xuICAgIGNvbnN0IG5leHRWYWx1ZSA9IG51bWJlcnNbbmV4dEluZGV4XTtcbiAgICBpZiAobmV4dFZhbHVlIDwgbWluVmFsdWUpIHtcbiAgICAgIG1pbkluZGV4ID0gbmV4dEluZGV4O1xuICAgICAgbWluVmFsdWUgPSBuZXh0VmFsdWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBtaW5JbmRleDtcbn1cbiJdfQ==