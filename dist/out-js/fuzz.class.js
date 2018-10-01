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

    _defineProperty(this, "editDistancePerQueryLength", Fuzz.DEFAULT_EDIT_THRESHOLD);
  }

  _createClass(Fuzz, [{
    key: "filterSort",
    value: function filterSort(items, subjectKeys, query) {
      var editDistancePerQueryLength = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : this.editDistancePerQueryLength;
      var fuzzItems = this.getFuzzItems(items, subjectKeys, query);
      this.scoreFuzzItems(fuzzItems);

      if (!query) {
        return fuzzItems;
      }

      var filteredFuzzItems = fuzzItems.filter(function (fuzzItem) {
        return fuzzItem.editDistance <= editDistancePerQueryLength * fuzzItem.query.length;
      });
      filteredFuzzItems.sort(function (a, b) {
        return a.editDistance - b.editDistance;
      });
      return filteredFuzzItems;
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
      return fuzzItems;
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

_defineProperty(Fuzz, "DEFAULT_EDIT_THRESHOLD", 45);

_defineProperty(Fuzz, "DEFAULT_EDIT_COSTS", {
  substitution: 141,
  deletion: 100,
  insertion: 100,
  preQueryInsertion: 4,
  postQueryInsertion: 2
});

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mdXp6LmNsYXNzLnRzIl0sIm5hbWVzIjpbIkZ1enoiLCJERUZBVUxUX0VESVRfQ09TVFMiLCJERUZBVUxUX0VESVRfVEhSRVNIT0xEIiwiaXRlbXMiLCJzdWJqZWN0S2V5cyIsInF1ZXJ5IiwiZWRpdERpc3RhbmNlUGVyUXVlcnlMZW5ndGgiLCJmdXp6SXRlbXMiLCJnZXRGdXp6SXRlbXMiLCJzY29yZUZ1enpJdGVtcyIsImZpbHRlcmVkRnV6ekl0ZW1zIiwiZmlsdGVyIiwiZnV6ekl0ZW0iLCJlZGl0RGlzdGFuY2UiLCJsZW5ndGgiLCJzb3J0IiwiYSIsImIiLCJmb3JFYWNoIiwiaXRlbSIsImtleSIsInB1c2giLCJvcmlnaW5hbCIsInN1YmplY3QiLCJ0b0xvd2VyQ2FzZSIsImVkaXRNYXRyaXgiLCJnZXRJbml0aWFsRWRpdE1hdHJpeCIsImVkaXRDb3N0cyIsIm9wZXJhdGlvbk1hdHJpeCIsImZpbGxFZGl0TWF0cml4IiwibWF0Y2hSYW5nZXMiLCJnZXRNYXRjaFJhbmdlcyIsImhlaWdodCIsIndpZHRoIiwiZmlyc3RSb3ciLCJpIiwicHJlUXVlcnlJbnNlcnRpb24iLCJpbml0aWFsRWRpdE1hdHJpeCIsInJvdyIsIkFycmF5IiwiZGVsZXRpb24iLCJtYXRyaXgiLCJnZXRJbml0aWFsT3BlcmF0aW9uTWF0cml4Iiwicm93SW5kZXgiLCJpbnNlcnRpb25Db3N0IiwicG9zdFF1ZXJ5SW5zZXJ0aW9uIiwiaW5zZXJ0aW9uIiwiY29sdW1uSW5kZXgiLCJkb2VzU3Vic3RpdHV0aW9uUmVwbGFjZSIsInN1YnN0aXR1dGlvbkNvc3QiLCJzdWJzdGl0dXRpb24iLCJvcGVyYXRpb25Db3N0cyIsIm9wZXJhdGlvbkluZGV4IiwiZ2V0TWluSW5kZXgiLCJ5TG9jIiwieExvYyIsInJhbmdlIiwidW5kZWZpbmVkIiwicmV2ZXJzZSIsIm51bWJlcnMiLCJtaW5JbmRleCIsIm1pblZhbHVlIiwibmV4dEluZGV4IiwibmV4dFZhbHVlIl0sIm1hcHBpbmdz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aUIsRUFBRSxDQUptQztBQUt0RFMsRUFBQUEsa0JBQWtCLEVBQUU7QUFMa0MsQzs7QUFtTXhELFNBQVNRLFdBQVQsQ0FBcUJNLE9BQXJCLEVBQWdEO0FBQy9DLE1BQUlDLFFBQVEsR0FBRyxDQUFmO0FBQ0EsTUFBSUMsUUFBUSxHQUFHRixPQUFPLENBQUMsQ0FBRCxDQUF0Qjs7QUFDQSxPQUFLLElBQUlHLFNBQVMsR0FBRyxDQUFyQixFQUF3QkEsU0FBUyxHQUFHSCxPQUFPLENBQUM3QyxNQUE1QyxFQUFvRGdELFNBQVMsRUFBN0QsRUFBaUU7QUFDaEUsUUFBTUMsU0FBUyxHQUFHSixPQUFPLENBQUNHLFNBQUQsQ0FBekI7O0FBQ0EsUUFBSUMsU0FBUyxHQUFHRixRQUFoQixFQUEwQjtBQUN6QkQsTUFBQUEsUUFBUSxHQUFHRSxTQUFYO0FBQ0FELE1BQUFBLFFBQVEsR0FBR0UsU0FBWDtBQUNBO0FBQ0Q7O0FBQ0QsU0FBT0gsUUFBUDtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRWRpdENvc3RzLCBGdXp6SXRlbSB9IGZyb20gJy4vbW9kZWxzJztcblxuZXhwb3J0IGNsYXNzIEZ1enoge1xuXG5cdHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgREVGQVVMVF9FRElUX1RIUkVTSE9MRDogbnVtYmVyID0gNDU7XG5cdHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgREVGQVVMVF9FRElUX0NPU1RTOiBFZGl0Q29zdHMgPSB7XG5cdFx0c3Vic3RpdHV0aW9uOiAxNDEsXG5cdFx0ZGVsZXRpb246IDEwMCxcblx0XHRpbnNlcnRpb246IDEwMCxcblx0XHRwcmVRdWVyeUluc2VydGlvbjogNCxcblx0XHRwb3N0UXVlcnlJbnNlcnRpb246IDIsXG5cdH1cblxuXHRwdWJsaWMgZWRpdENvc3RzOiBFZGl0Q29zdHMgPSB7IC4uLkZ1enouREVGQVVMVF9FRElUX0NPU1RTIH07XG5cdHB1YmxpYyBlZGl0RGlzdGFuY2VQZXJRdWVyeUxlbmd0aDogbnVtYmVyID0gRnV6ei5ERUZBVUxUX0VESVRfVEhSRVNIT0xEO1xuXG5cdHB1YmxpYyBmaWx0ZXJTb3J0KFxuXHRcdGl0ZW1zOiBhbnlbXSxcblx0XHRzdWJqZWN0S2V5czogc3RyaW5nW10sXG5cdFx0cXVlcnk6IHN0cmluZyxcblx0XHRlZGl0RGlzdGFuY2VQZXJRdWVyeUxlbmd0aDogbnVtYmVyID0gdGhpcy5lZGl0RGlzdGFuY2VQZXJRdWVyeUxlbmd0aCxcblx0KTogRnV6ekl0ZW1bXSB7XG5cdFx0Y29uc3QgZnV6ekl0ZW1zOiBGdXp6SXRlbVtdID0gdGhpcy5nZXRGdXp6SXRlbXMoaXRlbXMsIHN1YmplY3RLZXlzLCBxdWVyeSk7XG5cdFx0dGhpcy5zY29yZUZ1enpJdGVtcyhmdXp6SXRlbXMpO1xuXHRcdGlmICghcXVlcnkpIHsgcmV0dXJuIGZ1enpJdGVtczsgfVxuXHRcdGNvbnN0IGZpbHRlcmVkRnV6ekl0ZW1zID0gZnV6ekl0ZW1zLmZpbHRlcigoZnV6ekl0ZW06IEZ1enpJdGVtKSA9PiB7XG5cdFx0XHRyZXR1cm4gZnV6ekl0ZW0uZWRpdERpc3RhbmNlIDw9IChlZGl0RGlzdGFuY2VQZXJRdWVyeUxlbmd0aCAqIGZ1enpJdGVtLnF1ZXJ5Lmxlbmd0aCk7XG5cdFx0fSk7XG5cdFx0ZmlsdGVyZWRGdXp6SXRlbXMuc29ydCgoYTogRnV6ekl0ZW0sIGI6IEZ1enpJdGVtKSA9PiBhLmVkaXREaXN0YW5jZSAtIGIuZWRpdERpc3RhbmNlKTtcblx0XHRyZXR1cm4gZmlsdGVyZWRGdXp6SXRlbXM7XG5cdH1cblxuXHRwdWJsaWMgc29ydChcblx0XHRpdGVtczogYW55W10sXG5cdFx0c3ViamVjdEtleXM6IHN0cmluZ1tdLFxuXHRcdHF1ZXJ5OiBzdHJpbmcsXG5cdCk6IEZ1enpJdGVtW10ge1xuXHRcdGNvbnN0IGZ1enpJdGVtczogRnV6ekl0ZW1bXSA9IHRoaXMuZ2V0RnV6ekl0ZW1zKGl0ZW1zLCBzdWJqZWN0S2V5cywgcXVlcnkpO1xuXHRcdHRoaXMuc2NvcmVGdXp6SXRlbXMoZnV6ekl0ZW1zKTtcblx0XHRpZiAoIXF1ZXJ5KSB7IHJldHVybiBmdXp6SXRlbXM7IH1cblx0XHRmdXp6SXRlbXMuc29ydCgoYTogRnV6ekl0ZW0sIGI6IEZ1enpJdGVtKSA9PiBhLmVkaXREaXN0YW5jZSAtIGIuZWRpdERpc3RhbmNlKTtcblx0XHRyZXR1cm4gZnV6ekl0ZW1zO1xuXHR9XG5cblx0cHVibGljIGdldEZ1enpJdGVtcyhcblx0XHRpdGVtczogYW55W10sXG5cdFx0c3ViamVjdEtleXM6IHN0cmluZ1tdLFxuXHRcdHF1ZXJ5OiBzdHJpbmdcblx0KTogRnV6ekl0ZW1bXSB7XG5cdFx0Y29uc3QgZnV6ekl0ZW1zOiBGdXp6SXRlbVtdID0gW107XG5cdFx0aXRlbXMuZm9yRWFjaCgoaXRlbTogYW55KSA9PiB7XG5cdFx0XHRzdWJqZWN0S2V5cy5mb3JFYWNoKChrZXk6IHN0cmluZykgPT4ge1xuXHRcdFx0XHRmdXp6SXRlbXMucHVzaCh7XG5cdFx0XHRcdFx0b3JpZ2luYWw6IGl0ZW0sXG5cdFx0XHRcdFx0a2V5OiBrZXksXG5cdFx0XHRcdFx0c3ViamVjdDogaXRlbVtrZXldLnRvTG93ZXJDYXNlKCksXG5cdFx0XHRcdFx0cXVlcnk6IHF1ZXJ5LnRvTG93ZXJDYXNlKCksXG5cdFx0XHRcdH0gYXMgRnV6ekl0ZW0pO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIGZ1enpJdGVtcztcblx0fVxuXG5cdHB1YmxpYyBzY29yZUZ1enpJdGVtcyhmdXp6SXRlbXM6IEZ1enpJdGVtW10pIHtcblx0XHRmdXp6SXRlbXMuZm9yRWFjaCgoZnV6ekl0ZW06IEZ1enpJdGVtKSA9PiB7XG5cdFx0XHRjb25zdCBlZGl0TWF0cml4ID0gdGhpcy5nZXRJbml0aWFsRWRpdE1hdHJpeChcblx0XHRcdFx0ZnV6ekl0ZW0ucXVlcnksXG5cdFx0XHRcdGZ1enpJdGVtLnN1YmplY3QsXG5cdFx0XHRcdHRoaXMuZWRpdENvc3RzLFxuXHRcdFx0KTtcblx0XHRcdGNvbnN0IG9wZXJhdGlvbk1hdHJpeCA9IHRoaXMuZmlsbEVkaXRNYXRyaXgoXG5cdFx0XHRcdGVkaXRNYXRyaXgsXG5cdFx0XHRcdGZ1enpJdGVtLnF1ZXJ5LFxuXHRcdFx0XHRmdXp6SXRlbS5zdWJqZWN0LFxuXHRcdFx0XHR0aGlzLmVkaXRDb3N0cyxcblx0XHRcdCk7XG5cdFx0XHRjb25zdCBtYXRjaFJhbmdlcyA9IHRoaXMuZ2V0TWF0Y2hSYW5nZXMob3BlcmF0aW9uTWF0cml4KTtcblx0XHRcdGZ1enpJdGVtLmVkaXRNYXRyaXggPSBlZGl0TWF0cml4O1xuXHRcdFx0ZnV6ekl0ZW0uZWRpdERpc3RhbmNlID0gZWRpdE1hdHJpeFtlZGl0TWF0cml4Lmxlbmd0aCAtIDFdW2VkaXRNYXRyaXhbMF0ubGVuZ3RoIC0gMV07XG5cdFx0XHRmdXp6SXRlbS5vcGVyYXRpb25NYXRyaXggPSBvcGVyYXRpb25NYXRyaXg7XG5cdFx0XHRmdXp6SXRlbS5tYXRjaFJhbmdlcyA9IG1hdGNoUmFuZ2VzXG5cdFx0fSk7XG5cdH1cblxuXHRwdWJsaWMgZ2V0SW5pdGlhbEVkaXRNYXRyaXgoXG5cdFx0cXVlcnk6IHN0cmluZyxcblx0XHRzdWJqZWN0OiBzdHJpbmcsXG5cdFx0ZWRpdENvc3RzOiBFZGl0Q29zdHMsXG5cdCk6IG51bWJlcltdW10ge1xuXHRcdGNvbnN0IGhlaWdodCA9IHF1ZXJ5Lmxlbmd0aCArIDE7XG5cdFx0Y29uc3Qgd2lkdGggPSBzdWJqZWN0Lmxlbmd0aCArIDE7XG5cblx0XHRjb25zdCBmaXJzdFJvdyA9IFtdO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgd2lkdGg7IGkrKykge1xuXHRcdFx0Zmlyc3RSb3cucHVzaChpICogZWRpdENvc3RzLnByZVF1ZXJ5SW5zZXJ0aW9uKTtcblx0XHR9XG5cblx0XHRjb25zdCBpbml0aWFsRWRpdE1hdHJpeCA9IFtmaXJzdFJvd107XG5cdFx0Zm9yIChsZXQgaSA9IDE7IGkgPCBoZWlnaHQ7IGkrKykge1xuXHRcdFx0Y29uc3Qgcm93ID0gbmV3IEFycmF5KHdpZHRoKTtcblx0XHRcdHJvd1swXSA9IGkgKiBlZGl0Q29zdHMuZGVsZXRpb247XG5cdFx0XHRpbml0aWFsRWRpdE1hdHJpeC5wdXNoKHJvdyk7XG5cdFx0fVxuXHRcdHJldHVybiBpbml0aWFsRWRpdE1hdHJpeDtcblx0fVxuXG5cdHB1YmxpYyBmaWxsRWRpdE1hdHJpeChcblx0XHRtYXRyaXg6IG51bWJlcltdW10sXG5cdFx0cXVlcnk6IHN0cmluZyxcblx0XHRzdWJqZWN0OiBzdHJpbmcsXG5cdFx0ZWRpdENvc3RzOiBFZGl0Q29zdHMsXG5cdCk6IG51bWJlcltdW10ge1xuXHRcdGNvbnN0IGhlaWdodCA9IG1hdHJpeC5sZW5ndGg7XG5cdFx0Y29uc3Qgd2lkdGggPSBtYXRyaXhbMF0ubGVuZ3RoO1xuXHRcdGNvbnN0IG9wZXJhdGlvbk1hdHJpeCA9IHRoaXMuZ2V0SW5pdGlhbE9wZXJhdGlvbk1hdHJpeChoZWlnaHQsIHdpZHRoKTtcblx0XHRmb3IgKGxldCByb3dJbmRleCA9IDE7IHJvd0luZGV4IDwgaGVpZ2h0OyByb3dJbmRleCsrKSB7XG5cdFx0XHRjb25zdCBpbnNlcnRpb25Db3N0ID0gcm93SW5kZXggPT09IChoZWlnaHQgLSAxKSA/IGVkaXRDb3N0cy5wb3N0UXVlcnlJbnNlcnRpb24gOiBlZGl0Q29zdHMuaW5zZXJ0aW9uO1xuXHRcdFx0Zm9yIChsZXQgY29sdW1uSW5kZXggPSAxOyBjb2x1bW5JbmRleCA8IHdpZHRoOyBjb2x1bW5JbmRleCsrKSB7XG5cdFx0XHRcdGNvbnN0IGRvZXNTdWJzdGl0dXRpb25SZXBsYWNlID0gcXVlcnlbcm93SW5kZXggLSAxXSAhPT0gc3ViamVjdFtjb2x1bW5JbmRleCAtIDFdO1xuXHRcdFx0XHRjb25zdCBzdWJzdGl0dXRpb25Db3N0ID0gZG9lc1N1YnN0aXR1dGlvblJlcGxhY2UgPyBlZGl0Q29zdHMuc3Vic3RpdHV0aW9uIDogMDtcblx0XHRcdFx0Y29uc3Qgb3BlcmF0aW9uQ29zdHMgPSBbXG5cdFx0XHRcdFx0bWF0cml4W3Jvd0luZGV4IC0gMV1bY29sdW1uSW5kZXhdICsgZWRpdENvc3RzLmRlbGV0aW9uLFxuXHRcdFx0XHRcdG1hdHJpeFtyb3dJbmRleF1bY29sdW1uSW5kZXggLSAxXSArIGluc2VydGlvbkNvc3QsXG5cdFx0XHRcdFx0bWF0cml4W3Jvd0luZGV4IC0gMV1bY29sdW1uSW5kZXggLSAxXSArIHN1YnN0aXR1dGlvbkNvc3QsXG5cdFx0XHRcdF07XG5cdFx0XHRcdGNvbnN0IG9wZXJhdGlvbkluZGV4ID0gZ2V0TWluSW5kZXgob3BlcmF0aW9uQ29zdHMpO1xuXHRcdFx0XHRtYXRyaXhbcm93SW5kZXhdW2NvbHVtbkluZGV4XSA9IG9wZXJhdGlvbkNvc3RzW29wZXJhdGlvbkluZGV4XTtcblx0XHRcdFx0aWYgKG9wZXJhdGlvbkluZGV4ID09PSAyICYmICFkb2VzU3Vic3RpdHV0aW9uUmVwbGFjZSkge1xuXHRcdFx0XHRcdG9wZXJhdGlvbk1hdHJpeFtyb3dJbmRleF1bY29sdW1uSW5kZXhdID0gMztcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRvcGVyYXRpb25NYXRyaXhbcm93SW5kZXhdW2NvbHVtbkluZGV4XSA9IG9wZXJhdGlvbkluZGV4O1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBvcGVyYXRpb25NYXRyaXg7XG5cdH1cblxuXHRwdWJsaWMgZ2V0SW5pdGlhbE9wZXJhdGlvbk1hdHJpeChoZWlnaHQ6IG51bWJlciwgd2lkdGg6IG51bWJlcik6IG51bWJlcltdW10ge1xuXHRcdGNvbnN0IGZpcnN0Um93ID0gW107XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB3aWR0aDsgaSsrKSB7XG5cdFx0XHRmaXJzdFJvdy5wdXNoKDEpO1xuXHRcdH1cblxuXHRcdGNvbnN0IG9wZXJhdGlvbk1hdHJpeCA9IFtmaXJzdFJvd107XG5cdFx0Zm9yKGxldCBpID0gMTsgaSA8IGhlaWdodDsgaSsrKSB7XG5cdFx0XHRjb25zdCByb3cgPSBuZXcgQXJyYXkod2lkdGgpO1xuXHRcdFx0cm93WzBdID0gMDtcblx0XHRcdG9wZXJhdGlvbk1hdHJpeC5wdXNoKHJvdyk7XG5cdFx0fVxuXHRcdHJldHVybiBvcGVyYXRpb25NYXRyaXg7XG5cdH1cblxuXHRwdWJsaWMgZ2V0TWF0Y2hSYW5nZXMob3BlcmF0aW9uTWF0cml4OiBudW1iZXJbXVtdKTogbnVtYmVyW11bXSB7XG5cdFx0bGV0IHlMb2MgPSBvcGVyYXRpb25NYXRyaXgubGVuZ3RoIC0gMTtcblx0XHRsZXQgeExvYyA9IG9wZXJhdGlvbk1hdHJpeFswXS5sZW5ndGggLSAxO1xuXHRcdGxldCBtYXRjaFJhbmdlczogbnVtYmVyW11bXSA9IFtdO1xuXHRcdGxldCByYW5nZTogbnVtYmVyW107XG5cblx0XHR3aGlsZSAoeUxvYyAhPT0gMCB8fCB4TG9jICE9PSAwKSB7XG5cdFx0XHRzd2l0Y2gob3BlcmF0aW9uTWF0cml4W3lMb2NdW3hMb2NdKSB7XG5cdFx0XHRcdGNhc2UgMDpcblx0XHRcdFx0XHR5TG9jLS1cblx0XHRcdFx0XHQvLyBkZWxldGluZyBhIGNoYXJhY3RlciBmcm9tIHN1YmplY3QgZG9lcyBub3QgYnJlYWsgdGhlIG1hdGNoUmFuZ2Ugc3RyZWFrXG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgMTpcblx0XHRcdFx0XHR4TG9jLS07XG5cdFx0XHRcdFx0aWYgKHJhbmdlKSB7XG5cdFx0XHRcdFx0XHRtYXRjaFJhbmdlcy5wdXNoKHJhbmdlKTtcblx0XHRcdFx0XHRcdHJhbmdlID0gdW5kZWZpbmVkO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHRcdHlMb2MtLTtcblx0XHRcdFx0XHR4TG9jLS07XG5cdFx0XHRcdFx0aWYgKHJhbmdlKSB7XG5cdFx0XHRcdFx0XHRtYXRjaFJhbmdlcy5wdXNoKHJhbmdlKTtcblx0XHRcdFx0XHRcdHJhbmdlID0gdW5kZWZpbmVkO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAzOlxuXHRcdFx0XHRcdHlMb2MtLTtcblx0XHRcdFx0XHR4TG9jLS07XG5cdFx0XHRcdFx0aWYgKHJhbmdlKSB7XG5cdFx0XHRcdFx0XHQvLyBjb250aW51ZXMgbWF0Y2hSYW5nZSBzdHJlYWtcblx0XHRcdFx0XHRcdHJhbmdlWzBdID0geExvYztcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Ly8gc3RhcnRzIHRoZSBtYXRjaFJhbmdlIHN0cmVha1xuXHRcdFx0XHRcdFx0cmFuZ2UgPSBbeExvYywgeExvY107XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZiAocmFuZ2UpIHtcblx0XHRcdG1hdGNoUmFuZ2VzLnB1c2gocmFuZ2UpO1xuXHRcdH1cblx0XHRyZXR1cm4gbWF0Y2hSYW5nZXMucmV2ZXJzZSgpO1xuXHR9XG5cbn1cblxuZnVuY3Rpb24gZ2V0TWluSW5kZXgobnVtYmVyczogbnVtYmVyW10pOiBudW1iZXIge1xuXHRsZXQgbWluSW5kZXggPSAwO1xuXHRsZXQgbWluVmFsdWUgPSBudW1iZXJzWzBdO1xuXHRmb3IgKGxldCBuZXh0SW5kZXggPSAxOyBuZXh0SW5kZXggPCBudW1iZXJzLmxlbmd0aDsgbmV4dEluZGV4KyspIHtcblx0XHRjb25zdCBuZXh0VmFsdWUgPSBudW1iZXJzW25leHRJbmRleF07XG5cdFx0aWYgKG5leHRWYWx1ZSA8IG1pblZhbHVlKSB7XG5cdFx0XHRtaW5JbmRleCA9IG5leHRJbmRleDtcblx0XHRcdG1pblZhbHVlID0gbmV4dFZhbHVlO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gbWluSW5kZXg7XG59XG4iXX0=