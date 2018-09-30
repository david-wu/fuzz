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
            subject: item[key],
            query: query
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

        var matchLocations = _this.getMatchLocations(operationMatrix);

        fuzzItem.editMatrix = editMatrix;
        fuzzItem.editDistance = editMatrix[editMatrix.length - 1][editMatrix[0].length - 1];
        fuzzItem.operationMatrix = operationMatrix;
        fuzzItem.matchLocations = matchLocations;
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
    key: "getMatchLocations",
    value: function getMatchLocations(operationMatrix) {
      var yLoc = operationMatrix.length - 1;
      var xLoc = operationMatrix[0].length - 1;
      var matchLocations = [];

      while (yLoc !== 0 || xLoc !== 0) {
        switch (operationMatrix[yLoc][xLoc]) {
          case 0:
            yLoc--;
            break;

          case 1:
            xLoc--;
            break;

          case 2:
            yLoc--;
            xLoc--;
            break;

          case 3:
            yLoc--;
            xLoc--;
            matchLocations.push(yLoc);
        }
      }

      return matchLocations.reverse();
    }
  }]);

  return Fuzz;
}();

exports.Fuzz = Fuzz;

_defineProperty(Fuzz, "DEFAULT_EDIT_THRESHOLD", 40);

_defineProperty(Fuzz, "DEFAULT_EDIT_COSTS", {
  substitution: 141,
  deletion: 100,
  insertion: 100,
  preQueryInsertion: 10,
  postQueryInsertion: 5
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mdXp6LmNsYXNzLnRzIl0sIm5hbWVzIjpbIkZ1enoiLCJERUZBVUxUX0VESVRfQ09TVFMiLCJERUZBVUxUX0VESVRfVEhSRVNIT0xEIiwiaXRlbXMiLCJzdWJqZWN0S2V5cyIsInF1ZXJ5IiwiZWRpdERpc3RhbmNlUGVyUXVlcnlMZW5ndGgiLCJmdXp6SXRlbXMiLCJnZXRGdXp6SXRlbXMiLCJzY29yZUZ1enpJdGVtcyIsImZpbHRlcmVkRnV6ekl0ZW1zIiwiZmlsdGVyIiwiZnV6ekl0ZW0iLCJlZGl0RGlzdGFuY2UiLCJsZW5ndGgiLCJzb3J0IiwiYSIsImIiLCJmb3JFYWNoIiwiaXRlbSIsImtleSIsInB1c2giLCJvcmlnaW5hbCIsInN1YmplY3QiLCJlZGl0TWF0cml4IiwiZ2V0SW5pdGlhbEVkaXRNYXRyaXgiLCJlZGl0Q29zdHMiLCJvcGVyYXRpb25NYXRyaXgiLCJmaWxsRWRpdE1hdHJpeCIsIm1hdGNoTG9jYXRpb25zIiwiZ2V0TWF0Y2hMb2NhdGlvbnMiLCJoZWlnaHQiLCJ3aWR0aCIsImZpcnN0Um93IiwiaSIsInByZVF1ZXJ5SW5zZXJ0aW9uIiwiaW5pdGlhbEVkaXRNYXRyaXgiLCJyb3ciLCJBcnJheSIsImRlbGV0aW9uIiwibWF0cml4IiwiZ2V0SW5pdGlhbE9wZXJhdGlvbk1hdHJpeCIsInJvd0luZGV4IiwiaW5zZXJ0aW9uQ29zdCIsInBvc3RRdWVyeUluc2VydGlvbiIsImluc2VydGlvbiIsImNvbHVtbkluZGV4IiwiZG9lc1N1YnN0aXR1dGlvblJlcGxhY2UiLCJzdWJzdGl0dXRpb25Db3N0Iiwic3Vic3RpdHV0aW9uIiwib3BlcmF0aW9uQ29zdHMiLCJvcGVyYXRpb25JbmRleCIsImdldE1pbkluZGV4IiwieUxvYyIsInhMb2MiLCJyZXZlcnNlIiwibnVtYmVycyIsIm1pbkluZGV4IiwibWluVmFsdWUiLCJuZXh0SW5kZXgiLCJuZXh0VmFsdWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBRWFBLEk7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QUEsSUFBSTtBQUNKQyxZQUFBQSxJQUFJO0FBQ0o7O0FBQ0QsZUFBSyxDQUFMO0FBQ0NELFlBQUFBLElBQUk7QUFDSkMsWUFBQUEsSUFBSTtBQUNKekIsWUFBQUEsY0FBYyxDQUFDUixJQUFmLENBQW9CZ0MsSUFBcEI7QUFkRjtBQWdCQTs7QUFDRCxhQUFPeEIsY0FBYyxDQUFDMEIsT0FBZixFQUFQO0FBQ0E7Ozs7Ozs7O2dCQTVLV3ZELEksNEJBRTRDLEU7O2dCQUY1Q0EsSSx3QkFHMkM7QUFDdERpRCxFQUFBQSxZQUFZLEVBQUUsR0FEd0M7QUFFdERWLEVBQUFBLFFBQVEsRUFBRSxHQUY0QztBQUd0RE0sRUFBQUEsU0FBUyxFQUFFLEdBSDJDO0FBSXREVixFQUFBQSxpQkFBaUIsRUFBRSxFQUptQztBQUt0RFMsRUFBQUEsa0JBQWtCLEVBQUU7QUFMa0MsQzs7QUE2S3hELFNBQVNRLFdBQVQsQ0FBcUJJLE9BQXJCLEVBQWdEO0FBQy9DLE1BQUlDLFFBQVEsR0FBRyxDQUFmO0FBQ0EsTUFBSUMsUUFBUSxHQUFHRixPQUFPLENBQUMsQ0FBRCxDQUF0Qjs7QUFDQSxPQUFLLElBQUlHLFNBQVMsR0FBRyxDQUFyQixFQUF3QkEsU0FBUyxHQUFHSCxPQUFPLENBQUMxQyxNQUE1QyxFQUFvRDZDLFNBQVMsRUFBN0QsRUFBaUU7QUFDaEUsUUFBTUMsU0FBUyxHQUFHSixPQUFPLENBQUNHLFNBQUQsQ0FBekI7O0FBQ0EsUUFBSUMsU0FBUyxHQUFHRixRQUFoQixFQUEwQjtBQUN6QkQsTUFBQUEsUUFBUSxHQUFHRSxTQUFYO0FBQ0FELE1BQUFBLFFBQVEsR0FBR0UsU0FBWDtBQUNBO0FBQ0Q7O0FBQ0QsU0FBT0gsUUFBUDtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRWRpdENvc3RzLCBGdXp6SXRlbSB9IGZyb20gJy4vbW9kZWxzJztcblxuZXhwb3J0IGNsYXNzIEZ1enoge1xuXG5cdHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgREVGQVVMVF9FRElUX1RIUkVTSE9MRDogbnVtYmVyID0gNDA7XG5cdHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgREVGQVVMVF9FRElUX0NPU1RTOiBFZGl0Q29zdHMgPSB7XG5cdFx0c3Vic3RpdHV0aW9uOiAxNDEsXG5cdFx0ZGVsZXRpb246IDEwMCxcblx0XHRpbnNlcnRpb246IDEwMCxcblx0XHRwcmVRdWVyeUluc2VydGlvbjogMTAsXG5cdFx0cG9zdFF1ZXJ5SW5zZXJ0aW9uOiA1LFxuXHR9XG5cblx0cHVibGljIGVkaXRDb3N0czogRWRpdENvc3RzID0geyAuLi5GdXp6LkRFRkFVTFRfRURJVF9DT1NUUyB9O1xuXHRwdWJsaWMgZWRpdERpc3RhbmNlUGVyUXVlcnlMZW5ndGg6IG51bWJlciA9IEZ1enouREVGQVVMVF9FRElUX1RIUkVTSE9MRDtcblxuXHRwdWJsaWMgZmlsdGVyU29ydChcblx0XHRpdGVtczogYW55W10sXG5cdFx0c3ViamVjdEtleXM6IHN0cmluZ1tdLFxuXHRcdHF1ZXJ5OiBzdHJpbmcsXG5cdFx0ZWRpdERpc3RhbmNlUGVyUXVlcnlMZW5ndGg6IG51bWJlciA9IHRoaXMuZWRpdERpc3RhbmNlUGVyUXVlcnlMZW5ndGgsXG5cdCk6IEZ1enpJdGVtW10ge1xuXHRcdGNvbnN0IGZ1enpJdGVtczogRnV6ekl0ZW1bXSA9IHRoaXMuZ2V0RnV6ekl0ZW1zKGl0ZW1zLCBzdWJqZWN0S2V5cywgcXVlcnkpO1xuXHRcdHRoaXMuc2NvcmVGdXp6SXRlbXMoZnV6ekl0ZW1zKTtcblx0XHRjb25zdCBmaWx0ZXJlZEZ1enpJdGVtcyA9IGZ1enpJdGVtcy5maWx0ZXIoKGZ1enpJdGVtOiBGdXp6SXRlbSkgPT4ge1xuXHRcdFx0cmV0dXJuIGZ1enpJdGVtLmVkaXREaXN0YW5jZSA8PSAoZWRpdERpc3RhbmNlUGVyUXVlcnlMZW5ndGggKiBmdXp6SXRlbS5xdWVyeS5sZW5ndGgpO1xuXHRcdH0pO1xuXHRcdGZpbHRlcmVkRnV6ekl0ZW1zLnNvcnQoKGE6IEZ1enpJdGVtLCBiOiBGdXp6SXRlbSkgPT4gYS5lZGl0RGlzdGFuY2UgLSBiLmVkaXREaXN0YW5jZSk7XG5cdFx0cmV0dXJuIGZpbHRlcmVkRnV6ekl0ZW1zO1xuXHR9XG5cblx0cHVibGljIHNvcnQoXG5cdFx0aXRlbXM6IGFueVtdLFxuXHRcdHN1YmplY3RLZXlzOiBzdHJpbmdbXSxcblx0XHRxdWVyeTogc3RyaW5nLFxuXHQpOiBGdXp6SXRlbVtdIHtcblx0XHRjb25zdCBmdXp6SXRlbXM6IEZ1enpJdGVtW10gPSB0aGlzLmdldEZ1enpJdGVtcyhpdGVtcywgc3ViamVjdEtleXMsIHF1ZXJ5KTtcblx0XHR0aGlzLnNjb3JlRnV6ekl0ZW1zKGZ1enpJdGVtcyk7XG5cdFx0ZnV6ekl0ZW1zLnNvcnQoKGE6IEZ1enpJdGVtLCBiOiBGdXp6SXRlbSkgPT4gYS5lZGl0RGlzdGFuY2UgLSBiLmVkaXREaXN0YW5jZSk7XG5cdFx0cmV0dXJuIGZ1enpJdGVtcztcblx0fVxuXG5cdHB1YmxpYyBnZXRGdXp6SXRlbXMoXG5cdFx0aXRlbXM6IGFueVtdLFxuXHRcdHN1YmplY3RLZXlzOiBzdHJpbmdbXSxcblx0XHRxdWVyeTogc3RyaW5nXG5cdCk6IEZ1enpJdGVtW10ge1xuXHRcdGNvbnN0IGZ1enpJdGVtczogRnV6ekl0ZW1bXSA9IFtdO1xuXHRcdGl0ZW1zLmZvckVhY2goKGl0ZW06IGFueSkgPT4ge1xuXHRcdFx0c3ViamVjdEtleXMuZm9yRWFjaCgoa2V5OiBzdHJpbmcpID0+IHtcblx0XHRcdFx0ZnV6ekl0ZW1zLnB1c2goe1xuXHRcdFx0XHRcdG9yaWdpbmFsOiBpdGVtLFxuXHRcdFx0XHRcdGtleToga2V5LFxuXHRcdFx0XHRcdHN1YmplY3Q6IGl0ZW1ba2V5XSxcblx0XHRcdFx0XHRxdWVyeTogcXVlcnksXG5cdFx0XHRcdH0gYXMgRnV6ekl0ZW0pO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIGZ1enpJdGVtcztcblx0fVxuXG5cdHB1YmxpYyBzY29yZUZ1enpJdGVtcyhmdXp6SXRlbXM6IEZ1enpJdGVtW10pIHtcblx0XHRmdXp6SXRlbXMuZm9yRWFjaCgoZnV6ekl0ZW06IEZ1enpJdGVtKSA9PiB7XG5cdFx0XHRjb25zdCBlZGl0TWF0cml4ID0gdGhpcy5nZXRJbml0aWFsRWRpdE1hdHJpeChcblx0XHRcdFx0ZnV6ekl0ZW0ucXVlcnksXG5cdFx0XHRcdGZ1enpJdGVtLnN1YmplY3QsXG5cdFx0XHRcdHRoaXMuZWRpdENvc3RzLFxuXHRcdFx0KTtcblx0XHRcdGNvbnN0IG9wZXJhdGlvbk1hdHJpeCA9IHRoaXMuZmlsbEVkaXRNYXRyaXgoXG5cdFx0XHRcdGVkaXRNYXRyaXgsXG5cdFx0XHRcdGZ1enpJdGVtLnF1ZXJ5LFxuXHRcdFx0XHRmdXp6SXRlbS5zdWJqZWN0LFxuXHRcdFx0XHR0aGlzLmVkaXRDb3N0cyxcblx0XHRcdCk7XG5cdFx0XHRjb25zdCBtYXRjaExvY2F0aW9ucyA9IHRoaXMuZ2V0TWF0Y2hMb2NhdGlvbnMob3BlcmF0aW9uTWF0cml4KTtcblx0XHRcdGZ1enpJdGVtLmVkaXRNYXRyaXggPSBlZGl0TWF0cml4O1xuXHRcdFx0ZnV6ekl0ZW0uZWRpdERpc3RhbmNlID0gZWRpdE1hdHJpeFtlZGl0TWF0cml4Lmxlbmd0aCAtIDFdW2VkaXRNYXRyaXhbMF0ubGVuZ3RoIC0gMV07XG5cdFx0XHRmdXp6SXRlbS5vcGVyYXRpb25NYXRyaXggPSBvcGVyYXRpb25NYXRyaXg7XG5cdFx0XHRmdXp6SXRlbS5tYXRjaExvY2F0aW9ucyA9IG1hdGNoTG9jYXRpb25zO1xuXHRcdH0pO1xuXHR9XG5cblx0cHVibGljIGdldEluaXRpYWxFZGl0TWF0cml4KFxuXHRcdHF1ZXJ5OiBzdHJpbmcsXG5cdFx0c3ViamVjdDogc3RyaW5nLFxuXHRcdGVkaXRDb3N0czogRWRpdENvc3RzLFxuXHQpOiBudW1iZXJbXVtdIHtcblx0XHRjb25zdCBoZWlnaHQgPSBxdWVyeS5sZW5ndGggKyAxO1xuXHRcdGNvbnN0IHdpZHRoID0gc3ViamVjdC5sZW5ndGggKyAxO1xuXG5cdFx0Y29uc3QgZmlyc3RSb3cgPSBbXTtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHdpZHRoOyBpKyspIHtcblx0XHRcdGZpcnN0Um93LnB1c2goaSAqIGVkaXRDb3N0cy5wcmVRdWVyeUluc2VydGlvbik7XG5cdFx0fVxuXG5cdFx0Y29uc3QgaW5pdGlhbEVkaXRNYXRyaXggPSBbZmlyc3RSb3ddO1xuXHRcdGZvciAobGV0IGkgPSAxOyBpIDwgaGVpZ2h0OyBpKyspIHtcblx0XHRcdGNvbnN0IHJvdyA9IG5ldyBBcnJheSh3aWR0aCk7XG5cdFx0XHRyb3dbMF0gPSBpICogZWRpdENvc3RzLmRlbGV0aW9uO1xuXHRcdFx0aW5pdGlhbEVkaXRNYXRyaXgucHVzaChyb3cpO1xuXHRcdH1cblx0XHRyZXR1cm4gaW5pdGlhbEVkaXRNYXRyaXg7XG5cdH1cblxuXHRwdWJsaWMgZmlsbEVkaXRNYXRyaXgoXG5cdFx0bWF0cml4OiBudW1iZXJbXVtdLFxuXHRcdHF1ZXJ5OiBzdHJpbmcsXG5cdFx0c3ViamVjdDogc3RyaW5nLFxuXHRcdGVkaXRDb3N0czogRWRpdENvc3RzLFxuXHQpOiBudW1iZXJbXVtdIHtcblx0XHRjb25zdCBoZWlnaHQgPSBtYXRyaXgubGVuZ3RoO1xuXHRcdGNvbnN0IHdpZHRoID0gbWF0cml4WzBdLmxlbmd0aDtcblx0XHRjb25zdCBvcGVyYXRpb25NYXRyaXggPSB0aGlzLmdldEluaXRpYWxPcGVyYXRpb25NYXRyaXgoaGVpZ2h0LCB3aWR0aCk7XG5cdFx0Zm9yIChsZXQgcm93SW5kZXggPSAxOyByb3dJbmRleCA8IGhlaWdodDsgcm93SW5kZXgrKykge1xuXHRcdFx0Y29uc3QgaW5zZXJ0aW9uQ29zdCA9IHJvd0luZGV4ID09PSAoaGVpZ2h0IC0gMSkgPyBlZGl0Q29zdHMucG9zdFF1ZXJ5SW5zZXJ0aW9uIDogZWRpdENvc3RzLmluc2VydGlvbjtcblx0XHRcdGZvciAobGV0IGNvbHVtbkluZGV4ID0gMTsgY29sdW1uSW5kZXggPCB3aWR0aDsgY29sdW1uSW5kZXgrKykge1xuXHRcdFx0XHRjb25zdCBkb2VzU3Vic3RpdHV0aW9uUmVwbGFjZSA9IHF1ZXJ5W3Jvd0luZGV4IC0gMV0gIT09IHN1YmplY3RbY29sdW1uSW5kZXggLSAxXTtcblx0XHRcdFx0Y29uc3Qgc3Vic3RpdHV0aW9uQ29zdCA9IGRvZXNTdWJzdGl0dXRpb25SZXBsYWNlID8gZWRpdENvc3RzLnN1YnN0aXR1dGlvbiA6IDA7XG5cdFx0XHRcdGNvbnN0IG9wZXJhdGlvbkNvc3RzID0gW1xuXHRcdFx0XHRcdG1hdHJpeFtyb3dJbmRleCAtIDFdW2NvbHVtbkluZGV4XSArIGVkaXRDb3N0cy5kZWxldGlvbixcblx0XHRcdFx0XHRtYXRyaXhbcm93SW5kZXhdW2NvbHVtbkluZGV4IC0gMV0gKyBpbnNlcnRpb25Db3N0LFxuXHRcdFx0XHRcdG1hdHJpeFtyb3dJbmRleCAtIDFdW2NvbHVtbkluZGV4IC0gMV0gKyBzdWJzdGl0dXRpb25Db3N0LFxuXHRcdFx0XHRdO1xuXHRcdFx0XHRjb25zdCBvcGVyYXRpb25JbmRleCA9IGdldE1pbkluZGV4KG9wZXJhdGlvbkNvc3RzKTtcblx0XHRcdFx0bWF0cml4W3Jvd0luZGV4XVtjb2x1bW5JbmRleF0gPSBvcGVyYXRpb25Db3N0c1tvcGVyYXRpb25JbmRleF07XG5cdFx0XHRcdGlmIChvcGVyYXRpb25JbmRleCA9PT0gMiAmJiAhZG9lc1N1YnN0aXR1dGlvblJlcGxhY2UpIHtcblx0XHRcdFx0XHRvcGVyYXRpb25NYXRyaXhbcm93SW5kZXhdW2NvbHVtbkluZGV4XSA9IDM7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0b3BlcmF0aW9uTWF0cml4W3Jvd0luZGV4XVtjb2x1bW5JbmRleF0gPSBvcGVyYXRpb25JbmRleDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gb3BlcmF0aW9uTWF0cml4O1xuXHR9XG5cblx0cHVibGljIGdldEluaXRpYWxPcGVyYXRpb25NYXRyaXgoaGVpZ2h0OiBudW1iZXIsIHdpZHRoOiBudW1iZXIpOiBudW1iZXJbXVtdIHtcblx0XHRjb25zdCBmaXJzdFJvdyA9IFtdO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgd2lkdGg7IGkrKykge1xuXHRcdFx0Zmlyc3RSb3cucHVzaCgxKTtcblx0XHR9XG5cblx0XHRjb25zdCBvcGVyYXRpb25NYXRyaXggPSBbZmlyc3RSb3ddO1xuXHRcdGZvcihsZXQgaSA9IDE7IGkgPCBoZWlnaHQ7IGkrKykge1xuXHRcdFx0Y29uc3Qgcm93ID0gbmV3IEFycmF5KHdpZHRoKTtcblx0XHRcdHJvd1swXSA9IDA7XG5cdFx0XHRvcGVyYXRpb25NYXRyaXgucHVzaChyb3cpO1xuXHRcdH1cblx0XHRyZXR1cm4gb3BlcmF0aW9uTWF0cml4O1xuXHR9XG5cblx0cHVibGljIGdldE1hdGNoTG9jYXRpb25zKG9wZXJhdGlvbk1hdHJpeDogbnVtYmVyW11bXSk6IG51bWJlcltdIHtcblx0XHRsZXQgeUxvYyA9IG9wZXJhdGlvbk1hdHJpeC5sZW5ndGggLSAxO1xuXHRcdGxldCB4TG9jID0gb3BlcmF0aW9uTWF0cml4WzBdLmxlbmd0aCAtIDE7XG5cdFx0bGV0IG1hdGNoTG9jYXRpb25zID0gW107XG5cblx0XHR3aGlsZSAoeUxvYyAhPT0gMCB8fCB4TG9jICE9PSAwKSB7XG5cdFx0XHRzd2l0Y2gob3BlcmF0aW9uTWF0cml4W3lMb2NdW3hMb2NdKSB7XG5cdFx0XHRcdGNhc2UgMDpcblx0XHRcdFx0XHR5TG9jLS1cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHRcdHhMb2MtLTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHRcdHlMb2MtLTtcblx0XHRcdFx0XHR4TG9jLS07XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgMzpcblx0XHRcdFx0XHR5TG9jLS07XG5cdFx0XHRcdFx0eExvYy0tO1xuXHRcdFx0XHRcdG1hdGNoTG9jYXRpb25zLnB1c2goeUxvYyk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBtYXRjaExvY2F0aW9ucy5yZXZlcnNlKCk7XG5cdH1cblxufVxuXG5mdW5jdGlvbiBnZXRNaW5JbmRleChudW1iZXJzOiBudW1iZXJbXSk6IG51bWJlciB7XG5cdGxldCBtaW5JbmRleCA9IDA7XG5cdGxldCBtaW5WYWx1ZSA9IG51bWJlcnNbMF07XG5cdGZvciAobGV0IG5leHRJbmRleCA9IDE7IG5leHRJbmRleCA8IG51bWJlcnMubGVuZ3RoOyBuZXh0SW5kZXgrKykge1xuXHRcdGNvbnN0IG5leHRWYWx1ZSA9IG51bWJlcnNbbmV4dEluZGV4XTtcblx0XHRpZiAobmV4dFZhbHVlIDwgbWluVmFsdWUpIHtcblx0XHRcdG1pbkluZGV4ID0gbmV4dEluZGV4O1xuXHRcdFx0bWluVmFsdWUgPSBuZXh0VmFsdWU7XG5cdFx0fVxuXHR9XG5cdHJldHVybiBtaW5JbmRleDtcbn1cbiJdfQ==