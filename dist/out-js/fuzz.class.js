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
      var fuzzItems = [];
      items.forEach(function (item) {
        subjectKeys.forEach(function (key) {
          fuzzItems.push({
            original: item,
            key: key,
            subject: item[key].toLowerCase(),
            query: query.toLowerCase()
          });
        });
      });
      return fuzzItems;
    }
  }, {
    key: "scoreFuzzItems",
    value: function scoreFuzzItems(fuzzItems) {
      var _this = this;

      fuzzItems.forEach(function (fuzzItem) {
        var editMatrix = _this.getInitialEditMatrix(fuzzItem.query, fuzzItem.subject, _this.editCosts);

        var operationMatrix = _this.fillEditMatrix(editMatrix, fuzzItem.query, fuzzItem.subject, _this.editCosts);

        var matchRanges = _this.getMatchRanges(operationMatrix);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mdXp6LmNsYXNzLnRzIl0sIm5hbWVzIjpbIkZ1enoiLCJERUZBVUxUX0VESVRfQ09TVFMiLCJERUZBVUxUX0ZJTFRFUl9USFJFU0hPTEQiLCJpdGVtcyIsInN1YmplY3RLZXlzIiwicXVlcnkiLCJmaWx0ZXJUaHJlc2hvbGQiLCJmdXp6SXRlbXMiLCJnZXRGdXp6SXRlbXMiLCJzY29yZUZ1enpJdGVtcyIsImZpbHRlcmVkRnV6ekl0ZW1zIiwiZmlsdGVyIiwiZnV6ekl0ZW0iLCJlZGl0RGlzdGFuY2UiLCJsZW5ndGgiLCJzb3J0IiwiYSIsImIiLCJ1bmlxQnkiLCJvcmlnaW5hbCIsImZvckVhY2giLCJpdGVtIiwia2V5IiwicHVzaCIsInN1YmplY3QiLCJ0b0xvd2VyQ2FzZSIsImVkaXRNYXRyaXgiLCJnZXRJbml0aWFsRWRpdE1hdHJpeCIsImVkaXRDb3N0cyIsIm9wZXJhdGlvbk1hdHJpeCIsImZpbGxFZGl0TWF0cml4IiwibWF0Y2hSYW5nZXMiLCJnZXRNYXRjaFJhbmdlcyIsImhlaWdodCIsIndpZHRoIiwiZmlyc3RSb3ciLCJpIiwicHJlUXVlcnlJbnNlcnRpb24iLCJpbml0aWFsRWRpdE1hdHJpeCIsInJvdyIsIkFycmF5IiwiZGVsZXRpb24iLCJtYXRyaXgiLCJnZXRJbml0aWFsT3BlcmF0aW9uTWF0cml4Iiwicm93SW5kZXgiLCJpbnNlcnRpb25Db3N0IiwicG9zdFF1ZXJ5SW5zZXJ0aW9uIiwiaW5zZXJ0aW9uIiwiY29sdW1uSW5kZXgiLCJkb2VzU3Vic3RpdHV0aW9uUmVwbGFjZSIsInN1YnN0aXR1dGlvbkNvc3QiLCJzdWJzdGl0dXRpb24iLCJvcGVyYXRpb25Db3N0cyIsIm9wZXJhdGlvbkluZGV4IiwiZ2V0TWluSW5kZXgiLCJ5TG9jIiwieExvYyIsInJhbmdlIiwidW5kZWZpbmVkIiwicmV2ZXJzZSIsImdldEl0ZW1LZXkiLCJpZGVudGl0eSIsIml0ZW1LZXlTZXQiLCJTZXQiLCJoYXMiLCJhZGQiLCJudW1iZXJzIiwi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QVMsR0FBR0osT0FBTyxDQUFDRyxTQUFELENBQXpCOztBQUNBLFFBQUlDLFNBQVMsR0FBR0YsUUFBaEIsRUFBMEI7QUFDekJELE1BQUFBLFFBQVEsR0FBR0UsU0FBWDtBQUNBRCxNQUFBQSxRQUFRLEdBQUdFLFNBQVg7QUFDQTtBQUNEOztBQUNELFNBQU9ILFFBQVA7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEVkaXRDb3N0cywgRnV6ekl0ZW0gfSBmcm9tICcuL21vZGVscyc7XG5cbmV4cG9ydCBjbGFzcyBGdXp6IHtcblxuXHRwdWJsaWMgc3RhdGljIHJlYWRvbmx5IERFRkFVTFRfRURJVF9DT1NUUzogRWRpdENvc3RzID0ge1xuXHRcdHN1YnN0aXR1dGlvbjogMTQxLFxuXHRcdGRlbGV0aW9uOiAxMDAsXG5cdFx0aW5zZXJ0aW9uOiAxMDAsXG5cdFx0cHJlUXVlcnlJbnNlcnRpb246IDQsXG5cdFx0cG9zdFF1ZXJ5SW5zZXJ0aW9uOiAyLFxuXHR9XG5cdC8vIGVkaXQgZGlzdGFuY2UgYWxsb3dlZCBwZXIgcXVlcnkgbGVuZ3RoXG5cdHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgREVGQVVMVF9GSUxURVJfVEhSRVNIT0xEOiBudW1iZXIgPSA0NTtcblxuXHRwdWJsaWMgZWRpdENvc3RzOiBFZGl0Q29zdHMgPSB7IC4uLkZ1enouREVGQVVMVF9FRElUX0NPU1RTIH07XG5cdHB1YmxpYyBmaWx0ZXJUaHJlc2hvbGQ6IG51bWJlciA9IEZ1enouREVGQVVMVF9GSUxURVJfVEhSRVNIT0xEO1xuXG5cdHB1YmxpYyBmaWx0ZXJTb3J0KFxuXHRcdGl0ZW1zOiBhbnlbXSxcblx0XHRzdWJqZWN0S2V5czogc3RyaW5nW10sXG5cdFx0cXVlcnk6IHN0cmluZyxcblx0XHRmaWx0ZXJUaHJlc2hvbGQ6IG51bWJlciA9IHRoaXMuZmlsdGVyVGhyZXNob2xkLFxuXHQpOiBGdXp6SXRlbVtdIHtcblx0XHRjb25zdCBmdXp6SXRlbXM6IEZ1enpJdGVtW10gPSB0aGlzLmdldEZ1enpJdGVtcyhpdGVtcywgc3ViamVjdEtleXMsIHF1ZXJ5KTtcblx0XHR0aGlzLnNjb3JlRnV6ekl0ZW1zKGZ1enpJdGVtcyk7XG5cdFx0aWYgKCFxdWVyeSkgeyByZXR1cm4gZnV6ekl0ZW1zOyB9XG5cdFx0Y29uc3QgZmlsdGVyZWRGdXp6SXRlbXMgPSBmdXp6SXRlbXMuZmlsdGVyKChmdXp6SXRlbTogRnV6ekl0ZW0pID0+IHtcblx0XHRcdHJldHVybiBmdXp6SXRlbS5lZGl0RGlzdGFuY2UgPD0gKGZpbHRlclRocmVzaG9sZCAqIGZ1enpJdGVtLnF1ZXJ5Lmxlbmd0aCk7XG5cdFx0fSk7XG5cdFx0ZmlsdGVyZWRGdXp6SXRlbXMuc29ydCgoYTogRnV6ekl0ZW0sIGI6IEZ1enpJdGVtKSA9PiBhLmVkaXREaXN0YW5jZSAtIGIuZWRpdERpc3RhbmNlKTtcblx0XHRyZXR1cm4gdW5pcUJ5KGZpbHRlcmVkRnV6ekl0ZW1zLCAoZnV6ekl0ZW06IEZ1enpJdGVtKSA9PiBmdXp6SXRlbS5vcmlnaW5hbCk7XG5cdH1cblxuXHRwdWJsaWMgc29ydChcblx0XHRpdGVtczogYW55W10sXG5cdFx0c3ViamVjdEtleXM6IHN0cmluZ1tdLFxuXHRcdHF1ZXJ5OiBzdHJpbmcsXG5cdCk6IEZ1enpJdGVtW10ge1xuXHRcdGNvbnN0IGZ1enpJdGVtczogRnV6ekl0ZW1bXSA9IHRoaXMuZ2V0RnV6ekl0ZW1zKGl0ZW1zLCBzdWJqZWN0S2V5cywgcXVlcnkpO1xuXHRcdHRoaXMuc2NvcmVGdXp6SXRlbXMoZnV6ekl0ZW1zKTtcblx0XHRpZiAoIXF1ZXJ5KSB7IHJldHVybiBmdXp6SXRlbXM7IH1cblx0XHRmdXp6SXRlbXMuc29ydCgoYTogRnV6ekl0ZW0sIGI6IEZ1enpJdGVtKSA9PiBhLmVkaXREaXN0YW5jZSAtIGIuZWRpdERpc3RhbmNlKTtcblx0XHRyZXR1cm4gdW5pcUJ5KGZ1enpJdGVtcywgKGZ1enpJdGVtOiBGdXp6SXRlbSkgPT4gZnV6ekl0ZW0ub3JpZ2luYWwpO1xuXHR9XG5cblx0cHVibGljIGdldEZ1enpJdGVtcyhcblx0XHRpdGVtczogYW55W10sXG5cdFx0c3ViamVjdEtleXM6IHN0cmluZ1tdLFxuXHRcdHF1ZXJ5OiBzdHJpbmdcblx0KTogRnV6ekl0ZW1bXSB7XG5cdFx0Y29uc3QgZnV6ekl0ZW1zOiBGdXp6SXRlbVtdID0gW107XG5cdFx0aXRlbXMuZm9yRWFjaCgoaXRlbTogYW55KSA9PiB7XG5cdFx0XHRzdWJqZWN0S2V5cy5mb3JFYWNoKChrZXk6IHN0cmluZykgPT4ge1xuXHRcdFx0XHRmdXp6SXRlbXMucHVzaCh7XG5cdFx0XHRcdFx0b3JpZ2luYWw6IGl0ZW0sXG5cdFx0XHRcdFx0a2V5OiBrZXksXG5cdFx0XHRcdFx0c3ViamVjdDogaXRlbVtrZXldLnRvTG93ZXJDYXNlKCksXG5cdFx0XHRcdFx0cXVlcnk6IHF1ZXJ5LnRvTG93ZXJDYXNlKCksXG5cdFx0XHRcdH0gYXMgRnV6ekl0ZW0pO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIGZ1enpJdGVtcztcblx0fVxuXG5cdHB1YmxpYyBzY29yZUZ1enpJdGVtcyhmdXp6SXRlbXM6IEZ1enpJdGVtW10pIHtcblx0XHRmdXp6SXRlbXMuZm9yRWFjaCgoZnV6ekl0ZW06IEZ1enpJdGVtKSA9PiB7XG5cdFx0XHRjb25zdCBlZGl0TWF0cml4ID0gdGhpcy5nZXRJbml0aWFsRWRpdE1hdHJpeChcblx0XHRcdFx0ZnV6ekl0ZW0ucXVlcnksXG5cdFx0XHRcdGZ1enpJdGVtLnN1YmplY3QsXG5cdFx0XHRcdHRoaXMuZWRpdENvc3RzLFxuXHRcdFx0KTtcblx0XHRcdGNvbnN0IG9wZXJhdGlvbk1hdHJpeCA9IHRoaXMuZmlsbEVkaXRNYXRyaXgoXG5cdFx0XHRcdGVkaXRNYXRyaXgsXG5cdFx0XHRcdGZ1enpJdGVtLnF1ZXJ5LFxuXHRcdFx0XHRmdXp6SXRlbS5zdWJqZWN0LFxuXHRcdFx0XHR0aGlzLmVkaXRDb3N0cyxcblx0XHRcdCk7XG5cdFx0XHRjb25zdCBtYXRjaFJhbmdlcyA9IHRoaXMuZ2V0TWF0Y2hSYW5nZXMob3BlcmF0aW9uTWF0cml4KTtcblx0XHRcdGZ1enpJdGVtLmVkaXRNYXRyaXggPSBlZGl0TWF0cml4O1xuXHRcdFx0ZnV6ekl0ZW0uZWRpdERpc3RhbmNlID0gZWRpdE1hdHJpeFtlZGl0TWF0cml4Lmxlbmd0aCAtIDFdW2VkaXRNYXRyaXhbMF0ubGVuZ3RoIC0gMV07XG5cdFx0XHRmdXp6SXRlbS5vcGVyYXRpb25NYXRyaXggPSBvcGVyYXRpb25NYXRyaXg7XG5cdFx0XHRmdXp6SXRlbS5tYXRjaFJhbmdlcyA9IG1hdGNoUmFuZ2VzXG5cdFx0fSk7XG5cdH1cblxuXHRwdWJsaWMgZ2V0SW5pdGlhbEVkaXRNYXRyaXgoXG5cdFx0cXVlcnk6IHN0cmluZyxcblx0XHRzdWJqZWN0OiBzdHJpbmcsXG5cdFx0ZWRpdENvc3RzOiBFZGl0Q29zdHMsXG5cdCk6IG51bWJlcltdW10ge1xuXHRcdGNvbnN0IGhlaWdodCA9IHF1ZXJ5Lmxlbmd0aCArIDE7XG5cdFx0Y29uc3Qgd2lkdGggPSBzdWJqZWN0Lmxlbmd0aCArIDE7XG5cblx0XHRjb25zdCBmaXJzdFJvdyA9IFtdO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgd2lkdGg7IGkrKykge1xuXHRcdFx0Zmlyc3RSb3cucHVzaChpICogZWRpdENvc3RzLnByZVF1ZXJ5SW5zZXJ0aW9uKTtcblx0XHR9XG5cblx0XHRjb25zdCBpbml0aWFsRWRpdE1hdHJpeCA9IFtmaXJzdFJvd107XG5cdFx0Zm9yIChsZXQgaSA9IDE7IGkgPCBoZWlnaHQ7IGkrKykge1xuXHRcdFx0Y29uc3Qgcm93ID0gbmV3IEFycmF5KHdpZHRoKTtcblx0XHRcdHJvd1swXSA9IGkgKiBlZGl0Q29zdHMuZGVsZXRpb247XG5cdFx0XHRpbml0aWFsRWRpdE1hdHJpeC5wdXNoKHJvdyk7XG5cdFx0fVxuXHRcdHJldHVybiBpbml0aWFsRWRpdE1hdHJpeDtcblx0fVxuXG5cdHB1YmxpYyBmaWxsRWRpdE1hdHJpeChcblx0XHRtYXRyaXg6IG51bWJlcltdW10sXG5cdFx0cXVlcnk6IHN0cmluZyxcblx0XHRzdWJqZWN0OiBzdHJpbmcsXG5cdFx0ZWRpdENvc3RzOiBFZGl0Q29zdHMsXG5cdCk6IG51bWJlcltdW10ge1xuXHRcdGNvbnN0IGhlaWdodCA9IG1hdHJpeC5sZW5ndGg7XG5cdFx0Y29uc3Qgd2lkdGggPSBtYXRyaXhbMF0ubGVuZ3RoO1xuXHRcdGNvbnN0IG9wZXJhdGlvbk1hdHJpeCA9IHRoaXMuZ2V0SW5pdGlhbE9wZXJhdGlvbk1hdHJpeChoZWlnaHQsIHdpZHRoKTtcblx0XHRmb3IgKGxldCByb3dJbmRleCA9IDE7IHJvd0luZGV4IDwgaGVpZ2h0OyByb3dJbmRleCsrKSB7XG5cdFx0XHRjb25zdCBpbnNlcnRpb25Db3N0ID0gcm93SW5kZXggPT09IChoZWlnaHQgLSAxKSA/IGVkaXRDb3N0cy5wb3N0UXVlcnlJbnNlcnRpb24gOiBlZGl0Q29zdHMuaW5zZXJ0aW9uO1xuXHRcdFx0Zm9yIChsZXQgY29sdW1uSW5kZXggPSAxOyBjb2x1bW5JbmRleCA8IHdpZHRoOyBjb2x1bW5JbmRleCsrKSB7XG5cdFx0XHRcdGNvbnN0IGRvZXNTdWJzdGl0dXRpb25SZXBsYWNlID0gcXVlcnlbcm93SW5kZXggLSAxXSAhPT0gc3ViamVjdFtjb2x1bW5JbmRleCAtIDFdO1xuXHRcdFx0XHRjb25zdCBzdWJzdGl0dXRpb25Db3N0ID0gZG9lc1N1YnN0aXR1dGlvblJlcGxhY2UgPyBlZGl0Q29zdHMuc3Vic3RpdHV0aW9uIDogMDtcblx0XHRcdFx0Y29uc3Qgb3BlcmF0aW9uQ29zdHMgPSBbXG5cdFx0XHRcdFx0bWF0cml4W3Jvd0luZGV4IC0gMV1bY29sdW1uSW5kZXhdICsgZWRpdENvc3RzLmRlbGV0aW9uLFxuXHRcdFx0XHRcdG1hdHJpeFtyb3dJbmRleF1bY29sdW1uSW5kZXggLSAxXSArIGluc2VydGlvbkNvc3QsXG5cdFx0XHRcdFx0bWF0cml4W3Jvd0luZGV4IC0gMV1bY29sdW1uSW5kZXggLSAxXSArIHN1YnN0aXR1dGlvbkNvc3QsXG5cdFx0XHRcdF07XG5cdFx0XHRcdGNvbnN0IG9wZXJhdGlvbkluZGV4ID0gZ2V0TWluSW5kZXgob3BlcmF0aW9uQ29zdHMpO1xuXHRcdFx0XHRtYXRyaXhbcm93SW5kZXhdW2NvbHVtbkluZGV4XSA9IG9wZXJhdGlvbkNvc3RzW29wZXJhdGlvbkluZGV4XTtcblx0XHRcdFx0aWYgKG9wZXJhdGlvbkluZGV4ID09PSAyICYmICFkb2VzU3Vic3RpdHV0aW9uUmVwbGFjZSkge1xuXHRcdFx0XHRcdG9wZXJhdGlvbk1hdHJpeFtyb3dJbmRleF1bY29sdW1uSW5kZXhdID0gMztcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRvcGVyYXRpb25NYXRyaXhbcm93SW5kZXhdW2NvbHVtbkluZGV4XSA9IG9wZXJhdGlvbkluZGV4O1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBvcGVyYXRpb25NYXRyaXg7XG5cdH1cblxuXHRwdWJsaWMgZ2V0SW5pdGlhbE9wZXJhdGlvbk1hdHJpeChoZWlnaHQ6IG51bWJlciwgd2lkdGg6IG51bWJlcik6IG51bWJlcltdW10ge1xuXHRcdGNvbnN0IGZpcnN0Um93ID0gW107XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB3aWR0aDsgaSsrKSB7XG5cdFx0XHRmaXJzdFJvdy5wdXNoKDEpO1xuXHRcdH1cblxuXHRcdGNvbnN0IG9wZXJhdGlvbk1hdHJpeCA9IFtmaXJzdFJvd107XG5cdFx0Zm9yKGxldCBpID0gMTsgaSA8IGhlaWdodDsgaSsrKSB7XG5cdFx0XHRjb25zdCByb3cgPSBuZXcgQXJyYXkod2lkdGgpO1xuXHRcdFx0cm93WzBdID0gMDtcblx0XHRcdG9wZXJhdGlvbk1hdHJpeC5wdXNoKHJvdyk7XG5cdFx0fVxuXHRcdHJldHVybiBvcGVyYXRpb25NYXRyaXg7XG5cdH1cblxuXHRwdWJsaWMgZ2V0TWF0Y2hSYW5nZXMob3BlcmF0aW9uTWF0cml4OiBudW1iZXJbXVtdKTogbnVtYmVyW11bXSB7XG5cdFx0bGV0IHlMb2MgPSBvcGVyYXRpb25NYXRyaXgubGVuZ3RoIC0gMTtcblx0XHRsZXQgeExvYyA9IG9wZXJhdGlvbk1hdHJpeFswXS5sZW5ndGggLSAxO1xuXHRcdGxldCBtYXRjaFJhbmdlczogbnVtYmVyW11bXSA9IFtdO1xuXHRcdGxldCByYW5nZTogbnVtYmVyW107XG5cblx0XHR3aGlsZSAoeUxvYyAhPT0gMCB8fCB4TG9jICE9PSAwKSB7XG5cdFx0XHRzd2l0Y2gob3BlcmF0aW9uTWF0cml4W3lMb2NdW3hMb2NdKSB7XG5cdFx0XHRcdGNhc2UgMDpcblx0XHRcdFx0XHR5TG9jLS1cblx0XHRcdFx0XHQvLyBkZWxldGluZyBhIGNoYXJhY3RlciBmcm9tIHN1YmplY3QgZG9lcyBub3QgYnJlYWsgdGhlIG1hdGNoUmFuZ2Ugc3RyZWFrXG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgMTpcblx0XHRcdFx0XHR4TG9jLS07XG5cdFx0XHRcdFx0aWYgKHJhbmdlKSB7XG5cdFx0XHRcdFx0XHRtYXRjaFJhbmdlcy5wdXNoKHJhbmdlKTtcblx0XHRcdFx0XHRcdHJhbmdlID0gdW5kZWZpbmVkO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHRcdHlMb2MtLTtcblx0XHRcdFx0XHR4TG9jLS07XG5cdFx0XHRcdFx0aWYgKHJhbmdlKSB7XG5cdFx0XHRcdFx0XHRtYXRjaFJhbmdlcy5wdXNoKHJhbmdlKTtcblx0XHRcdFx0XHRcdHJhbmdlID0gdW5kZWZpbmVkO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAzOlxuXHRcdFx0XHRcdHlMb2MtLTtcblx0XHRcdFx0XHR4TG9jLS07XG5cdFx0XHRcdFx0aWYgKHJhbmdlKSB7XG5cdFx0XHRcdFx0XHQvLyBjb250aW51ZXMgbWF0Y2hSYW5nZSBzdHJlYWtcblx0XHRcdFx0XHRcdHJhbmdlWzBdID0geExvYztcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Ly8gc3RhcnRzIHRoZSBtYXRjaFJhbmdlIHN0cmVha1xuXHRcdFx0XHRcdFx0cmFuZ2UgPSBbeExvYywgeExvY107XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZiAocmFuZ2UpIHtcblx0XHRcdG1hdGNoUmFuZ2VzLnB1c2gocmFuZ2UpO1xuXHRcdH1cblx0XHRyZXR1cm4gbWF0Y2hSYW5nZXMucmV2ZXJzZSgpO1xuXHR9XG5cbn1cblxuZnVuY3Rpb24gdW5pcUJ5KFxuXHRpdGVtczogYW55W10sXG5cdGdldEl0ZW1LZXk6IChpdGVtOiBhbnkpID0+IGFueSA9IGlkZW50aXR5LFxuKSB7XG5cdGNvbnN0IGl0ZW1LZXlTZXQgPSBuZXcgU2V0KCk7XG5cdHJldHVybiBpdGVtcy5maWx0ZXIoKGl0ZW06IGFueSkgPT4ge1xuXHRcdGNvbnN0IGtleSA9IGdldEl0ZW1LZXkoaXRlbSk7XG5cdFx0aWYgKGl0ZW1LZXlTZXQuaGFzKGtleSkpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0aXRlbUtleVNldC5hZGQoa2V5KTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0fSlcbn1cblxuZnVuY3Rpb24gaWRlbnRpdHkoaXRlbTogYW55KSB7XG5cdHJldHVybiBpdGVtO1xufVxuXG5mdW5jdGlvbiBnZXRNaW5JbmRleChudW1iZXJzOiBudW1iZXJbXSk6IG51bWJlciB7XG5cdGxldCBtaW5JbmRleCA9IDA7XG5cdGxldCBtaW5WYWx1ZSA9IG51bWJlcnNbMF07XG5cdGZvciAobGV0IG5leHRJbmRleCA9IDE7IG5leHRJbmRleCA8IG51bWJlcnMubGVuZ3RoOyBuZXh0SW5kZXgrKykge1xuXHRcdGNvbnN0IG5leHRWYWx1ZSA9IG51bWJlcnNbbmV4dEluZGV4XTtcblx0XHRpZiAobmV4dFZhbHVlIDwgbWluVmFsdWUpIHtcblx0XHRcdG1pbkluZGV4ID0gbmV4dEluZGV4O1xuXHRcdFx0bWluVmFsdWUgPSBuZXh0VmFsdWU7XG5cdFx0fVxuXHR9XG5cdHJldHVybiBtaW5JbmRleDtcbn1cbiJdfQ==