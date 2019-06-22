"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Fuzz = void 0;

var _fuzzStringStyler = require("./fuzz-string-styler.class");

var _fuzzDeepKeyFinder = require("./fuzz-deep-key-finder.class");

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

    _classCallCheck(this, Fuzz);

    this.stringStyler = stringStyler;
    this.keyFinder = keyFinder;

    _defineProperty(this, "subjectKeys", []);

    _defineProperty(this, "caseSensitive", false);

    _defineProperty(this, "skipFilter", false);

    _defineProperty(this, "skipSort", false);

    _defineProperty(this, "startDecorator", '<b>');

    _defineProperty(this, "endDecorator", '</b>');

    _defineProperty(this, "filterThreshold", Fuzz.DEFAULT_FILTER_THRESHOLD);

    _defineProperty(this, "editCosts", _objectSpread({}, Fuzz.DEFAULT_EDIT_COSTS));

    _defineProperty(this, "diagnosticsByFuzzItem", new WeakMap());

    _defineProperty(this, "allFuzzItemsByKeyByOriginal", new WeakMap());
  }

  _createClass(Fuzz, [{
    key: "search",
    value: function search(items, query) {
      var _this = this;

      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      Object.assign(this, options);
      var fuzzItems = this.getScoredFuzzItems(items, query, this.subjectKeys); // Used for diagnostics

      fuzzItems.forEach(function (fuzzItem) {
        var fuzzItemsByKey = _this.allFuzzItemsByKeyByOriginal.get(fuzzItem.original);

        if (!fuzzItemsByKey) {
          fuzzItemsByKey = {};
        }

        fuzzItemsByKey[fuzzItem.key] = fuzzItem;

        _this.allFuzzItemsByKeyByOriginal.set(fuzzItem.original, fuzzItemsByKey);
      });

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

        _this2.diagnosticsByFuzzItem.set(fuzzItem, {
          editMatrix: editMatrix,
          operationMatrix: operationMatrix,
          traversedCells: traversedCells
        });

        var worstPossibleEditDistance = fuzzItem.query.length * _this2.editCosts.deletion;

        if (!fuzzItem.query.length) {
          worstPossibleEditDistance += fuzzItem.subject.length * _this2.editCosts.preQueryInsertion;
        } else {
          worstPossibleEditDistance += fuzzItem.subject.length * Math.min(_this2.editCosts.postQueryInsertion, _this2.editCosts.preQueryInsertion);
        }

        fuzzItem.editDistance = editMatrix[editMatrix.length - 1][editMatrix[0].length - 1];
        fuzzItem.score = worstPossibleEditDistance === 0 ? 1 : 1 - fuzzItem.editDistance / worstPossibleEditDistance;
        _this2.diagnosticsByFuzzItem.get(fuzzItem).worstPossibleEditDistance = worstPossibleEditDistance;
        fuzzItem.matchRanges = matchRanges;
        fuzzItem.styledString = _this2.stringStyler.styleWithTags(fuzzItem.subject, matchRanges, _this2.startDecorator, _this2.endDecorator);
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

_defineProperty(Fuzz, "DEFAULT_FILTER_THRESHOLD", 0.4);

_defineProperty(Fuzz, "DEFAULT_EDIT_COSTS", {
  substitution: 101,
  deletion: 100,
  insertion: 100,
  preQueryInsertion: 1,
  postQueryInsertion: 0 // just make this a util function

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mdXp6LmNsYXNzLnRzIl0sIm5hbWVzIjpbIkZ1enoiLCJpdGVtcyIsImZka2YiLCJGdXp6RGVlcEtleUZpbmRlciIsImdldEFsbEtleXMiLCJxdWVyeSIsIm9wdGlvbnMiLCJzZWFyY2giLCJtYXAiLCJmdXp6SXRlbSIsIm9yaWdpbmFsIiwiZnV6eiIsInN0cmluZ1N0eWxlciIsIkZ1enpTdHJpbmdTdHlsZXIiLCJrZXlGaW5kZXIiLCJERUZBVUxUX0ZJTFRFUl9USFJFU0hPTEQiLCJERUZBVUxUX0VESVRfQ09TVFMiLCJXZWFrTWFwIiwiT2JqZWN0IiwiYXNzaWduIiwiZnV6ekl0ZW1zIiwiZ2V0U2NvcmVkRnV6ekl0ZW1zIiwic3ViamVjdEtleXMiLCJmb3JFYWNoIiwiZnV6ekl0ZW1zQnlLZXkiLCJhbGxGdXp6SXRlbXNCeUtleUJ5T3JpZ2luYWwiLCJnZXQiLCJrZXkiLCJzZXQiLCJza2lwRmlsdGVyIiwiZmlsdGVyIiwic2NvcmUiLCJmaWx0ZXJUaHJlc2hvbGQiLCJza2lwU29ydCIsInNvcnQiLCJhIiwiYiIsInVuaXFCeSIsImxlbmd0aCIsImdldEZ1enpJdGVtcyIsInNjb3JlRnV6ekl0ZW1zIiwiaXRlbSIsInN1YmplY3QiLCJ1bmRlZmluZWQiLCJwdXNoIiwiU3RyaW5nIiwiZWRpdE1hdHJpeCIsImdldEluaXRpYWxFZGl0TWF0cml4IiwiZWRpdENvc3RzIiwib3BlcmF0aW9uTWF0cml4IiwiZmlsbEVkaXRNYXRyaXgiLCJjYXNlU2Vuc2l0aXZlIiwidG9Mb3dlckNhc2UiLCJnZXRNYXRjaFJhbmdlcyIsIm1hdGNoUmFuZ2VzIiwidHJhdmVyc2VkQ2VsbHMiLCJkaWFnbm9zdGljc0J5RnV6ekl0ZW0iLCJ3b3JzdFBvc3NpYmxlRWRpdERpc3RhbmNlIiwiZGVsZXRpb24iLCJwcmVRdWVyeUluc2VydGlvbiIsIk1hdGgiLCJtaW4iLCJwb3N0UXVlcnlJbnNlcnRpb24iLCJlZGl0RGlzdGFuY2UiLCJzdHlsZWRTdHJpbmciLCJzdHlsZVdpdGhUYWdzIiwic3RhcnREZWNvcmF0b3IiLCJlbmREZWNvcmF0b3IiLCJoZWlnaHQiLCJ3aWR0aCIsImZpcnN0Um93IiwiaSIsImluaXRpYWxFZGl0TWF0cml4Iiwicm93IiwiQXJyYXkiLCJtYXRyaXgiLCJnZXRJbml0aWFsT3BlcmF0aW9uTWF0cml4Iiwicm93SW5kZXgiLCJpbnNlcnRpb25Db3N0IiwiaW5zZXJ0aW9uIiwiY29sdW1uSW5kZXgiLCJkb2VzU3Vic3RpdHV0aW9uUmVwbGFjZSIsInN1YnN0aXR1dGlvbkNvc3QiLCJzdWJzdGl0dXRpb24iLCJvcGVyYXRpb25Db3N0cyIsIm9wZXJhdGlvbkluZGV4IiwiZ2V0TWluSW5kZXgiLCJ5TG9jIiwieExvYyIsInJhbmdlIiwicmV2ZXJzZSIsImtleXNTdHJpbmciLCJrZXlzIiwic3BsaXQiLCJnZXRJdGVtS2V5IiwiaWRlbnRpdHkiLCJpdGVtS2V5U2V0IiwiU2V0IiwiaGFzIiwiYWRkIiwibnVtYmVycyIsIm1pbkluZGV4IiwibWluVmFsdWUiLCJuZXh0SW5kZXgiLCJuZXh0VmFsdWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFTQTs7O0lBR2FBLEk7Ozs7OytCQVllQyxLLEVBQWM7QUFDdEMsVUFBTUMsSUFBSSxHQUFHLElBQUlDLG9DQUFKLEVBQWI7QUFDQSxhQUFPRCxJQUFJLENBQUNFLFVBQUwsQ0FBZ0JILEtBQWhCLENBQVA7QUFDRDs7OzJCQUdDQSxLLEVBQ0FJLEssRUFFQTtBQUFBLFVBREFDLE9BQ0EsdUVBRHlCLEVBQ3pCO0FBQ0EsYUFBT04sSUFBSSxDQUFDTyxNQUFMLENBQ0xOLEtBREssRUFFTEksS0FGSyxFQUdMQyxPQUhLLEVBSUxFLEdBSkssQ0FJRCxVQUFDQyxRQUFEO0FBQUEsZUFBd0JBLFFBQVEsQ0FBQ0MsUUFBakM7QUFBQSxPQUpDLENBQVA7QUFLRDs7OzJCQUdDVCxLLEVBQ0FJLEssRUFFQTtBQUFBLFVBREFDLE9BQ0EsdUVBRHlCLEVBQ3pCO0FBQ0Es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Q3JELElBQUQsQ0FBdEI7O0FBQ0EsUUFBSXVELFVBQVUsQ0FBQ0UsR0FBWCxDQUFldkUsR0FBZixDQUFKLEVBQXlCO0FBQ3ZCLGFBQU8sS0FBUDtBQUNELEtBRkQsTUFFTztBQUNMcUUsTUFBQUEsVUFBVSxDQUFDRyxHQUFYLENBQWV4RSxHQUFmO0FBQ0EsYUFBTyxJQUFQO0FBQ0Q7QUFDRixHQVJNLENBQVA7QUFTRDs7QUFFRCxTQUFTb0UsUUFBVCxDQUFrQnRELElBQWxCLEVBQTZCO0FBQzNCLFNBQU9BLElBQVA7QUFDRDs7QUFFRCxTQUFTNkMsV0FBVCxDQUFxQmMsT0FBckIsRUFBZ0Q7QUFDOUMsTUFBSUMsUUFBUSxHQUFHLENBQWY7QUFDQSxNQUFJQyxRQUFRLEdBQUdGLE9BQU8sQ0FBQyxDQUFELENBQXRCOztBQUNBLE9BQUssSUFBSUcsU0FBUyxHQUFHLENBQXJCLEVBQXdCQSxTQUFTLEdBQUdILE9BQU8sQ0FBQzlELE1BQTVDLEVBQW9EaUUsU0FBUyxFQUE3RCxFQUFpRTtBQUMvRCxRQUFNQyxTQUFTLEdBQUdKLE9BQU8sQ0FBQ0csU0FBRCxDQUF6Qjs7QUFDQSxRQUFJQyxTQUFTLEdBQUdGLFFBQWhCLEVBQTBCO0FBQ3hCRCxNQUFBQSxRQUFRLEdBQUdFLFNBQVg7QUFDQUQsTUFBQUEsUUFBUSxHQUFHRSxTQUFYO0FBQ0Q7QUFDRjs7QUFDRCxTQUFPSCxRQUFQO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFZGl0Q29zdHMsIEZ1enpJdGVtIH0gZnJvbSAnLi9tb2RlbHMvaW5kZXgnO1xuaW1wb3J0IHsgRnV6elN0cmluZ1N0eWxlciB9IGZyb20gJy4vZnV6ei1zdHJpbmctc3R5bGVyLmNsYXNzJztcbmltcG9ydCB7IEZ1enpEZWVwS2V5RmluZGVyIH0gZnJvbSAnLi9mdXp6LWRlZXAta2V5LWZpbmRlci5jbGFzcyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRnV6emFseXRpY3Mge1xuICBlZGl0TWF0cml4OiBudW1iZXJbXVtdLFxuICBvcGVyYXRpb25NYXRyaXg6IG51bWJlcltdW10sXG4gIHRyYXZlcnNlZENlbGxzOiBudW1iZXJbXVtdLFxuICB3b3JzdFBvc3NpYmxlRWRpdERpc3RhbmNlOiBudW1iZXIsXG59XG5cbi8qKlxuICogRnV6elxuICovXG5leHBvcnQgY2xhc3MgRnV6eiB7XG5cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBERUZBVUxUX0ZJTFRFUl9USFJFU0hPTEQ6IG51bWJlciA9IDAuNDtcbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBERUZBVUxUX0VESVRfQ09TVFM6IEVkaXRDb3N0cyA9IHtcbiAgICBzdWJzdGl0dXRpb246IDEwMSxcbiAgICBkZWxldGlvbjogMTAwLFxuICAgIGluc2VydGlvbjogMTAwLFxuICAgIHByZVF1ZXJ5SW5zZXJ0aW9uOiAxLFxuICAgIHBvc3RRdWVyeUluc2VydGlvbjogMCxcbiAgfVxuXG4gIC8vIGp1c3QgbWFrZSB0aGlzIGEgdXRpbCBmdW5jdGlvblxuICBwdWJsaWMgc3RhdGljIGdldEFsbEtleXMgKGl0ZW1zOiBhbnlbXSkge1xuICAgIGNvbnN0IGZka2YgPSBuZXcgRnV6ekRlZXBLZXlGaW5kZXIoKTtcbiAgICByZXR1cm4gZmRrZi5nZXRBbGxLZXlzKGl0ZW1zKTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgZmlsdGVyKFxuICAgIGl0ZW1zOiBhbnlbXSxcbiAgICBxdWVyeTogc3RyaW5nLFxuICAgIG9wdGlvbnM6IFBhcnRpYWw8RnV6ej4gPSB7fSxcbiAgKSB7XG4gICAgcmV0dXJuIEZ1enouc2VhcmNoKFxuICAgICAgaXRlbXMsXG4gICAgICBxdWVyeSxcbiAgICAgIG9wdGlvbnMsXG4gICAgKS5tYXAoKGZ1enpJdGVtOiBGdXp6SXRlbSkgPT4gZnV6ekl0ZW0ub3JpZ2luYWwpO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBzZWFyY2goXG4gICAgaXRlbXM6IGFueVtdLFxuICAgIHF1ZXJ5OiBzdHJpbmcsXG4gICAgb3B0aW9uczogUGFydGlhbDxGdXp6PiA9IHt9LFxuICApIHtcbiAgICBjb25zdCBmdXp6ID0gbmV3IEZ1enooKTtcbiAgICByZXR1cm4gZnV6ei5zZWFyY2goaXRlbXMsIHF1ZXJ5LCBvcHRpb25zKTtcbiAgfVxuXG4gIHB1YmxpYyBzdWJqZWN0S2V5czogc3RyaW5nW10gPSBbXTtcbiAgcHVibGljIGNhc2VTZW5zaXRpdmU6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHVibGljIHNraXBGaWx0ZXI6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHVibGljIHNraXBTb3J0OiBib29sZWFuID0gZmFsc2U7XG4gIHB1YmxpYyBzdGFydERlY29yYXRvciA9ICc8Yj4nO1xuICBwdWJsaWMgZW5kRGVjb3JhdG9yID0gJzwvYj4nO1xuICBwdWJsaWMgZmlsdGVyVGhyZXNob2xkOiBudW1iZXIgPSBGdXp6LkRFRkFVTFRfRklMVEVSX1RIUkVTSE9MRDtcblxuICBwdWJsaWMgZWRpdENvc3RzOiBFZGl0Q29zdHMgPSB7IC4uLkZ1enouREVGQVVMVF9FRElUX0NPU1RTIH07XG4gIHB1YmxpYyBkaWFnbm9zdGljc0J5RnV6ekl0ZW06IFdlYWtNYXA8RnV6ekl0ZW0sIEZ1enphbHl0aWNzPiA9IG5ldyBXZWFrTWFwPEZ1enpJdGVtLCBGdXp6YWx5dGljcz4oKTtcbiAgcHVibGljIGFsbEZ1enpJdGVtc0J5S2V5QnlPcmlnaW5hbDogV2Vha01hcDxhbnksIGFueT4gPSBuZXcgV2Vha01hcDxhbnksIGFueT4oKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgc3RyaW5nU3R5bGVyOiBGdXp6U3RyaW5nU3R5bGVyID0gbmV3IEZ1enpTdHJpbmdTdHlsZXIoKSxcbiAgICBwdWJsaWMga2V5RmluZGVyOiBGdXp6RGVlcEtleUZpbmRlciA9IG5ldyBGdXp6RGVlcEtleUZpbmRlcigpLFxuICApIHt9XG5cbiAgcHVibGljIHNlYXJjaChcbiAgICBpdGVtczogYW55W10sXG4gICAgcXVlcnk6IHN0cmluZyxcbiAgICBvcHRpb25zOiBQYXJ0aWFsPEZ1eno+ID0ge30sXG4gICkge1xuICAgIE9iamVjdC5hc3NpZ24odGhpcywgb3B0aW9ucyk7XG5cbiAgICBsZXQgZnV6ekl0ZW1zID0gdGhpcy5nZXRTY29yZWRGdXp6SXRlbXMoaXRlbXMsIHF1ZXJ5LCB0aGlzLnN1YmplY3RLZXlzKTtcblxuICAgIC8vIFVzZWQgZm9yIGRpYWdub3N0aWNzXG4gICAgZnV6ekl0ZW1zLmZvckVhY2goKGZ1enpJdGVtOiBGdXp6SXRlbSkgPT4ge1xuICAgICAgbGV0IGZ1enpJdGVtc0J5S2V5ID0gdGhpcy5hbGxGdXp6SXRlbXNCeUtleUJ5T3JpZ2luYWwuZ2V0KGZ1enpJdGVtLm9yaWdpbmFsKTtcbiAgICAgIGlmICghZnV6ekl0ZW1zQnlLZXkpIHtcbiAgICAgICAgZnV6ekl0ZW1zQnlLZXkgPSB7fTtcbiAgICAgIH1cbiAgICAgIGZ1enpJdGVtc0J5S2V5W2Z1enpJdGVtLmtleV0gPSBmdXp6SXRlbTtcbiAgICAgIHRoaXMuYWxsRnV6ekl0ZW1zQnlLZXlCeU9yaWdpbmFsLnNldChmdXp6SXRlbS5vcmlnaW5hbCwgZnV6ekl0ZW1zQnlLZXkpO1xuICAgIH0pO1xuXG4gICAgaWYgKCF0aGlzLnNraXBGaWx0ZXIgJiYgcXVlcnkpIHtcbiAgICAgIGZ1enpJdGVtcyA9IGZ1enpJdGVtcy5maWx0ZXIoKGZ1enpJdGVtOiBGdXp6SXRlbSkgPT4gZnV6ekl0ZW0uc2NvcmUgPj0gdGhpcy5maWx0ZXJUaHJlc2hvbGQpO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuc2tpcFNvcnQpIHtcbiAgICAgIGZ1enpJdGVtcy5zb3J0KChhOiBGdXp6SXRlbSwgYjogRnV6ekl0ZW0pID0+IGIuc2NvcmUgLSBhLnNjb3JlKTtcbiAgICB9XG4gICAgcmV0dXJuIHVuaXFCeShmdXp6SXRlbXMsIChmdXp6SXRlbTogRnV6ekl0ZW0pID0+IGZ1enpJdGVtLm9yaWdpbmFsKTtcbiAgfVxuXG4gIHB1YmxpYyBnZXRTY29yZWRGdXp6SXRlbXMoXG4gICAgaXRlbXM6IGFueVtdLFxuICAgIHF1ZXJ5OiBzdHJpbmcsXG4gICAgc3ViamVjdEtleXM6IHN0cmluZ1tdID0gW10sXG4gICk6IEZ1enpJdGVtW10ge1xuICAgIHN1YmplY3RLZXlzID0gc3ViamVjdEtleXMubGVuZ3RoXG4gICAgICA/IHN1YmplY3RLZXlzXG4gICAgICA6IHRoaXMua2V5RmluZGVyLmdldEFsbEtleXMoaXRlbXMpO1xuXG4gICAgY29uc3QgZnV6ekl0ZW1zOiBGdXp6SXRlbVtdID0gdGhpcy5nZXRGdXp6SXRlbXMoaXRlbXMsIHN1YmplY3RLZXlzLCBxdWVyeSk7XG4gICAgdGhpcy5zY29yZUZ1enpJdGVtcyhmdXp6SXRlbXMpO1xuICAgIHJldHVybiBmdXp6SXRlbXM7XG4gIH1cblxuICBwdWJsaWMgZ2V0RnV6ekl0ZW1zKFxuICAgIGl0ZW1zOiBhbnlbXSxcbiAgICBzdWJqZWN0S2V5czogc3RyaW5nW10sXG4gICAgcXVlcnk6IHN0cmluZ1xuICApOiBGdXp6SXRlbVtdIHtcbiAgICBjb25zdCBmdXp6SXRlbXM6IEZ1enpJdGVtW10gPSBbXTtcbiAgICBpdGVtcy5mb3JFYWNoKChpdGVtOiBhbnkpID0+IHtcbiAgICAgIHN1YmplY3RLZXlzLmZvckVhY2goKGtleTogc3RyaW5nKSA9PiB7XG4gICAgICAgIGNvbnN0IHN1YmplY3QgPSBnZXQoaXRlbSwga2V5KTtcbiAgICAgICAgaWYgKHN1YmplY3QgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBmdXp6SXRlbXMucHVzaCh7XG4gICAgICAgICAgb3JpZ2luYWw6IGl0ZW0sXG4gICAgICAgICAga2V5OiBrZXksXG4gICAgICAgICAgc3ViamVjdDogU3RyaW5nKHN1YmplY3QpLFxuICAgICAgICAgIHF1ZXJ5OiBTdHJpbmcocXVlcnkpLFxuICAgICAgICB9IGFzIEZ1enpJdGVtKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiBmdXp6SXRlbXM7XG4gIH1cblxuICBwdWJsaWMgc2NvcmVGdXp6SXRlbXMoZnV6ekl0ZW1zOiBGdXp6SXRlbVtdKSB7XG4gICAgZnV6ekl0ZW1zLmZvckVhY2goKGZ1enpJdGVtOiBGdXp6SXRlbSkgPT4ge1xuICAgICAgY29uc3QgZWRpdE1hdHJpeCA9IHRoaXMuZ2V0SW5pdGlhbEVkaXRNYXRyaXgoXG4gICAgICAgIGZ1enpJdGVtLnF1ZXJ5LFxuICAgICAgICBmdXp6SXRlbS5zdWJqZWN0LFxuICAgICAgICB0aGlzLmVkaXRDb3N0cyxcbiAgICAgICk7XG4gICAgICBjb25zdCBvcGVyYXRpb25NYXRyaXggPSB0aGlzLmZpbGxFZGl0TWF0cml4KFxuICAgICAgICBlZGl0TWF0cml4LFxuICAgICAgICB0aGlzLmNhc2VTZW5zaXRpdmUgPyBmdXp6SXRlbS5xdWVyeSA6IGZ1enpJdGVtLnF1ZXJ5LnRvTG93ZXJDYXNlKCksXG4gICAgICAgIHRoaXMuY2FzZVNlbnNpdGl2ZSA/IGZ1enpJdGVtLnN1YmplY3QgOiBmdXp6SXRlbS5zdWJqZWN0LnRvTG93ZXJDYXNlKCksXG4gICAgICAgIHRoaXMuZWRpdENvc3RzLFxuICAgICAgKTtcbiAgICAgIGNvbnN0IFttYXRjaFJhbmdlcywgdHJhdmVyc2VkQ2VsbHNdID0gdGhpcy5nZXRNYXRjaFJhbmdlcyhvcGVyYXRpb25NYXRyaXgpO1xuXG4gICAgICB0aGlzLmRpYWdub3N0aWNzQnlGdXp6SXRlbS5zZXQoZnV6ekl0ZW0sIHtcbiAgICAgICAgZWRpdE1hdHJpeCxcbiAgICAgICAgb3BlcmF0aW9uTWF0cml4LFxuICAgICAgICB0cmF2ZXJzZWRDZWxscyxcbiAgICAgIH0gYXMgRnV6emFseXRpY3MpO1xuXG4gICAgICBsZXQgd29yc3RQb3NzaWJsZUVkaXREaXN0YW5jZSA9IGZ1enpJdGVtLnF1ZXJ5Lmxlbmd0aCAqIHRoaXMuZWRpdENvc3RzLmRlbGV0aW9uO1xuXG4gICAgICBpZiAoIWZ1enpJdGVtLnF1ZXJ5Lmxlbmd0aCkge1xuICAgICAgICB3b3JzdFBvc3NpYmxlRWRpdERpc3RhbmNlICs9IChmdXp6SXRlbS5zdWJqZWN0Lmxlbmd0aCAqIHRoaXMuZWRpdENvc3RzLnByZVF1ZXJ5SW5zZXJ0aW9uKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdvcnN0UG9zc2libGVFZGl0RGlzdGFuY2UgKz0gKGZ1enpJdGVtLnN1YmplY3QubGVuZ3RoICogTWF0aC5taW4odGhpcy5lZGl0Q29zdHMucG9zdFF1ZXJ5SW5zZXJ0aW9uLCB0aGlzLmVkaXRDb3N0cy5wcmVRdWVyeUluc2VydGlvbikpO1xuICAgICAgfVxuXG4gICAgICBmdXp6SXRlbS5lZGl0RGlzdGFuY2UgPSBlZGl0TWF0cml4W2VkaXRNYXRyaXgubGVuZ3RoIC0gMV1bZWRpdE1hdHJpeFswXS5sZW5ndGggLSAxXTtcbiAgICAgIGZ1enpJdGVtLnNjb3JlID0gKHdvcnN0UG9zc2libGVFZGl0RGlzdGFuY2UgPT09IDApXG4gICAgICAgID8gMVxuICAgICAgICA6IDEgLSAoZnV6ekl0ZW0uZWRpdERpc3RhbmNlIC8gd29yc3RQb3NzaWJsZUVkaXREaXN0YW5jZSk7XG5cbiAgICAgIHRoaXMuZGlhZ25vc3RpY3NCeUZ1enpJdGVtLmdldChmdXp6SXRlbSkud29yc3RQb3NzaWJsZUVkaXREaXN0YW5jZSA9IHdvcnN0UG9zc2libGVFZGl0RGlzdGFuY2U7XG5cbiAgICAgIGZ1enpJdGVtLm1hdGNoUmFuZ2VzID0gbWF0Y2hSYW5nZXM7XG4gICAgICBmdXp6SXRlbS5zdHlsZWRTdHJpbmcgPSB0aGlzLnN0cmluZ1N0eWxlci5zdHlsZVdpdGhUYWdzKFxuICAgICAgICBmdXp6SXRlbS5zdWJqZWN0LFxuICAgICAgICBtYXRjaFJhbmdlcyxcbiAgICAgICAgdGhpcy5zdGFydERlY29yYXRvcixcbiAgICAgICAgdGhpcy5lbmREZWNvcmF0b3IsXG4gICAgICApXG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgZ2V0SW5pdGlhbEVkaXRNYXRyaXgoXG4gICAgcXVlcnk6IHN0cmluZyxcbiAgICBzdWJqZWN0OiBzdHJpbmcsXG4gICAgZWRpdENvc3RzOiBFZGl0Q29zdHMsXG4gICk6IG51bWJlcltdW10ge1xuICAgIGNvbnN0IGhlaWdodCA9IHF1ZXJ5Lmxlbmd0aCArIDE7XG4gICAgY29uc3Qgd2lkdGggPSBzdWJqZWN0Lmxlbmd0aCArIDE7XG5cbiAgICBjb25zdCBmaXJzdFJvdyA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgd2lkdGg7IGkrKykge1xuICAgICAgZmlyc3RSb3cucHVzaChpICogZWRpdENvc3RzLnByZVF1ZXJ5SW5zZXJ0aW9uKTtcbiAgICB9XG5cbiAgICBjb25zdCBpbml0aWFsRWRpdE1hdHJpeCA9IFtmaXJzdFJvd107XG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCBoZWlnaHQ7IGkrKykge1xuICAgICAgY29uc3Qgcm93ID0gbmV3IEFycmF5KHdpZHRoKTtcbiAgICAgIHJvd1swXSA9IGkgKiBlZGl0Q29zdHMuZGVsZXRpb247XG4gICAgICBpbml0aWFsRWRpdE1hdHJpeC5wdXNoKHJvdyk7XG4gICAgfVxuICAgIHJldHVybiBpbml0aWFsRWRpdE1hdHJpeDtcbiAgfVxuXG4gIC8qKlxuICAgKiBmaWxsRWRpdE1hdHJpeFxuICAgKiB0b2RvOiByZXVzZSBtYXRyaWNlcyB0byByZWR1Y2UgZ2NcbiAgICogQHJldHVybiB7bnVtYmVyW119XG4gICAqL1xuICBwdWJsaWMgZmlsbEVkaXRNYXRyaXgoXG4gICAgbWF0cml4OiBudW1iZXJbXVtdLFxuICAgIHF1ZXJ5OiBzdHJpbmcsXG4gICAgc3ViamVjdDogc3RyaW5nLFxuICAgIGVkaXRDb3N0czogRWRpdENvc3RzLFxuICApOiBudW1iZXJbXVtdIHtcbiAgICBjb25zdCBoZWlnaHQgPSBtYXRyaXgubGVuZ3RoO1xuICAgIGNvbnN0IHdpZHRoID0gbWF0cml4WzBdLmxlbmd0aDtcbiAgICBjb25zdCBvcGVyYXRpb25NYXRyaXggPSB0aGlzLmdldEluaXRpYWxPcGVyYXRpb25NYXRyaXgoaGVpZ2h0LCB3aWR0aCk7XG4gICAgZm9yIChsZXQgcm93SW5kZXggPSAxOyByb3dJbmRleCA8IGhlaWdodDsgcm93SW5kZXgrKykge1xuICAgICAgY29uc3QgaW5zZXJ0aW9uQ29zdCA9IHJvd0luZGV4ID09PSAoaGVpZ2h0IC0gMSkgPyBlZGl0Q29zdHMucG9zdFF1ZXJ5SW5zZXJ0aW9uIDogZWRpdENvc3RzLmluc2VydGlvbjtcbiAgICAgIGZvciAobGV0IGNvbHVtbkluZGV4ID0gMTsgY29sdW1uSW5kZXggPCB3aWR0aDsgY29sdW1uSW5kZXgrKykge1xuICAgICAgICBjb25zdCBkb2VzU3Vic3RpdHV0aW9uUmVwbGFjZSA9IHF1ZXJ5W3Jvd0luZGV4IC0gMV0gIT09IHN1YmplY3RbY29sdW1uSW5kZXggLSAxXTtcbiAgICAgICAgY29uc3Qgc3Vic3RpdHV0aW9uQ29zdCA9IGRvZXNTdWJzdGl0dXRpb25SZXBsYWNlID8gZWRpdENvc3RzLnN1YnN0aXR1dGlvbiA6IDA7XG4gICAgICAgIGNvbnN0IG9wZXJhdGlvbkNvc3RzID0gW1xuICAgICAgICAgIG1hdHJpeFtyb3dJbmRleCAtIDFdW2NvbHVtbkluZGV4XSArIGVkaXRDb3N0cy5kZWxldGlvbixcbiAgICAgICAgICBtYXRyaXhbcm93SW5kZXhdW2NvbHVtbkluZGV4IC0gMV0gKyBpbnNlcnRpb25Db3N0LFxuICAgICAgICAgIG1hdHJpeFtyb3dJbmRleCAtIDFdW2NvbHVtbkluZGV4IC0gMV0gKyBzdWJzdGl0dXRpb25Db3N0LFxuICAgICAgICBdO1xuICAgICAgICBjb25zdCBvcGVyYXRpb25JbmRleCA9IGdldE1pbkluZGV4KG9wZXJhdGlvbkNvc3RzKTtcbiAgICAgICAgbWF0cml4W3Jvd0luZGV4XVtjb2x1bW5JbmRleF0gPSBvcGVyYXRpb25Db3N0c1tvcGVyYXRpb25JbmRleF07XG4gICAgICAgIGlmIChvcGVyYXRpb25JbmRleCA9PT0gMiAmJiAhZG9lc1N1YnN0aXR1dGlvblJlcGxhY2UpIHtcbiAgICAgICAgICBvcGVyYXRpb25NYXRyaXhbcm93SW5kZXhdW2NvbHVtbkluZGV4XSA9IDM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb3BlcmF0aW9uTWF0cml4W3Jvd0luZGV4XVtjb2x1bW5JbmRleF0gPSBvcGVyYXRpb25JbmRleDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb3BlcmF0aW9uTWF0cml4O1xuICB9XG5cbiAgLyoqXG4gICAqIGdldEluaXRpYWxPcGVyYXRpb25NYXRyaXhcbiAgICogQHJldHVybiB7bnVtYmVyW119XG4gICAqL1xuICBwdWJsaWMgZ2V0SW5pdGlhbE9wZXJhdGlvbk1hdHJpeChoZWlnaHQ6IG51bWJlciwgd2lkdGg6IG51bWJlcik6IG51bWJlcltdW10ge1xuICAgIGNvbnN0IGZpcnN0Um93ID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB3aWR0aDsgaSsrKSB7XG4gICAgICBmaXJzdFJvdy5wdXNoKDEpO1xuICAgIH1cblxuICAgIGNvbnN0IG9wZXJhdGlvbk1hdHJpeCA9IFtmaXJzdFJvd107XG4gICAgZm9yKGxldCBpID0gMTsgaSA8IGhlaWdodDsgaSsrKSB7XG4gICAgICBjb25zdCByb3cgPSBuZXcgQXJyYXkod2lkdGgpO1xuICAgICAgcm93WzBdID0gMDtcbiAgICAgIG9wZXJhdGlvbk1hdHJpeC5wdXNoKHJvdyk7XG4gICAgfVxuICAgIHJldHVybiBvcGVyYXRpb25NYXRyaXg7XG4gIH1cblxuICAvKipcbiAgICogZ2V0TWF0Y2hSYW5nZXNcbiAgICogb3BlcmF0aW9uTWF0cml4IG51bWJlcnMgc3RhbmQgZm9yIHsgMDogZGVsZXRlLCAxOiBpbnNlcnQsIDI6IHN1YiwgMzogbm9vcCB9XG4gICAqIEByZXR1cm4ge251bWJlcltdfVxuICAgKi9cbiAgcHVibGljIGdldE1hdGNoUmFuZ2VzKG9wZXJhdGlvbk1hdHJpeDogbnVtYmVyW11bXSk6IEFycmF5PG51bWJlcltdW10+IHtcbiAgICBsZXQgeUxvYyA9IG9wZXJhdGlvbk1hdHJpeC5sZW5ndGggLSAxO1xuICAgIGxldCB4TG9jID0gb3BlcmF0aW9uTWF0cml4WzBdLmxlbmd0aCAtIDE7XG4gICAgbGV0IG1hdGNoUmFuZ2VzOiBudW1iZXJbXVtdID0gW107XG4gICAgbGV0IHJhbmdlOiBudW1iZXJbXTtcblxuICAgIGxldCB0cmF2ZXJzZWRDZWxscyA9IFtbMCwgMF1dO1xuXG4gICAgd2hpbGUgKHlMb2MgIT09IDAgfHwgeExvYyAhPT0gMCkge1xuICAgICAgdHJhdmVyc2VkQ2VsbHMucHVzaChbeUxvYywgeExvY10pO1xuICAgICAgc3dpdGNoKG9wZXJhdGlvbk1hdHJpeFt5TG9jXVt4TG9jXSkge1xuICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgeUxvYy0tXG4gICAgICAgICAgLy8gZGVsZXRpbmcgYSBjaGFyYWN0ZXIgZnJvbSBzdWJqZWN0IGRvZXMgbm90IGJyZWFrIHRoZSBtYXRjaFJhbmdlIHN0cmVha1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgeExvYy0tO1xuICAgICAgICAgIGlmIChyYW5nZSkge1xuICAgICAgICAgICAgbWF0Y2hSYW5nZXMucHVzaChyYW5nZSk7XG4gICAgICAgICAgICByYW5nZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICB5TG9jLS07XG4gICAgICAgICAgeExvYy0tO1xuICAgICAgICAgIGlmIChyYW5nZSkge1xuICAgICAgICAgICAgbWF0Y2hSYW5nZXMucHVzaChyYW5nZSk7XG4gICAgICAgICAgICByYW5nZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICB5TG9jLS07XG4gICAgICAgICAgeExvYy0tO1xuICAgICAgICAgIGlmIChyYW5nZSkge1xuICAgICAgICAgICAgLy8gY29udGludWVzIG1hdGNoUmFuZ2Ugc3RyZWFrXG4gICAgICAgICAgICByYW5nZVswXSA9IHhMb2M7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIHN0YXJ0cyB0aGUgbWF0Y2hSYW5nZSBzdHJlYWtcbiAgICAgICAgICAgIHJhbmdlID0gW3hMb2MsIHhMb2NdO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHJhbmdlKSB7XG4gICAgICBtYXRjaFJhbmdlcy5wdXNoKHJhbmdlKTtcbiAgICB9XG4gICAgcmV0dXJuIFttYXRjaFJhbmdlcy5yZXZlcnNlKCksIHRyYXZlcnNlZENlbGxzXTtcbiAgfVxuXG59XG5cbmZ1bmN0aW9uIGdldChcbiAgaXRlbTogYW55LFxuICBrZXlzU3RyaW5nOiBzdHJpbmcsXG4pIHtcbiAgY29uc3Qga2V5cyA9IGtleXNTdHJpbmcuc3BsaXQoJy4nKTtcbiAgZm9yKGxldCBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICBpZihpdGVtID09PSB1bmRlZmluZWQgfHwgaXRlbSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpdGVtID0gaXRlbVtrZXlzW2ldXVxuICB9XG4gIHJldHVybiBpdGVtO1xufVxuXG5mdW5jdGlvbiB1bmlxQnkoXG4gIGl0ZW1zOiBhbnlbXSxcbiAgZ2V0SXRlbUtleTogKGl0ZW06IGFueSkgPT4gYW55ID0gaWRlbnRpdHksXG4pIHtcbiAgY29uc3QgaXRlbUtleVNldCA9IG5ldyBTZXQoKTtcbiAgcmV0dXJuIGl0ZW1zLmZpbHRlcigoaXRlbTogYW55KSA9PiB7XG4gICAgY29uc3Qga2V5ID0gZ2V0SXRlbUtleShpdGVtKTtcbiAgICBpZiAoaXRlbUtleVNldC5oYXMoa2V5KSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICBpdGVtS2V5U2V0LmFkZChrZXkpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9KVxufVxuXG5mdW5jdGlvbiBpZGVudGl0eShpdGVtOiBhbnkpIHtcbiAgcmV0dXJuIGl0ZW07XG59XG5cbmZ1bmN0aW9uIGdldE1pbkluZGV4KG51bWJlcnM6IG51bWJlcltdKTogbnVtYmVyIHtcbiAgbGV0IG1pbkluZGV4ID0gMDtcbiAgbGV0IG1pblZhbHVlID0gbnVtYmVyc1swXTtcbiAgZm9yIChsZXQgbmV4dEluZGV4ID0gMTsgbmV4dEluZGV4IDwgbnVtYmVycy5sZW5ndGg7IG5leHRJbmRleCsrKSB7XG4gICAgY29uc3QgbmV4dFZhbHVlID0gbnVtYmVyc1tuZXh0SW5kZXhdO1xuICAgIGlmIChuZXh0VmFsdWUgPCBtaW5WYWx1ZSkge1xuICAgICAgbWluSW5kZXggPSBuZXh0SW5kZXg7XG4gICAgICBtaW5WYWx1ZSA9IG5leHRWYWx1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG1pbkluZGV4O1xufVxuIl19