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

    _defineProperty(this, "disableDiagnostics", false);

    _defineProperty(this, "disableStyledString", false);
  }

  _createClass(Fuzz, [{
    key: "search",
    value: function search(items, query) {
      var _this = this;

      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      Object.assign(this, options);
      var fuzzItems = this.getScoredFuzzItems(items, query, this.subjectKeys);

      if (!this.disableDiagnostics) {
        this.diagnostics.indexFuzzItems(fuzzItems);
      }

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

        if (!_this2.disableStyledString) {
          fuzzItem.styledString = _this2.stringStyler.styleWithTags(fuzzItem.subject, matchRanges, _this2.startDecorator, _this2.endDecorator);
        }

        if (!_this2.disableDiagnostics) {
          _this2.diagnostics.setFuzzalyticsForFuzzItem(fuzzItem, {
            editMatrix: editMatrix,
            operationMatrix: operationMatrix,
            traversedCells: traversedCells,
            worstPossibleEditDistance: worstPossibleEditDistance
          });
        }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mdXp6LmNsYXNzLnRzIl0sIm5hbWVzIjpbIkZ1enoiLCJpdGVtcyIsImZka2YiLCJGdXp6RGVlcEtleUZpbmRlciIsImdldEFsbEtleXMiLCJxdWVyeSIsIm9wdGlvbnMiLCJzZWFyY2giLCJtYXAiLCJmdXp6SXRlbSIsIm9yaWdpbmFsIiwiZnV6eiIsInN0cmluZ1N0eWxlciIsIkZ1enpTdHJpbmdTdHlsZXIiLCJrZXlGaW5kZXIiLCJkaWFnbm9zdGljcyIsIkZ1enpEaWFnbm9zdGljcyIsIkRFRkFVTFRfRURJVF9DT1NUUyIsIk9iamVjdCIsImFzc2lnbiIsImZ1enpJdGVtcyIsImdldFNjb3JlZEZ1enpJdGVtcyIsInN1YmplY3RLZXlzIiwiZGlzYWJsZURpYWdub3N0aWNzIiwiaW5kZXhGdXp6SXRlbXMiLCJza2lwRmlsdGVyIiwiZmlsdGVyIiwic2NvcmUiLCJmaWx0ZXJUaHJlc2hvbGQiLCJza2lwU29ydCIsInNvcnQiLCJhIiwiYiIsInVuaXFCeSIsImxlbmd0aCIsImdldEZ1enpJdGVtcyIsInNjb3JlRnV6ekl0ZW1zIiwiZm9yRWFjaCIsIml0ZW0iLCJrZXkiLCJzdWJqZWN0IiwiZ2V0IiwidW5kZWZpbmVkIiwicHVzaCIsIlN0cmluZyIsImVkaXRNYXRyaXgiLCJnZXRJbml0aWFsRWRpdE1hdHJpeCIsImVkaXRDb3N0cyIsIm9wZXJhdGlvbk1hdHJpeCIsImZpbGxFZGl0TWF0cml4IiwiY2FzZVNlbnNpdGl2ZSIsInRvTG93ZXJDYXNlIiwiZ2V0TWF0Y2hSYW5nZXMiLCJtYXRjaFJhbmdlcyIsInRyYXZlcnNlZENlbGxzIiwid29yc3RQb3NzaWJsZUVkaXREaXN0YW5jZSIsImRlbGV0aW9uIiwicHJlUXVlcnlJbnNlcnRpb24iLCJNYXRoIiwibWluIiwicG9zdFF1ZXJ5SW5zZXJ0aW9uIiwiZWRpdERpc3RhbmNlIiwiZGlzYWJsZVN0eWxlZFN0cmluZyIsInN0eWxlZFN0cmluZyIsInN0eWxlV2l0aFRhZ3MiLCJzdGFydERlY29yYXRvciIsImVuZERlY29yYXRvciIsInNldEZ1enphbHl0aWNzRm9yRnV6ekl0ZW0iLCJoZWlnaHQiLCJ3aWR0aCIsImZpcnN0Um93IiwiaSIsImluaXRpYWxFZGl0TWF0cml4Iiwicm93IiwiQXJyYXkiLCJtYXRyaXgiLCJnZXRJbml0aWFsT3BlcmF0aW9uTWF0cml4Iiwicm93SW5kZXgiLCJpbnNlcnRpb25Db3N0IiwiaW5zZXJ0aW9uIiwiY29sdW1uSW5kZXgiLCJkb2VzU3Vic3RpdHV0aW9uUmVwbGFjZSIsInN1YnN0aXR1dGlvbkNvc3QiLCJzdWJzdGl0dXRpb24iLCJvcGVyYXRpb25Db3N0cyIsIm9wZXJhdGlvbkluZGV4IiwiZ2V0TWluSW5kZXgiLCJ5TG9jIiwieExvYyIsInJhbmdlIiwicmV2ZXJzZSIsImtleXNTdHJpbmciLCJrZXlzIiwic3BsaXQiLCJnZXRJdGVtS2V5IiwiaWRlbnRpdHkiLCJpdGVtS2V5U2V0IiwiU2V0IiwiaGFzIiwiYWRkIiwibnVtYmVycyIsIm1pbkluZGV4IiwibWluVmFsdWUiLCJuZXh0SW5kZXgiLCJuZXh0VmFsdWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQTs7O0lBR2FBLEk7Ozs7OytCQVVlQyxLLEVBQWM7QUFDdEMsVUFBTUMsSUFBSSxHQUFHLElBQUlDLG9DQUFKLEVBQWI7QUFDQSxhQUFPRCxJQUFJLENBQUNFLFVBQUwsQ0FBZ0JILEtBQWhCLENBQVA7QUFDRDs7OzJCQUdDQSxLLEVBQ0FJLEssRUFFQTtBQUFBLFVBREFDLE9BQ0EsdUVBRHlCLEVBQ3pCO0FBQ0EsYUFBT04sSUFBSSxDQUFDTyxNQUFMLENBQ0xOLEtBREssRUFFTEksS0FGSyxFQUdMQyxPQUhLLEVBSUxFLEdBSkssQ0FJRCxVQUFDQyxRQUFEO0FBQUEsZUFBd0JBLFFBQVEsQ0FBQ0MsUUFBakM7QUFBQSxPQUpDLENBQVA7QUFLRDs7OzJCQUdDVCxLLEVBQ0FJLEssRUFFQTtBQUFBLFVBREFDLE9BQ0EsdUVBRHlC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cUJjLE9BQXJCLEVBQWdEO0FBQzlDLE1BQUlDLFFBQVEsR0FBRyxDQUFmO0FBQ0EsTUFBSUMsUUFBUSxHQUFHRixPQUFPLENBQUMsQ0FBRCxDQUF0Qjs7QUFDQSxPQUFLLElBQUlHLFNBQVMsR0FBRyxDQUFyQixFQUF3QkEsU0FBUyxHQUFHSCxPQUFPLENBQUNsRSxNQUE1QyxFQUFvRHFFLFNBQVMsRUFBN0QsRUFBaUU7QUFDL0QsUUFBTUMsU0FBUyxHQUFHSixPQUFPLENBQUNHLFNBQUQsQ0FBekI7O0FBQ0EsUUFBSUMsU0FBUyxHQUFHRixRQUFoQixFQUEwQjtBQUN4QkQsTUFBQUEsUUFBUSxHQUFHRSxTQUFYO0FBQ0FELE1BQUFBLFFBQVEsR0FBR0UsU0FBWDtBQUNEO0FBQ0Y7O0FBQ0QsU0FBT0gsUUFBUDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRWRpdENvc3RzLCBGdXp6SXRlbSB9IGZyb20gJy4vbW9kZWxzL2luZGV4JztcbmltcG9ydCB7IEZ1enpTdHJpbmdTdHlsZXIgfSBmcm9tICcuL2Z1enotc3RyaW5nLXN0eWxlci5jbGFzcyc7XG5pbXBvcnQgeyBGdXp6RGVlcEtleUZpbmRlciB9IGZyb20gJy4vZnV6ei1kZWVwLWtleS1maW5kZXIuY2xhc3MnO1xuaW1wb3J0IHsgRnV6ekRpYWdub3N0aWNzLCBGdXp6YWx5dGljcyB9IGZyb20gJy4vZnV6ei1kaWFnbm9zdGljcy5jbGFzcydcblxuLyoqXG4gKiBGdXp6XG4gKi9cbmV4cG9ydCBjbGFzcyBGdXp6IHtcblxuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IERFRkFVTFRfRURJVF9DT1NUUzogRWRpdENvc3RzID0ge1xuICAgIHN1YnN0aXR1dGlvbjogMTAxLFxuICAgIGRlbGV0aW9uOiAxMDAsXG4gICAgaW5zZXJ0aW9uOiAxMDAsXG4gICAgcHJlUXVlcnlJbnNlcnRpb246IDEsXG4gICAgcG9zdFF1ZXJ5SW5zZXJ0aW9uOiAwLFxuICB9XG5cbiAgcHVibGljIHN0YXRpYyBnZXRBbGxLZXlzIChpdGVtczogYW55W10pIHtcbiAgICBjb25zdCBmZGtmID0gbmV3IEZ1enpEZWVwS2V5RmluZGVyKCk7XG4gICAgcmV0dXJuIGZka2YuZ2V0QWxsS2V5cyhpdGVtcyk7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIGZpbHRlcihcbiAgICBpdGVtczogYW55W10sXG4gICAgcXVlcnk6IHN0cmluZyxcbiAgICBvcHRpb25zOiBQYXJ0aWFsPEZ1eno+ID0ge30sXG4gICkge1xuICAgIHJldHVybiBGdXp6LnNlYXJjaChcbiAgICAgIGl0ZW1zLFxuICAgICAgcXVlcnksXG4gICAgICBvcHRpb25zLFxuICAgICkubWFwKChmdXp6SXRlbTogRnV6ekl0ZW0pID0+IGZ1enpJdGVtLm9yaWdpbmFsKTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgc2VhcmNoKFxuICAgIGl0ZW1zOiBhbnlbXSxcbiAgICBxdWVyeTogc3RyaW5nLFxuICAgIG9wdGlvbnM6IFBhcnRpYWw8RnV6ej4gPSB7fSxcbiAgKSB7XG4gICAgY29uc3QgZnV6eiA9IG5ldyBGdXp6KCk7XG4gICAgcmV0dXJuIGZ1enouc2VhcmNoKGl0ZW1zLCBxdWVyeSwgb3B0aW9ucyk7XG4gIH1cblxuICBwdWJsaWMgc3ViamVjdEtleXM6IHN0cmluZ1tdID0gW107XG4gIHB1YmxpYyBjYXNlU2Vuc2l0aXZlOiBib29sZWFuID0gZmFsc2U7XG4gIHB1YmxpYyBza2lwRmlsdGVyOiBib29sZWFuID0gZmFsc2U7XG4gIHB1YmxpYyBza2lwU29ydDogYm9vbGVhbiA9IGZhbHNlO1xuICBwdWJsaWMgc3RhcnREZWNvcmF0b3IgPSAnPGI+JztcbiAgcHVibGljIGVuZERlY29yYXRvciA9ICc8L2I+JztcbiAgcHVibGljIGZpbHRlclRocmVzaG9sZDogbnVtYmVyID0gMC40O1xuICBwdWJsaWMgZWRpdENvc3RzOiBFZGl0Q29zdHMgPSB7IC4uLkZ1enouREVGQVVMVF9FRElUX0NPU1RTIH07XG4gIHB1YmxpYyBkaXNhYmxlRGlhZ25vc3RpY3MgPSBmYWxzZTtcbiAgcHVibGljIGRpc2FibGVTdHlsZWRTdHJpbmcgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgc3RyaW5nU3R5bGVyOiBGdXp6U3RyaW5nU3R5bGVyID0gbmV3IEZ1enpTdHJpbmdTdHlsZXIoKSxcbiAgICBwdWJsaWMga2V5RmluZGVyOiBGdXp6RGVlcEtleUZpbmRlciA9IG5ldyBGdXp6RGVlcEtleUZpbmRlcigpLFxuICAgIHB1YmxpYyBkaWFnbm9zdGljczogRnV6ekRpYWdub3N0aWNzID0gbmV3IEZ1enpEaWFnbm9zdGljcygpLFxuICApIHt9XG5cbiAgcHVibGljIHNlYXJjaChcbiAgICBpdGVtczogYW55W10sXG4gICAgcXVlcnk6IHN0cmluZyxcbiAgICBvcHRpb25zOiBQYXJ0aWFsPEZ1eno+ID0ge30sXG4gICkge1xuICAgIE9iamVjdC5hc3NpZ24odGhpcywgb3B0aW9ucyk7XG5cbiAgICBsZXQgZnV6ekl0ZW1zID0gdGhpcy5nZXRTY29yZWRGdXp6SXRlbXMoaXRlbXMsIHF1ZXJ5LCB0aGlzLnN1YmplY3RLZXlzKTtcbiAgICBpZiAoIXRoaXMuZGlzYWJsZURpYWdub3N0aWNzKSB7XG4gICAgICAgIHRoaXMuZGlhZ25vc3RpY3MuaW5kZXhGdXp6SXRlbXMoZnV6ekl0ZW1zKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuc2tpcEZpbHRlciAmJiBxdWVyeSkge1xuICAgICAgZnV6ekl0ZW1zID0gZnV6ekl0ZW1zLmZpbHRlcigoZnV6ekl0ZW06IEZ1enpJdGVtKSA9PiBmdXp6SXRlbS5zY29yZSA+PSB0aGlzLmZpbHRlclRocmVzaG9sZCk7XG4gICAgfVxuICAgIGlmICghdGhpcy5za2lwU29ydCkge1xuICAgICAgZnV6ekl0ZW1zLnNvcnQoKGE6IEZ1enpJdGVtLCBiOiBGdXp6SXRlbSkgPT4gYi5zY29yZSAtIGEuc2NvcmUpO1xuICAgIH1cbiAgICByZXR1cm4gdW5pcUJ5KGZ1enpJdGVtcywgKGZ1enpJdGVtOiBGdXp6SXRlbSkgPT4gZnV6ekl0ZW0ub3JpZ2luYWwpO1xuICB9XG5cbiAgcHVibGljIGdldFNjb3JlZEZ1enpJdGVtcyhcbiAgICBpdGVtczogYW55W10sXG4gICAgcXVlcnk6IHN0cmluZyxcbiAgICBzdWJqZWN0S2V5czogc3RyaW5nW10gPSBbXSxcbiAgKTogRnV6ekl0ZW1bXSB7XG4gICAgc3ViamVjdEtleXMgPSBzdWJqZWN0S2V5cy5sZW5ndGhcbiAgICAgID8gc3ViamVjdEtleXNcbiAgICAgIDogdGhpcy5rZXlGaW5kZXIuZ2V0QWxsS2V5cyhpdGVtcyk7XG5cbiAgICBjb25zdCBmdXp6SXRlbXM6IEZ1enpJdGVtW10gPSB0aGlzLmdldEZ1enpJdGVtcyhpdGVtcywgc3ViamVjdEtleXMsIHF1ZXJ5KTtcbiAgICB0aGlzLnNjb3JlRnV6ekl0ZW1zKGZ1enpJdGVtcyk7XG4gICAgcmV0dXJuIGZ1enpJdGVtcztcbiAgfVxuXG4gIHB1YmxpYyBnZXRGdXp6SXRlbXMoXG4gICAgaXRlbXM6IGFueVtdLFxuICAgIHN1YmplY3RLZXlzOiBzdHJpbmdbXSxcbiAgICBxdWVyeTogc3RyaW5nXG4gICk6IEZ1enpJdGVtW10ge1xuICAgIGNvbnN0IGZ1enpJdGVtczogRnV6ekl0ZW1bXSA9IFtdO1xuICAgIGl0ZW1zLmZvckVhY2goKGl0ZW06IGFueSkgPT4ge1xuICAgICAgc3ViamVjdEtleXMuZm9yRWFjaCgoa2V5OiBzdHJpbmcpID0+IHtcbiAgICAgICAgY29uc3Qgc3ViamVjdCA9IGdldChpdGVtLCBrZXkpO1xuICAgICAgICBpZiAoc3ViamVjdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGZ1enpJdGVtcy5wdXNoKHtcbiAgICAgICAgICBvcmlnaW5hbDogaXRlbSxcbiAgICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgICBzdWJqZWN0OiBTdHJpbmcoc3ViamVjdCksXG4gICAgICAgICAgcXVlcnk6IFN0cmluZyhxdWVyeSksXG4gICAgICAgIH0gYXMgRnV6ekl0ZW0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGZ1enpJdGVtcztcbiAgfVxuXG4gIHB1YmxpYyBzY29yZUZ1enpJdGVtcyhmdXp6SXRlbXM6IEZ1enpJdGVtW10pIHtcbiAgICBmdXp6SXRlbXMuZm9yRWFjaCgoZnV6ekl0ZW06IEZ1enpJdGVtKSA9PiB7XG4gICAgICBjb25zdCBlZGl0TWF0cml4ID0gdGhpcy5nZXRJbml0aWFsRWRpdE1hdHJpeChcbiAgICAgICAgZnV6ekl0ZW0ucXVlcnksXG4gICAgICAgIGZ1enpJdGVtLnN1YmplY3QsXG4gICAgICAgIHRoaXMuZWRpdENvc3RzLFxuICAgICAgKTtcbiAgICAgIGNvbnN0IG9wZXJhdGlvbk1hdHJpeCA9IHRoaXMuZmlsbEVkaXRNYXRyaXgoXG4gICAgICAgIGVkaXRNYXRyaXgsXG4gICAgICAgIHRoaXMuY2FzZVNlbnNpdGl2ZSA/IGZ1enpJdGVtLnF1ZXJ5IDogZnV6ekl0ZW0ucXVlcnkudG9Mb3dlckNhc2UoKSxcbiAgICAgICAgdGhpcy5jYXNlU2Vuc2l0aXZlID8gZnV6ekl0ZW0uc3ViamVjdCA6IGZ1enpJdGVtLnN1YmplY3QudG9Mb3dlckNhc2UoKSxcbiAgICAgICAgdGhpcy5lZGl0Q29zdHMsXG4gICAgICApO1xuICAgICAgY29uc3QgW21hdGNoUmFuZ2VzLCB0cmF2ZXJzZWRDZWxsc10gPSB0aGlzLmdldE1hdGNoUmFuZ2VzKG9wZXJhdGlvbk1hdHJpeCk7XG5cbiAgICAgIGxldCB3b3JzdFBvc3NpYmxlRWRpdERpc3RhbmNlID0gZnV6ekl0ZW0ucXVlcnkubGVuZ3RoICogdGhpcy5lZGl0Q29zdHMuZGVsZXRpb247XG4gICAgICBpZiAoIWZ1enpJdGVtLnF1ZXJ5Lmxlbmd0aCkge1xuICAgICAgICB3b3JzdFBvc3NpYmxlRWRpdERpc3RhbmNlICs9IChmdXp6SXRlbS5zdWJqZWN0Lmxlbmd0aCAqIHRoaXMuZWRpdENvc3RzLnByZVF1ZXJ5SW5zZXJ0aW9uKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdvcnN0UG9zc2libGVFZGl0RGlzdGFuY2UgKz0gKGZ1enpJdGVtLnN1YmplY3QubGVuZ3RoICogTWF0aC5taW4odGhpcy5lZGl0Q29zdHMucG9zdFF1ZXJ5SW5zZXJ0aW9uLCB0aGlzLmVkaXRDb3N0cy5wcmVRdWVyeUluc2VydGlvbikpO1xuICAgICAgfVxuXG4gICAgICBmdXp6SXRlbS5lZGl0RGlzdGFuY2UgPSBlZGl0TWF0cml4W2VkaXRNYXRyaXgubGVuZ3RoIC0gMV1bZWRpdE1hdHJpeFswXS5sZW5ndGggLSAxXTtcbiAgICAgIGZ1enpJdGVtLnNjb3JlID0gKHdvcnN0UG9zc2libGVFZGl0RGlzdGFuY2UgPT09IDApXG4gICAgICAgID8gMVxuICAgICAgICA6IDEgLSAoZnV6ekl0ZW0uZWRpdERpc3RhbmNlIC8gd29yc3RQb3NzaWJsZUVkaXREaXN0YW5jZSk7XG5cbiAgICAgIGZ1enpJdGVtLm1hdGNoUmFuZ2VzID0gbWF0Y2hSYW5nZXM7XG5cbiAgICAgIGlmICghdGhpcy5kaXNhYmxlU3R5bGVkU3RyaW5nKSB7XG4gICAgICAgIGZ1enpJdGVtLnN0eWxlZFN0cmluZyA9IHRoaXMuc3RyaW5nU3R5bGVyLnN0eWxlV2l0aFRhZ3MoXG4gICAgICAgICAgZnV6ekl0ZW0uc3ViamVjdCxcbiAgICAgICAgICBtYXRjaFJhbmdlcyxcbiAgICAgICAgICB0aGlzLnN0YXJ0RGVjb3JhdG9yLFxuICAgICAgICAgIHRoaXMuZW5kRGVjb3JhdG9yLFxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXRoaXMuZGlzYWJsZURpYWdub3N0aWNzKSB7XG4gICAgICAgIHRoaXMuZGlhZ25vc3RpY3Muc2V0RnV6emFseXRpY3NGb3JGdXp6SXRlbShcbiAgICAgICAgICBmdXp6SXRlbSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBlZGl0TWF0cml4LFxuICAgICAgICAgICAgb3BlcmF0aW9uTWF0cml4LFxuICAgICAgICAgICAgdHJhdmVyc2VkQ2VsbHMsXG4gICAgICAgICAgICB3b3JzdFBvc3NpYmxlRWRpdERpc3RhbmNlLFxuICAgICAgICAgIH0sXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgZ2V0SW5pdGlhbEVkaXRNYXRyaXgoXG4gICAgcXVlcnk6IHN0cmluZyxcbiAgICBzdWJqZWN0OiBzdHJpbmcsXG4gICAgZWRpdENvc3RzOiBFZGl0Q29zdHMsXG4gICk6IG51bWJlcltdW10ge1xuICAgIGNvbnN0IGhlaWdodCA9IHF1ZXJ5Lmxlbmd0aCArIDE7XG4gICAgY29uc3Qgd2lkdGggPSBzdWJqZWN0Lmxlbmd0aCArIDE7XG5cbiAgICBjb25zdCBmaXJzdFJvdyA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgd2lkdGg7IGkrKykge1xuICAgICAgZmlyc3RSb3cucHVzaChpICogZWRpdENvc3RzLnByZVF1ZXJ5SW5zZXJ0aW9uKTtcbiAgICB9XG5cbiAgICBjb25zdCBpbml0aWFsRWRpdE1hdHJpeCA9IFtmaXJzdFJvd107XG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCBoZWlnaHQ7IGkrKykge1xuICAgICAgY29uc3Qgcm93ID0gbmV3IEFycmF5KHdpZHRoKTtcbiAgICAgIHJvd1swXSA9IGkgKiBlZGl0Q29zdHMuZGVsZXRpb247XG4gICAgICBpbml0aWFsRWRpdE1hdHJpeC5wdXNoKHJvdyk7XG4gICAgfVxuICAgIHJldHVybiBpbml0aWFsRWRpdE1hdHJpeDtcbiAgfVxuXG4gIC8qKlxuICAgKiBmaWxsRWRpdE1hdHJpeFxuICAgKiB0b2RvOiByZXVzZSBtYXRyaWNlcyB0byByZWR1Y2UgZ2NcbiAgICogQHJldHVybiB7bnVtYmVyW119XG4gICAqL1xuICBwdWJsaWMgZmlsbEVkaXRNYXRyaXgoXG4gICAgbWF0cml4OiBudW1iZXJbXVtdLFxuICAgIHF1ZXJ5OiBzdHJpbmcsXG4gICAgc3ViamVjdDogc3RyaW5nLFxuICAgIGVkaXRDb3N0czogRWRpdENvc3RzLFxuICApOiBudW1iZXJbXVtdIHtcbiAgICBjb25zdCBoZWlnaHQgPSBtYXRyaXgubGVuZ3RoO1xuICAgIGNvbnN0IHdpZHRoID0gbWF0cml4WzBdLmxlbmd0aDtcbiAgICBjb25zdCBvcGVyYXRpb25NYXRyaXggPSB0aGlzLmdldEluaXRpYWxPcGVyYXRpb25NYXRyaXgoaGVpZ2h0LCB3aWR0aCk7XG4gICAgZm9yIChsZXQgcm93SW5kZXggPSAxOyByb3dJbmRleCA8IGhlaWdodDsgcm93SW5kZXgrKykge1xuICAgICAgY29uc3QgaW5zZXJ0aW9uQ29zdCA9IHJvd0luZGV4ID09PSAoaGVpZ2h0IC0gMSkgPyBlZGl0Q29zdHMucG9zdFF1ZXJ5SW5zZXJ0aW9uIDogZWRpdENvc3RzLmluc2VydGlvbjtcbiAgICAgIGZvciAobGV0IGNvbHVtbkluZGV4ID0gMTsgY29sdW1uSW5kZXggPCB3aWR0aDsgY29sdW1uSW5kZXgrKykge1xuICAgICAgICBjb25zdCBkb2VzU3Vic3RpdHV0aW9uUmVwbGFjZSA9IHF1ZXJ5W3Jvd0luZGV4IC0gMV0gIT09IHN1YmplY3RbY29sdW1uSW5kZXggLSAxXTtcbiAgICAgICAgY29uc3Qgc3Vic3RpdHV0aW9uQ29zdCA9IGRvZXNTdWJzdGl0dXRpb25SZXBsYWNlID8gZWRpdENvc3RzLnN1YnN0aXR1dGlvbiA6IDA7XG4gICAgICAgIGNvbnN0IG9wZXJhdGlvbkNvc3RzID0gW1xuICAgICAgICAgIG1hdHJpeFtyb3dJbmRleCAtIDFdW2NvbHVtbkluZGV4XSArIGVkaXRDb3N0cy5kZWxldGlvbixcbiAgICAgICAgICBtYXRyaXhbcm93SW5kZXhdW2NvbHVtbkluZGV4IC0gMV0gKyBpbnNlcnRpb25Db3N0LFxuICAgICAgICAgIG1hdHJpeFtyb3dJbmRleCAtIDFdW2NvbHVtbkluZGV4IC0gMV0gKyBzdWJzdGl0dXRpb25Db3N0LFxuICAgICAgICBdO1xuICAgICAgICBjb25zdCBvcGVyYXRpb25JbmRleCA9IGdldE1pbkluZGV4KG9wZXJhdGlvbkNvc3RzKTtcbiAgICAgICAgbWF0cml4W3Jvd0luZGV4XVtjb2x1bW5JbmRleF0gPSBvcGVyYXRpb25Db3N0c1tvcGVyYXRpb25JbmRleF07XG4gICAgICAgIGlmIChvcGVyYXRpb25JbmRleCA9PT0gMiAmJiAhZG9lc1N1YnN0aXR1dGlvblJlcGxhY2UpIHtcbiAgICAgICAgICBvcGVyYXRpb25NYXRyaXhbcm93SW5kZXhdW2NvbHVtbkluZGV4XSA9IDM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb3BlcmF0aW9uTWF0cml4W3Jvd0luZGV4XVtjb2x1bW5JbmRleF0gPSBvcGVyYXRpb25JbmRleDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb3BlcmF0aW9uTWF0cml4O1xuICB9XG5cbiAgLyoqXG4gICAqIGdldEluaXRpYWxPcGVyYXRpb25NYXRyaXhcbiAgICogQHJldHVybiB7bnVtYmVyW119XG4gICAqL1xuICBwdWJsaWMgZ2V0SW5pdGlhbE9wZXJhdGlvbk1hdHJpeChoZWlnaHQ6IG51bWJlciwgd2lkdGg6IG51bWJlcik6IG51bWJlcltdW10ge1xuICAgIGNvbnN0IGZpcnN0Um93ID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB3aWR0aDsgaSsrKSB7XG4gICAgICBmaXJzdFJvdy5wdXNoKDEpO1xuICAgIH1cblxuICAgIGNvbnN0IG9wZXJhdGlvbk1hdHJpeCA9IFtmaXJzdFJvd107XG4gICAgZm9yKGxldCBpID0gMTsgaSA8IGhlaWdodDsgaSsrKSB7XG4gICAgICBjb25zdCByb3cgPSBuZXcgQXJyYXkod2lkdGgpO1xuICAgICAgcm93WzBdID0gMDtcbiAgICAgIG9wZXJhdGlvbk1hdHJpeC5wdXNoKHJvdyk7XG4gICAgfVxuICAgIHJldHVybiBvcGVyYXRpb25NYXRyaXg7XG4gIH1cblxuICAvKipcbiAgICogZ2V0TWF0Y2hSYW5nZXNcbiAgICogb3BlcmF0aW9uTWF0cml4IG51bWJlcnMgc3RhbmQgZm9yIHsgMDogZGVsZXRlLCAxOiBpbnNlcnQsIDI6IHN1YiwgMzogbm9vcCB9XG4gICAqIEByZXR1cm4ge251bWJlcltdfVxuICAgKi9cbiAgcHVibGljIGdldE1hdGNoUmFuZ2VzKG9wZXJhdGlvbk1hdHJpeDogbnVtYmVyW11bXSk6IEFycmF5PG51bWJlcltdW10+IHtcbiAgICBsZXQgeUxvYyA9IG9wZXJhdGlvbk1hdHJpeC5sZW5ndGggLSAxO1xuICAgIGxldCB4TG9jID0gb3BlcmF0aW9uTWF0cml4WzBdLmxlbmd0aCAtIDE7XG4gICAgbGV0IG1hdGNoUmFuZ2VzOiBudW1iZXJbXVtdID0gW107XG4gICAgbGV0IHJhbmdlOiBudW1iZXJbXTtcblxuICAgIGxldCB0cmF2ZXJzZWRDZWxscyA9IFtbMCwgMF1dO1xuXG4gICAgd2hpbGUgKHlMb2MgIT09IDAgfHwgeExvYyAhPT0gMCkge1xuICAgICAgdHJhdmVyc2VkQ2VsbHMucHVzaChbeUxvYywgeExvY10pO1xuICAgICAgc3dpdGNoKG9wZXJhdGlvbk1hdHJpeFt5TG9jXVt4TG9jXSkge1xuICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgeUxvYy0tXG4gICAgICAgICAgLy8gZGVsZXRpbmcgYSBjaGFyYWN0ZXIgZnJvbSBzdWJqZWN0IGRvZXMgbm90IGJyZWFrIHRoZSBtYXRjaFJhbmdlIHN0cmVha1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgeExvYy0tO1xuICAgICAgICAgIGlmIChyYW5nZSkge1xuICAgICAgICAgICAgbWF0Y2hSYW5nZXMucHVzaChyYW5nZSk7XG4gICAgICAgICAgICByYW5nZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICB5TG9jLS07XG4gICAgICAgICAgeExvYy0tO1xuICAgICAgICAgIGlmIChyYW5nZSkge1xuICAgICAgICAgICAgbWF0Y2hSYW5nZXMucHVzaChyYW5nZSk7XG4gICAgICAgICAgICByYW5nZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICB5TG9jLS07XG4gICAgICAgICAgeExvYy0tO1xuICAgICAgICAgIGlmIChyYW5nZSkge1xuICAgICAgICAgICAgLy8gY29udGludWVzIG1hdGNoUmFuZ2Ugc3RyZWFrXG4gICAgICAgICAgICByYW5nZVswXSA9IHhMb2M7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIHN0YXJ0cyB0aGUgbWF0Y2hSYW5nZSBzdHJlYWtcbiAgICAgICAgICAgIHJhbmdlID0gW3hMb2MsIHhMb2NdO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHJhbmdlKSB7XG4gICAgICBtYXRjaFJhbmdlcy5wdXNoKHJhbmdlKTtcbiAgICB9XG4gICAgcmV0dXJuIFttYXRjaFJhbmdlcy5yZXZlcnNlKCksIHRyYXZlcnNlZENlbGxzXTtcbiAgfVxuXG59XG5cbmZ1bmN0aW9uIGdldChcbiAgaXRlbTogYW55LFxuICBrZXlzU3RyaW5nOiBzdHJpbmcsXG4pIHtcbiAgY29uc3Qga2V5cyA9IGtleXNTdHJpbmcuc3BsaXQoJy4nKTtcbiAgZm9yKGxldCBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICBpZihpdGVtID09PSB1bmRlZmluZWQgfHwgaXRlbSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpdGVtID0gaXRlbVtrZXlzW2ldXVxuICB9XG4gIHJldHVybiBpdGVtO1xufVxuXG5mdW5jdGlvbiB1bmlxQnkoXG4gIGl0ZW1zOiBhbnlbXSxcbiAgZ2V0SXRlbUtleTogKGl0ZW06IGFueSkgPT4gYW55ID0gaWRlbnRpdHksXG4pIHtcbiAgY29uc3QgaXRlbUtleVNldCA9IG5ldyBTZXQoKTtcbiAgcmV0dXJuIGl0ZW1zLmZpbHRlcigoaXRlbTogYW55KSA9PiB7XG4gICAgY29uc3Qga2V5ID0gZ2V0SXRlbUtleShpdGVtKTtcbiAgICBpZiAoaXRlbUtleVNldC5oYXMoa2V5KSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICBpdGVtS2V5U2V0LmFkZChrZXkpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9KVxufVxuXG5mdW5jdGlvbiBpZGVudGl0eShpdGVtOiBhbnkpIHtcbiAgcmV0dXJuIGl0ZW07XG59XG5cbmZ1bmN0aW9uIGdldE1pbkluZGV4KG51bWJlcnM6IG51bWJlcltdKTogbnVtYmVyIHtcbiAgbGV0IG1pbkluZGV4ID0gMDtcbiAgbGV0IG1pblZhbHVlID0gbnVtYmVyc1swXTtcbiAgZm9yIChsZXQgbmV4dEluZGV4ID0gMTsgbmV4dEluZGV4IDwgbnVtYmVycy5sZW5ndGg7IG5leHRJbmRleCsrKSB7XG4gICAgY29uc3QgbmV4dFZhbHVlID0gbnVtYmVyc1tuZXh0SW5kZXhdO1xuICAgIGlmIChuZXh0VmFsdWUgPCBtaW5WYWx1ZSkge1xuICAgICAgbWluSW5kZXggPSBuZXh0SW5kZXg7XG4gICAgICBtaW5WYWx1ZSA9IG5leHRWYWx1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG1pbkluZGV4O1xufVxuIl19