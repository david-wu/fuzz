"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Fuzz = void 0;

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Fuzz =
/*#__PURE__*/
function () {
  function Fuzz() {
    _classCallCheck(this, Fuzz);

    _defineProperty(this, "isCaseSensitive", false);

    _defineProperty(this, "editCosts", _objectSpread({}, Fuzz.DEFAULT_EDIT_COSTS));

    _defineProperty(this, "filterThreshold", Fuzz.DEFAULT_FILTER_THRESHOLD);
  }

  _createClass(Fuzz, [{
    key: "filterSort",
    value: function filterSort(items, subjectKeys, query) {
      var filterThreshold = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : this.filterThreshold;
      var fuzzItems = this.getFuzzItems(items, subjectKeys, query);
      this.scoreFuzzItems(fuzzItems);

      if (!query) {
        return fuzzItems;
      }

      var filteredFuzzItems = fuzzItems.filter(function (fuzzItem) {
        return fuzzItem.editDistance <= filterThreshold * fuzzItem.query.length;
      });
      filteredFuzzItems.sort(function (a, b) {
        return a.editDistance - b.editDistance;
      });
      return uniqBy(filteredFuzzItems, function (fuzzItem) {
        return fuzzItem.original;
      });
    }
  }, {
    key: "sort",
    value: function sort(items, subjectKeys, query) {
      var fuzzItems = this.getFuzzItems(items, subjectKeys, query);
      this.scoreFuzzItems(fuzzItems);

      if (!query) {
        return fuzzItems;
      }

      fuzzItems.sort(function (a, b) {
        return a.editDistance - b.editDistance;
      });
      return uniqBy(fuzzItems, function (fuzzItem) {
        return fuzzItem.original;
      });
    }
  }, {
    key: "getFuzzItems",
    value: function getFuzzItems(items, subjectKeys, query) {
      var _this = this;

      var fuzzItems = [];
      items.forEach(function (item) {
        subjectKeys.forEach(function (key) {
          var subject = get(item, key);
          fuzzItems.push({
            original: item,
            key: key,
            subject: _this.isCaseSensitive ? subject : subject.toLowerCase(),
            query: _this.isCaseSensitive ? query : query.toLowerCase()
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

        var operationMatrix = _this2.fillEditMatrix(editMatrix, fuzzItem.query, fuzzItem.subject, _this2.editCosts);

        var matchRanges = _this2.getMatchRanges(operationMatrix);

        fuzzItem.editMatrix = editMatrix;
        fuzzItem.editDistance = editMatrix[editMatrix.length - 1][editMatrix[0].length - 1];
        fuzzItem.operationMatrix = operationMatrix;
        fuzzItem.matchRanges = matchRanges;
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

      for (var _i = 1; _i < height; _i++) {
        var row = new Array(width);
        row[0] = _i * editCosts.deletion;
        initialEditMatrix.push(row);
      }

      return initialEditMatrix;
    }
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
  }, {
    key: "getInitialOperationMatrix",
    value: function getInitialOperationMatrix(height, width) {
      var firstRow = [];

      for (var i = 0; i < width; i++) {
        firstRow.push(1);
      }

      var operationMatrix = [firstRow];

      for (var _i2 = 1; _i2 < height; _i2++) {
        var row = new Array(width);
        row[0] = 0;
        operationMatrix.push(row);
      }

      return operationMatrix;
    }
  }, {
    key: "getMatchRanges",
    value: function getMatchRanges(operationMatrix) {
      var yLoc = operationMatrix.length - 1;
      var xLoc = operationMatrix[0].length - 1;
      var matchRanges = [];
      var range;

      while (yLoc !== 0 || xLoc !== 0) {
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

      return matchRanges.reverse();
    }
  }]);

  return Fuzz;
}();

exports.Fuzz = Fuzz;

_defineProperty(Fuzz, "DEFAULT_EDIT_COSTS", {
  substitution: 141,
  deletion: 100,
  insertion: 100,
  preQueryInsertion: 4,
  postQueryInsertion: 2 // edit distance allowed per query length

});

_defineProperty(Fuzz, "DEFAULT_FILTER_THRESHOLD", 45);

function get(item, keysString) {
  var keys = keysString.split('.');

  for (var i = 0; i < keys.length; i++) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mdXp6LmNsYXNzLnRzIl0sIm5hbWVzIjpbIkZ1enoiLCJERUZBVUxUX0VESVRfQ09TVFMiLCJERUZBVUxUX0ZJTFRFUl9USFJFU0hPTEQiLCJpdGVtcyIsInN1YmplY3RLZXlzIiwicXVlcnkiLCJmaWx0ZXJUaHJlc2hvbGQiLCJmdXp6SXRlbXMiLCJnZXRGdXp6SXRlbXMiLCJzY29yZUZ1enpJdGVtcyIsImZpbHRlcmVkRnV6ekl0ZW1zIiwiZmlsdGVyIiwiZnV6ekl0ZW0iLCJlZGl0RGlzdGFuY2UiLCJsZW5ndGgiLCJzb3J0IiwiYSIsImIiLCJ1bmlxQnkiLCJvcmlnaW5hbCIsImZvckVhY2giLCJpdGVtIiwia2V5Iiwic3ViamVjdCIsImdldCIsInB1c2giLCJpc0Nhc2VTZW5zaXRpdmUiLCJ0b0xvd2VyQ2FzZSIsImVkaXRNYXRyaXgiLCJnZXRJbml0aWFsRWRpdE1hdHJpeCIsImVkaXRDb3N0cyIsIm9wZXJhdGlvbk1hdHJpeCIsImZpbGxFZGl0TWF0cml4IiwibWF0Y2hSYW5nZXMiLCJnZXRNYXRjaFJhbmdlcyIsImhlaWdodCIsIndpZHRoIiwiZmlyc3RSb3ciLCJpIiwicHJlUXVlcnlJbnNlcnRpb24iLCJpbml0aWFsRWRpdE1hdHJpeCIsInJvdyIsIkFycmF5IiwiZGVsZXRpb24iLCJtYXRyaXgiLCJnZXRJbml0aWFsT3BlcmF0aW9uTWF0cml4Iiwicm93SW5kZXgiLCJpbnNlcnRpb25Db3N0IiwicG9zdFF1ZXJ5SW5zZXJ0aW9uIiwiaW5zZXJ0aW9uIiwiY29sdW1uSW5kZXgiLCJkb2VzU3Vic3RpdHV0aW9uUmVwbGFjZSIsInN1YnN0aXR1dGlvbkNvc3QiLCJzdWJzdGl0dXRpb24iLCJvcGVyYXRpb25Db3N0cyIsIm9wZXJhdGlvbkluZGV4IiwiZ2V0TWluSW5kZXgiLCJ5TG9jIiwieExvYyIsInJhbmdlIiwidW5kZWZpbmVkIiwicmV2ZXJzZSIsImtleXNTdHJpbmciLCJrZXlzIiwic3BsaXQiLCJnZXRJdGVtS2V5IiwiaWRlbnRpdHkiLCJpdGVtS2V5U2V0IiwiU2V0IiwiaGFzIiwiYWRkIiwibnVtYmVycyIsIm1pbkluZGV4IiwibWluVmFsdWUiLCJuZXh0SW5kZXgiLCJuZXh0VmFsdWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBRWFBLEk7Ozs7Ozs2Q0FZc0IsSzs7eURBQ0NBLElBQUksQ0FBQ0Msa0I7OzZDQUNQRCxJQUFJLENBQUNFLHdCOzs7OzsrQkFHckNDLEssRUFDQUMsVyxFQUNBQyxLLEVBRWE7QUFBQSxVQURiQyxlQUNhLHVFQURhLEtBQUtBLGVBQ2xCO0FBQ2IsVUFBTUMsU0FBcUIsR0FBRyxLQUFLQyxZQUFMLENBQWtCTCxLQUFsQixFQUF5QkMsV0FBekIsRUFBc0NDLEtBQXRDLENBQTlCO0FBQ0EsV0FBS0ksY0FBTCxDQUFvQkYsU0FBcEI7O0FBQ0EsVUFBSSxDQUFDRixLQUFMLEVBQVk7QUFBRSxlQUFPRSxTQUFQO0FBQW1COztBQUNqQyxVQUFNRyxpQkFBaUIsR0FBR0gsU0FBUyxDQUFDSSxNQUFWLENBQWlCLFVBQUNDLFFBQUQsRUFBd0I7QUFDbEUsZUFBT0EsUUFBUSxDQUFDQyxZQUFULElBQTBCUCxlQUFlLEdBQUdNLFFBQVEsQ0FBQ1AsS0FBVCxDQUFlUyxNQUFsRTtBQUNBLE9BRnlCLENBQTFCO0FBR0FKLE1BQUFBLGlCQUFpQixDQUFDSyxJQUFsQixDQUF1QixVQUFDQyxDQUFELEVBQWNDLENBQWQ7QUFBQSxlQUE4QkQsQ0FBQyxDQUFDSCxZQUFGLEdBQWlCSSxDQUFDLENBQUNKLFlBQWpEO0FBQUEsT0FBdkI7QUFDQSxhQUFPSyxNQUFNLENBQUNSLGlCQUFELEVBQW9CLFVBQUNFLFFBQUQ7QUFBQSxlQUF3QkEsUUFBUSxDQUFDTyxRQUFqQztBQUFBLE9BQXBCLENBQWI7QUFDQTs7O3lCQUdBaEIsSyxFQUNBQyxXLEVBQ0FDLEssRUFDYTtBQUNiLFVBQU1FLFNBQXFCLEdBQUcsS0FBS0MsWUFBTCxDQUFrQkwsS0FBbEIsRUFBeUJDLFdBQXpCLEVBQXNDQyxLQUF0QyxDQUE5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R0FBRyxHQUFHMkMsVUFBVSxDQUFDNUMsSUFBRCxDQUF0Qjs7QUFDQSxRQUFJOEMsVUFBVSxDQUFDRSxHQUFYLENBQWUvQyxHQUFmLENBQUosRUFBeUI7QUFDeEIsYUFBTyxLQUFQO0FBQ0EsS0FGRCxNQUVPO0FBQ042QyxNQUFBQSxVQUFVLENBQUNHLEdBQVgsQ0FBZWhELEdBQWY7QUFDQSxhQUFPLElBQVA7QUFDQTtBQUNELEdBUk0sQ0FBUDtBQVNBOztBQUVELFNBQVM0QyxRQUFULENBQWtCN0MsSUFBbEIsRUFBNkI7QUFDNUIsU0FBT0EsSUFBUDtBQUNBOztBQUVELFNBQVNtQyxXQUFULENBQXFCZSxPQUFyQixFQUFnRDtBQUMvQyxNQUFJQyxRQUFRLEdBQUcsQ0FBZjtBQUNBLE1BQUlDLFFBQVEsR0FBR0YsT0FBTyxDQUFDLENBQUQsQ0FBdEI7O0FBQ0EsT0FBSyxJQUFJRyxTQUFTLEdBQUcsQ0FBckIsRUFBd0JBLFNBQVMsR0FBR0gsT0FBTyxDQUFDekQsTUFBNUMsRUFBb0Q0RCxTQUFTLEVBQTdELEVBQWlFO0FBQ2hFLFFBQU1DLFNBQVMsR0FBR0osT0FBTyxDQUFDRyxTQUFELENBQXpCOztBQUNBLFFBQUlDLFNBQVMsR0FBR0YsUUFBaEIsRUFBMEI7QUFDekJELE1BQUFBLFFBQVEsR0FBR0UsU0FBWDtBQUNBRCxNQUFBQSxRQUFRLEdBQUdFLFNBQVg7QUFDQTtBQUNEOztBQUNELFNBQU9ILFFBQVA7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEVkaXRDb3N0cywgRnV6ekl0ZW0gfSBmcm9tICcuL21vZGVscyc7XG5cbmV4cG9ydCBjbGFzcyBGdXp6IHtcblxuXHRwdWJsaWMgc3RhdGljIHJlYWRvbmx5IERFRkFVTFRfRURJVF9DT1NUUzogRWRpdENvc3RzID0ge1xuXHRcdHN1YnN0aXR1dGlvbjogMTQxLFxuXHRcdGRlbGV0aW9uOiAxMDAsXG5cdFx0aW5zZXJ0aW9uOiAxMDAsXG5cdFx0cHJlUXVlcnlJbnNlcnRpb246IDQsXG5cdFx0cG9zdFF1ZXJ5SW5zZXJ0aW9uOiAyLFxuXHR9XG5cdC8vIGVkaXQgZGlzdGFuY2UgYWxsb3dlZCBwZXIgcXVlcnkgbGVuZ3RoXG5cdHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgREVGQVVMVF9GSUxURVJfVEhSRVNIT0xEOiBudW1iZXIgPSA0NTtcblxuXHRwdWJsaWMgaXNDYXNlU2Vuc2l0aXZlOiBib29sZWFuID0gZmFsc2U7XG5cdHB1YmxpYyBlZGl0Q29zdHM6IEVkaXRDb3N0cyA9IHsgLi4uRnV6ei5ERUZBVUxUX0VESVRfQ09TVFMgfTtcblx0cHVibGljIGZpbHRlclRocmVzaG9sZDogbnVtYmVyID0gRnV6ei5ERUZBVUxUX0ZJTFRFUl9USFJFU0hPTEQ7XG5cblx0cHVibGljIGZpbHRlclNvcnQoXG5cdFx0aXRlbXM6IGFueVtdLFxuXHRcdHN1YmplY3RLZXlzOiBzdHJpbmdbXSxcblx0XHRxdWVyeTogc3RyaW5nLFxuXHRcdGZpbHRlclRocmVzaG9sZDogbnVtYmVyID0gdGhpcy5maWx0ZXJUaHJlc2hvbGQsXG5cdCk6IEZ1enpJdGVtW10ge1xuXHRcdGNvbnN0IGZ1enpJdGVtczogRnV6ekl0ZW1bXSA9IHRoaXMuZ2V0RnV6ekl0ZW1zKGl0ZW1zLCBzdWJqZWN0S2V5cywgcXVlcnkpO1xuXHRcdHRoaXMuc2NvcmVGdXp6SXRlbXMoZnV6ekl0ZW1zKTtcblx0XHRpZiAoIXF1ZXJ5KSB7IHJldHVybiBmdXp6SXRlbXM7IH1cblx0XHRjb25zdCBmaWx0ZXJlZEZ1enpJdGVtcyA9IGZ1enpJdGVtcy5maWx0ZXIoKGZ1enpJdGVtOiBGdXp6SXRlbSkgPT4ge1xuXHRcdFx0cmV0dXJuIGZ1enpJdGVtLmVkaXREaXN0YW5jZSA8PSAoZmlsdGVyVGhyZXNob2xkICogZnV6ekl0ZW0ucXVlcnkubGVuZ3RoKTtcblx0XHR9KTtcblx0XHRmaWx0ZXJlZEZ1enpJdGVtcy5zb3J0KChhOiBGdXp6SXRlbSwgYjogRnV6ekl0ZW0pID0+IGEuZWRpdERpc3RhbmNlIC0gYi5lZGl0RGlzdGFuY2UpO1xuXHRcdHJldHVybiB1bmlxQnkoZmlsdGVyZWRGdXp6SXRlbXMsIChmdXp6SXRlbTogRnV6ekl0ZW0pID0+IGZ1enpJdGVtLm9yaWdpbmFsKTtcblx0fVxuXG5cdHB1YmxpYyBzb3J0KFxuXHRcdGl0ZW1zOiBhbnlbXSxcblx0XHRzdWJqZWN0S2V5czogc3RyaW5nW10sXG5cdFx0cXVlcnk6IHN0cmluZyxcblx0KTogRnV6ekl0ZW1bXSB7XG5cdFx0Y29uc3QgZnV6ekl0ZW1zOiBGdXp6SXRlbVtdID0gdGhpcy5nZXRGdXp6SXRlbXMoaXRlbXMsIHN1YmplY3RLZXlzLCBxdWVyeSk7XG5cdFx0dGhpcy5zY29yZUZ1enpJdGVtcyhmdXp6SXRlbXMpO1xuXHRcdGlmICghcXVlcnkpIHsgcmV0dXJuIGZ1enpJdGVtczsgfVxuXHRcdGZ1enpJdGVtcy5zb3J0KChhOiBGdXp6SXRlbSwgYjogRnV6ekl0ZW0pID0+IGEuZWRpdERpc3RhbmNlIC0gYi5lZGl0RGlzdGFuY2UpO1xuXHRcdHJldHVybiB1bmlxQnkoZnV6ekl0ZW1zLCAoZnV6ekl0ZW06IEZ1enpJdGVtKSA9PiBmdXp6SXRlbS5vcmlnaW5hbCk7XG5cdH1cblxuXHRwdWJsaWMgZ2V0RnV6ekl0ZW1zKFxuXHRcdGl0ZW1zOiBhbnlbXSxcblx0XHRzdWJqZWN0S2V5czogc3RyaW5nW10sXG5cdFx0cXVlcnk6IHN0cmluZ1xuXHQpOiBGdXp6SXRlbVtdIHtcblx0XHRjb25zdCBmdXp6SXRlbXM6IEZ1enpJdGVtW10gPSBbXTtcblx0XHRpdGVtcy5mb3JFYWNoKChpdGVtOiBhbnkpID0+IHtcblx0XHRcdHN1YmplY3RLZXlzLmZvckVhY2goKGtleTogc3RyaW5nKSA9PiB7XG5cdFx0XHRcdGNvbnN0IHN1YmplY3QgPSBnZXQoaXRlbSwga2V5KTtcblx0XHRcdFx0ZnV6ekl0ZW1zLnB1c2goe1xuXHRcdFx0XHRcdG9yaWdpbmFsOiBpdGVtLFxuXHRcdFx0XHRcdGtleToga2V5LFxuXHRcdFx0XHRcdHN1YmplY3Q6IHRoaXMuaXNDYXNlU2Vuc2l0aXZlID8gc3ViamVjdCA6IHN1YmplY3QudG9Mb3dlckNhc2UoKSxcblx0XHRcdFx0XHRxdWVyeTogdGhpcy5pc0Nhc2VTZW5zaXRpdmUgPyBxdWVyeSA6IHF1ZXJ5LnRvTG93ZXJDYXNlKCksXG5cdFx0XHRcdH0gYXMgRnV6ekl0ZW0pO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIGZ1enpJdGVtcztcblx0fVxuXG5cdHB1YmxpYyBzY29yZUZ1enpJdGVtcyhmdXp6SXRlbXM6IEZ1enpJdGVtW10pIHtcblx0XHRmdXp6SXRlbXMuZm9yRWFjaCgoZnV6ekl0ZW06IEZ1enpJdGVtKSA9PiB7XG5cdFx0XHRjb25zdCBlZGl0TWF0cml4ID0gdGhpcy5nZXRJbml0aWFsRWRpdE1hdHJpeChcblx0XHRcdFx0ZnV6ekl0ZW0ucXVlcnksXG5cdFx0XHRcdGZ1enpJdGVtLnN1YmplY3QsXG5cdFx0XHRcdHRoaXMuZWRpdENvc3RzLFxuXHRcdFx0KTtcblx0XHRcdGNvbnN0IG9wZXJhdGlvbk1hdHJpeCA9IHRoaXMuZmlsbEVkaXRNYXRyaXgoXG5cdFx0XHRcdGVkaXRNYXRyaXgsXG5cdFx0XHRcdGZ1enpJdGVtLnF1ZXJ5LFxuXHRcdFx0XHRmdXp6SXRlbS5zdWJqZWN0LFxuXHRcdFx0XHR0aGlzLmVkaXRDb3N0cyxcblx0XHRcdCk7XG5cdFx0XHRjb25zdCBtYXRjaFJhbmdlcyA9IHRoaXMuZ2V0TWF0Y2hSYW5nZXMob3BlcmF0aW9uTWF0cml4KTtcblx0XHRcdGZ1enpJdGVtLmVkaXRNYXRyaXggPSBlZGl0TWF0cml4O1xuXHRcdFx0ZnV6ekl0ZW0uZWRpdERpc3RhbmNlID0gZWRpdE1hdHJpeFtlZGl0TWF0cml4Lmxlbmd0aCAtIDFdW2VkaXRNYXRyaXhbMF0ubGVuZ3RoIC0gMV07XG5cdFx0XHRmdXp6SXRlbS5vcGVyYXRpb25NYXRyaXggPSBvcGVyYXRpb25NYXRyaXg7XG5cdFx0XHRmdXp6SXRlbS5tYXRjaFJhbmdlcyA9IG1hdGNoUmFuZ2VzXG5cdFx0fSk7XG5cdH1cblxuXHRwdWJsaWMgZ2V0SW5pdGlhbEVkaXRNYXRyaXgoXG5cdFx0cXVlcnk6IHN0cmluZyxcblx0XHRzdWJqZWN0OiBzdHJpbmcsXG5cdFx0ZWRpdENvc3RzOiBFZGl0Q29zdHMsXG5cdCk6IG51bWJlcltdW10ge1xuXHRcdGNvbnN0IGhlaWdodCA9IHF1ZXJ5Lmxlbmd0aCArIDE7XG5cdFx0Y29uc3Qgd2lkdGggPSBzdWJqZWN0Lmxlbmd0aCArIDE7XG5cblx0XHRjb25zdCBmaXJzdFJvdyA9IFtdO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgd2lkdGg7IGkrKykge1xuXHRcdFx0Zmlyc3RSb3cucHVzaChpICogZWRpdENvc3RzLnByZVF1ZXJ5SW5zZXJ0aW9uKTtcblx0XHR9XG5cblx0XHRjb25zdCBpbml0aWFsRWRpdE1hdHJpeCA9IFtmaXJzdFJvd107XG5cdFx0Zm9yIChsZXQgaSA9IDE7IGkgPCBoZWlnaHQ7IGkrKykge1xuXHRcdFx0Y29uc3Qgcm93ID0gbmV3IEFycmF5KHdpZHRoKTtcblx0XHRcdHJvd1swXSA9IGkgKiBlZGl0Q29zdHMuZGVsZXRpb247XG5cdFx0XHRpbml0aWFsRWRpdE1hdHJpeC5wdXNoKHJvdyk7XG5cdFx0fVxuXHRcdHJldHVybiBpbml0aWFsRWRpdE1hdHJpeDtcblx0fVxuXG5cdHB1YmxpYyBmaWxsRWRpdE1hdHJpeChcblx0XHRtYXRyaXg6IG51bWJlcltdW10sXG5cdFx0cXVlcnk6IHN0cmluZyxcblx0XHRzdWJqZWN0OiBzdHJpbmcsXG5cdFx0ZWRpdENvc3RzOiBFZGl0Q29zdHMsXG5cdCk6IG51bWJlcltdW10ge1xuXHRcdGNvbnN0IGhlaWdodCA9IG1hdHJpeC5sZW5ndGg7XG5cdFx0Y29uc3Qgd2lkdGggPSBtYXRyaXhbMF0ubGVuZ3RoO1xuXHRcdGNvbnN0IG9wZXJhdGlvbk1hdHJpeCA9IHRoaXMuZ2V0SW5pdGlhbE9wZXJhdGlvbk1hdHJpeChoZWlnaHQsIHdpZHRoKTtcblx0XHRmb3IgKGxldCByb3dJbmRleCA9IDE7IHJvd0luZGV4IDwgaGVpZ2h0OyByb3dJbmRleCsrKSB7XG5cdFx0XHRjb25zdCBpbnNlcnRpb25Db3N0ID0gcm93SW5kZXggPT09IChoZWlnaHQgLSAxKSA/IGVkaXRDb3N0cy5wb3N0UXVlcnlJbnNlcnRpb24gOiBlZGl0Q29zdHMuaW5zZXJ0aW9uO1xuXHRcdFx0Zm9yIChsZXQgY29sdW1uSW5kZXggPSAxOyBjb2x1bW5JbmRleCA8IHdpZHRoOyBjb2x1bW5JbmRleCsrKSB7XG5cdFx0XHRcdGNvbnN0IGRvZXNTdWJzdGl0dXRpb25SZXBsYWNlID0gcXVlcnlbcm93SW5kZXggLSAxXSAhPT0gc3ViamVjdFtjb2x1bW5JbmRleCAtIDFdO1xuXHRcdFx0XHRjb25zdCBzdWJzdGl0dXRpb25Db3N0ID0gZG9lc1N1YnN0aXR1dGlvblJlcGxhY2UgPyBlZGl0Q29zdHMuc3Vic3RpdHV0aW9uIDogMDtcblx0XHRcdFx0Y29uc3Qgb3BlcmF0aW9uQ29zdHMgPSBbXG5cdFx0XHRcdFx0bWF0cml4W3Jvd0luZGV4IC0gMV1bY29sdW1uSW5kZXhdICsgZWRpdENvc3RzLmRlbGV0aW9uLFxuXHRcdFx0XHRcdG1hdHJpeFtyb3dJbmRleF1bY29sdW1uSW5kZXggLSAxXSArIGluc2VydGlvbkNvc3QsXG5cdFx0XHRcdFx0bWF0cml4W3Jvd0luZGV4IC0gMV1bY29sdW1uSW5kZXggLSAxXSArIHN1YnN0aXR1dGlvbkNvc3QsXG5cdFx0XHRcdF07XG5cdFx0XHRcdGNvbnN0IG9wZXJhdGlvbkluZGV4ID0gZ2V0TWluSW5kZXgob3BlcmF0aW9uQ29zdHMpO1xuXHRcdFx0XHRtYXRyaXhbcm93SW5kZXhdW2NvbHVtbkluZGV4XSA9IG9wZXJhdGlvbkNvc3RzW29wZXJhdGlvbkluZGV4XTtcblx0XHRcdFx0aWYgKG9wZXJhdGlvbkluZGV4ID09PSAyICYmICFkb2VzU3Vic3RpdHV0aW9uUmVwbGFjZSkge1xuXHRcdFx0XHRcdG9wZXJhdGlvbk1hdHJpeFtyb3dJbmRleF1bY29sdW1uSW5kZXhdID0gMztcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRvcGVyYXRpb25NYXRyaXhbcm93SW5kZXhdW2NvbHVtbkluZGV4XSA9IG9wZXJhdGlvbkluZGV4O1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBvcGVyYXRpb25NYXRyaXg7XG5cdH1cblxuXHRwdWJsaWMgZ2V0SW5pdGlhbE9wZXJhdGlvbk1hdHJpeChoZWlnaHQ6IG51bWJlciwgd2lkdGg6IG51bWJlcik6IG51bWJlcltdW10ge1xuXHRcdGNvbnN0IGZpcnN0Um93ID0gW107XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB3aWR0aDsgaSsrKSB7XG5cdFx0XHRmaXJzdFJvdy5wdXNoKDEpO1xuXHRcdH1cblxuXHRcdGNvbnN0IG9wZXJhdGlvbk1hdHJpeCA9IFtmaXJzdFJvd107XG5cdFx0Zm9yKGxldCBpID0gMTsgaSA8IGhlaWdodDsgaSsrKSB7XG5cdFx0XHRjb25zdCByb3cgPSBuZXcgQXJyYXkod2lkdGgpO1xuXHRcdFx0cm93WzBdID0gMDtcblx0XHRcdG9wZXJhdGlvbk1hdHJpeC5wdXNoKHJvdyk7XG5cdFx0fVxuXHRcdHJldHVybiBvcGVyYXRpb25NYXRyaXg7XG5cdH1cblxuXHRwdWJsaWMgZ2V0TWF0Y2hSYW5nZXMob3BlcmF0aW9uTWF0cml4OiBudW1iZXJbXVtdKTogbnVtYmVyW11bXSB7XG5cdFx0bGV0IHlMb2MgPSBvcGVyYXRpb25NYXRyaXgubGVuZ3RoIC0gMTtcblx0XHRsZXQgeExvYyA9IG9wZXJhdGlvbk1hdHJpeFswXS5sZW5ndGggLSAxO1xuXHRcdGxldCBtYXRjaFJhbmdlczogbnVtYmVyW11bXSA9IFtdO1xuXHRcdGxldCByYW5nZTogbnVtYmVyW107XG5cblx0XHR3aGlsZSAoeUxvYyAhPT0gMCB8fCB4TG9jICE9PSAwKSB7XG5cdFx0XHRzd2l0Y2gob3BlcmF0aW9uTWF0cml4W3lMb2NdW3hMb2NdKSB7XG5cdFx0XHRcdGNhc2UgMDpcblx0XHRcdFx0XHR5TG9jLS1cblx0XHRcdFx0XHQvLyBkZWxldGluZyBhIGNoYXJhY3RlciBmcm9tIHN1YmplY3QgZG9lcyBub3QgYnJlYWsgdGhlIG1hdGNoUmFuZ2Ugc3RyZWFrXG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgMTpcblx0XHRcdFx0XHR4TG9jLS07XG5cdFx0XHRcdFx0aWYgKHJhbmdlKSB7XG5cdFx0XHRcdFx0XHRtYXRjaFJhbmdlcy5wdXNoKHJhbmdlKTtcblx0XHRcdFx0XHRcdHJhbmdlID0gdW5kZWZpbmVkO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHRcdHlMb2MtLTtcblx0XHRcdFx0XHR4TG9jLS07XG5cdFx0XHRcdFx0aWYgKHJhbmdlKSB7XG5cdFx0XHRcdFx0XHRtYXRjaFJhbmdlcy5wdXNoKHJhbmdlKTtcblx0XHRcdFx0XHRcdHJhbmdlID0gdW5kZWZpbmVkO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAzOlxuXHRcdFx0XHRcdHlMb2MtLTtcblx0XHRcdFx0XHR4TG9jLS07XG5cdFx0XHRcdFx0aWYgKHJhbmdlKSB7XG5cdFx0XHRcdFx0XHQvLyBjb250aW51ZXMgbWF0Y2hSYW5nZSBzdHJlYWtcblx0XHRcdFx0XHRcdHJhbmdlWzBdID0geExvYztcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Ly8gc3RhcnRzIHRoZSBtYXRjaFJhbmdlIHN0cmVha1xuXHRcdFx0XHRcdFx0cmFuZ2UgPSBbeExvYywgeExvY107XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZiAocmFuZ2UpIHtcblx0XHRcdG1hdGNoUmFuZ2VzLnB1c2gocmFuZ2UpO1xuXHRcdH1cblx0XHRyZXR1cm4gbWF0Y2hSYW5nZXMucmV2ZXJzZSgpO1xuXHR9XG5cbn1cblxuZnVuY3Rpb24gZ2V0KFxuXHRpdGVtOiBhbnksXG5cdGtleXNTdHJpbmc6IHN0cmluZyxcbikge1xuXHRjb25zdCBrZXlzID0ga2V5c1N0cmluZy5zcGxpdCgnLicpO1xuXHRmb3IobGV0IGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuXHRcdGl0ZW0gPSBpdGVtW2tleXNbaV1dXG5cdH1cblx0cmV0dXJuIGl0ZW07XG59XG5cbmZ1bmN0aW9uIHVuaXFCeShcblx0aXRlbXM6IGFueVtdLFxuXHRnZXRJdGVtS2V5OiAoaXRlbTogYW55KSA9PiBhbnkgPSBpZGVudGl0eSxcbikge1xuXHRjb25zdCBpdGVtS2V5U2V0ID0gbmV3IFNldCgpO1xuXHRyZXR1cm4gaXRlbXMuZmlsdGVyKChpdGVtOiBhbnkpID0+IHtcblx0XHRjb25zdCBrZXkgPSBnZXRJdGVtS2V5KGl0ZW0pO1xuXHRcdGlmIChpdGVtS2V5U2V0LmhhcyhrZXkpKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGl0ZW1LZXlTZXQuYWRkKGtleSk7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdH0pXG59XG5cbmZ1bmN0aW9uIGlkZW50aXR5KGl0ZW06IGFueSkge1xuXHRyZXR1cm4gaXRlbTtcbn1cblxuZnVuY3Rpb24gZ2V0TWluSW5kZXgobnVtYmVyczogbnVtYmVyW10pOiBudW1iZXIge1xuXHRsZXQgbWluSW5kZXggPSAwO1xuXHRsZXQgbWluVmFsdWUgPSBudW1iZXJzWzBdO1xuXHRmb3IgKGxldCBuZXh0SW5kZXggPSAxOyBuZXh0SW5kZXggPCBudW1iZXJzLmxlbmd0aDsgbmV4dEluZGV4KyspIHtcblx0XHRjb25zdCBuZXh0VmFsdWUgPSBudW1iZXJzW25leHRJbmRleF07XG5cdFx0aWYgKG5leHRWYWx1ZSA8IG1pblZhbHVlKSB7XG5cdFx0XHRtaW5JbmRleCA9IG5leHRJbmRleDtcblx0XHRcdG1pblZhbHVlID0gbmV4dFZhbHVlO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gbWluSW5kZXg7XG59XG4iXX0=