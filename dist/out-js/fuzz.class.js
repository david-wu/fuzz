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

        fuzzItem.editMatrix = editMatrix;
        fuzzItem.editDistance = editMatrix[editMatrix.length - 1][editMatrix[0].length - 1];
        fuzzItem.operationMatrix = operationMatrix;
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
    key: "getSubstitutionOperations",
    value: function getSubstitutionOperations(operationMatrix) {
      var yLoc = operationMatrix.length - 1;
      var xLoc = operationMatrix[0].length - 1;
      var substitutionOperations = [];
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mdXp6LmNsYXNzLnRzIl0sIm5hbWVzIjpbIkZ1enoiLCJERUZBVUxUX0VESVRfQ09TVFMiLCJERUZBVUxUX0VESVRfVEhSRVNIT0xEIiwiaXRlbXMiLCJzdWJqZWN0S2V5cyIsInF1ZXJ5IiwiZWRpdERpc3RhbmNlUGVyUXVlcnlMZW5ndGgiLCJmdXp6SXRlbXMiLCJnZXRGdXp6SXRlbXMiLCJzY29yZUZ1enpJdGVtcyIsImZpbHRlcmVkRnV6ekl0ZW1zIiwiZmlsdGVyIiwiZnV6ekl0ZW0iLCJlZGl0RGlzdGFuY2UiLCJsZW5ndGgiLCJzb3J0IiwiYSIsImIiLCJmb3JFYWNoIiwiaXRlbSIsImtleSIsInB1c2giLCJvcmlnaW5hbCIsInN1YmplY3QiLCJlZGl0TWF0cml4IiwiZ2V0SW5pdGlhbEVkaXRNYXRyaXgiLCJlZGl0Q29zdHMiLCJvcGVyYXRpb25NYXRyaXgiLCJmaWxsRWRpdE1hdHJpeCIsImhlaWdodCIsIndpZHRoIiwiZmlyc3RSb3ciLCJpIiwicHJlUXVlcnlJbnNlcnRpb24iLCJpbml0aWFsRWRpdE1hdHJpeCIsInJvdyIsIkFycmF5IiwiZGVsZXRpb24iLCJtYXRyaXgiLCJnZXRJbml0aWFsT3BlcmF0aW9uTWF0cml4Iiwicm93SW5kZXgiLCJpbnNlcnRpb25Db3N0IiwicG9zdFF1ZXJ5SW5zZXJ0aW9uIiwiaW5zZXJ0aW9uIiwiY29sdW1uSW5kZXgiLCJkb2VzU3Vic3RpdHV0aW9uUmVwbGFjZSIsInN1YnN0aXR1dGlvbkNvc3QiLCJzdWJzdGl0dXRpb24iLCJvcGVyYXRpb25Db3N0cyIsIm9wZXJhdGlvbkluZGV4IiwiZ2V0TWluSW5kZXgiLCJ5TG9jIiwieExvYyIsInN1YnN0aXR1dGlvbk9wZXJhdGlvbnMiLCJudW1iZXJzIiwibWluSW5kZXgiLCJtaW5WYWx1ZSIsIm5leHRJbmRleCIsIm5leHRWYWx1ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFFYUEsSTs7Ozs7O3lEQVd1QkEsSUFBSSxDQUFD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LEdBQUcsQ0FBckIsRUFBd0JBLFNBQVMsR0FBR0gsT0FBTyxDQUFDeEMsTUFBNUMsRUFBb0QyQyxTQUFTLEVBQTdELEVBQWlFO0FBQ2hFLFFBQU1DLFNBQVMsR0FBR0osT0FBTyxDQUFDRyxTQUFELENBQXpCOztBQUNBLFFBQUlDLFNBQVMsR0FBR0YsUUFBaEIsRUFBMEI7QUFDekJELE1BQUFBLFFBQVEsR0FBR0UsU0FBWDtBQUNBRCxNQUFBQSxRQUFRLEdBQUdFLFNBQVg7QUFDQTtBQUNEOztBQUNELFNBQU9ILFFBQVA7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEVkaXRDb3N0cywgRnV6ekl0ZW0gfSBmcm9tICcuL21vZGVscyc7XG5cbmV4cG9ydCBjbGFzcyBGdXp6IHtcblxuXHRwdWJsaWMgc3RhdGljIHJlYWRvbmx5IERFRkFVTFRfRURJVF9USFJFU0hPTEQ6IG51bWJlciA9IDQwO1xuXHRwdWJsaWMgc3RhdGljIHJlYWRvbmx5IERFRkFVTFRfRURJVF9DT1NUUzogRWRpdENvc3RzID0ge1xuXHRcdHN1YnN0aXR1dGlvbjogMTQxLFxuXHRcdGRlbGV0aW9uOiAxMDAsXG5cdFx0aW5zZXJ0aW9uOiAxMDAsXG5cdFx0cHJlUXVlcnlJbnNlcnRpb246IDEwLFxuXHRcdHBvc3RRdWVyeUluc2VydGlvbjogNSxcblx0fVxuXG5cdHB1YmxpYyBlZGl0Q29zdHM6IEVkaXRDb3N0cyA9IHsgLi4uRnV6ei5ERUZBVUxUX0VESVRfQ09TVFMgfTtcblx0cHVibGljIGVkaXREaXN0YW5jZVBlclF1ZXJ5TGVuZ3RoOiBudW1iZXIgPSBGdXp6LkRFRkFVTFRfRURJVF9USFJFU0hPTEQ7XG5cblx0cHVibGljIGZpbHRlclNvcnQoXG5cdFx0aXRlbXM6IGFueVtdLFxuXHRcdHN1YmplY3RLZXlzOiBzdHJpbmdbXSxcblx0XHRxdWVyeTogc3RyaW5nLFxuXHRcdGVkaXREaXN0YW5jZVBlclF1ZXJ5TGVuZ3RoOiBudW1iZXIgPSB0aGlzLmVkaXREaXN0YW5jZVBlclF1ZXJ5TGVuZ3RoLFxuXHQpIHtcblx0XHRjb25zdCBmdXp6SXRlbXM6IEZ1enpJdGVtW10gPSB0aGlzLmdldEZ1enpJdGVtcyhpdGVtcywgc3ViamVjdEtleXMsIHF1ZXJ5KTtcblx0XHR0aGlzLnNjb3JlRnV6ekl0ZW1zKGZ1enpJdGVtcyk7XG5cdFx0Y29uc3QgZmlsdGVyZWRGdXp6SXRlbXMgPSBmdXp6SXRlbXMuZmlsdGVyKChmdXp6SXRlbTogRnV6ekl0ZW0pID0+IHtcblx0XHRcdHJldHVybiBmdXp6SXRlbS5lZGl0RGlzdGFuY2UgPD0gKGVkaXREaXN0YW5jZVBlclF1ZXJ5TGVuZ3RoICogZnV6ekl0ZW0ucXVlcnkubGVuZ3RoKTtcblx0XHR9KTtcblx0XHRmaWx0ZXJlZEZ1enpJdGVtcy5zb3J0KChhOiBGdXp6SXRlbSwgYjogRnV6ekl0ZW0pID0+IGEuZWRpdERpc3RhbmNlIC0gYi5lZGl0RGlzdGFuY2UpO1xuXHRcdHJldHVybiBmaWx0ZXJlZEZ1enpJdGVtcztcblx0fVxuXG5cdHB1YmxpYyBzb3J0KFxuXHRcdGl0ZW1zOiBhbnlbXSxcblx0XHRzdWJqZWN0S2V5czogc3RyaW5nW10sXG5cdFx0cXVlcnk6IHN0cmluZyxcblx0KTogRnV6ekl0ZW1bXSB7XG5cdFx0Y29uc3QgZnV6ekl0ZW1zOiBGdXp6SXRlbVtdID0gdGhpcy5nZXRGdXp6SXRlbXMoaXRlbXMsIHN1YmplY3RLZXlzLCBxdWVyeSk7XG5cdFx0dGhpcy5zY29yZUZ1enpJdGVtcyhmdXp6SXRlbXMpO1xuXHRcdGZ1enpJdGVtcy5zb3J0KChhOiBGdXp6SXRlbSwgYjogRnV6ekl0ZW0pID0+IGEuZWRpdERpc3RhbmNlIC0gYi5lZGl0RGlzdGFuY2UpO1xuXHRcdHJldHVybiBmdXp6SXRlbXM7XG5cdH1cblxuXHRwdWJsaWMgZ2V0RnV6ekl0ZW1zKFxuXHRcdGl0ZW1zOiBhbnlbXSxcblx0XHRzdWJqZWN0S2V5czogc3RyaW5nW10sXG5cdFx0cXVlcnk6IHN0cmluZ1xuXHQpOiBGdXp6SXRlbVtdIHtcblx0XHRjb25zdCBmdXp6SXRlbXM6IEZ1enpJdGVtW10gPSBbXTtcblx0XHRpdGVtcy5mb3JFYWNoKChpdGVtOiBhbnkpID0+IHtcblx0XHRcdHN1YmplY3RLZXlzLmZvckVhY2goKGtleTogc3RyaW5nKSA9PiB7XG5cdFx0XHRcdGZ1enpJdGVtcy5wdXNoKHtcblx0XHRcdFx0XHRvcmlnaW5hbDogaXRlbSxcblx0XHRcdFx0XHRrZXk6IGtleSxcblx0XHRcdFx0XHRzdWJqZWN0OiBpdGVtW2tleV0sXG5cdFx0XHRcdFx0cXVlcnk6IHF1ZXJ5LFxuXHRcdFx0XHR9IGFzIEZ1enpJdGVtKTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHRcdHJldHVybiBmdXp6SXRlbXM7XG5cdH1cblxuXHRwdWJsaWMgc2NvcmVGdXp6SXRlbXMoZnV6ekl0ZW1zOiBGdXp6SXRlbVtdKSB7XG5cdFx0ZnV6ekl0ZW1zLmZvckVhY2goKGZ1enpJdGVtOiBGdXp6SXRlbSkgPT4ge1xuXHRcdFx0Y29uc3QgZWRpdE1hdHJpeCA9IHRoaXMuZ2V0SW5pdGlhbEVkaXRNYXRyaXgoXG5cdFx0XHRcdGZ1enpJdGVtLnF1ZXJ5LFxuXHRcdFx0XHRmdXp6SXRlbS5zdWJqZWN0LFxuXHRcdFx0XHR0aGlzLmVkaXRDb3N0cyxcblx0XHRcdCk7XG5cdFx0XHRjb25zdCBvcGVyYXRpb25NYXRyaXggPSB0aGlzLmZpbGxFZGl0TWF0cml4KFxuXHRcdFx0XHRlZGl0TWF0cml4LFxuXHRcdFx0XHRmdXp6SXRlbS5xdWVyeSxcblx0XHRcdFx0ZnV6ekl0ZW0uc3ViamVjdCxcblx0XHRcdFx0dGhpcy5lZGl0Q29zdHMsXG5cdFx0XHQpO1xuXHRcdFx0ZnV6ekl0ZW0uZWRpdE1hdHJpeCA9IGVkaXRNYXRyaXg7XG5cdFx0XHRmdXp6SXRlbS5lZGl0RGlzdGFuY2UgPSBlZGl0TWF0cml4W2VkaXRNYXRyaXgubGVuZ3RoIC0gMV1bZWRpdE1hdHJpeFswXS5sZW5ndGggLSAxXTtcblx0XHRcdGZ1enpJdGVtLm9wZXJhdGlvbk1hdHJpeCA9IG9wZXJhdGlvbk1hdHJpeDtcblxuXHRcdH0pO1xuXHR9XG5cblx0cHVibGljIGdldEluaXRpYWxFZGl0TWF0cml4KFxuXHRcdHF1ZXJ5OiBzdHJpbmcsXG5cdFx0c3ViamVjdDogc3RyaW5nLFxuXHRcdGVkaXRDb3N0czogRWRpdENvc3RzLFxuXHQpOiBudW1iZXJbXVtdIHtcblx0XHRjb25zdCBoZWlnaHQgPSBxdWVyeS5sZW5ndGggKyAxO1xuXHRcdGNvbnN0IHdpZHRoID0gc3ViamVjdC5sZW5ndGggKyAxO1xuXG5cdFx0Y29uc3QgZmlyc3RSb3cgPSBbXTtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHdpZHRoOyBpKyspIHtcblx0XHRcdGZpcnN0Um93LnB1c2goaSAqIGVkaXRDb3N0cy5wcmVRdWVyeUluc2VydGlvbik7XG5cdFx0fVxuXG5cdFx0Y29uc3QgaW5pdGlhbEVkaXRNYXRyaXggPSBbZmlyc3RSb3ddO1xuXHRcdGZvciAobGV0IGkgPSAxOyBpIDwgaGVpZ2h0OyBpKyspIHtcblx0XHRcdGNvbnN0IHJvdyA9IG5ldyBBcnJheSh3aWR0aCk7XG5cdFx0XHRyb3dbMF0gPSBpICogZWRpdENvc3RzLmRlbGV0aW9uO1xuXHRcdFx0aW5pdGlhbEVkaXRNYXRyaXgucHVzaChyb3cpO1xuXHRcdH1cblx0XHRyZXR1cm4gaW5pdGlhbEVkaXRNYXRyaXg7XG5cdH1cblxuXHRwdWJsaWMgZmlsbEVkaXRNYXRyaXgoXG5cdFx0bWF0cml4OiBudW1iZXJbXVtdLFxuXHRcdHF1ZXJ5OiBzdHJpbmcsXG5cdFx0c3ViamVjdDogc3RyaW5nLFxuXHRcdGVkaXRDb3N0czogRWRpdENvc3RzLFxuXHQpOiBudW1iZXJbXVtdIHtcblx0XHRjb25zdCBoZWlnaHQgPSBtYXRyaXgubGVuZ3RoO1xuXHRcdGNvbnN0IHdpZHRoID0gbWF0cml4WzBdLmxlbmd0aDtcblx0XHRjb25zdCBvcGVyYXRpb25NYXRyaXggPSB0aGlzLmdldEluaXRpYWxPcGVyYXRpb25NYXRyaXgoaGVpZ2h0LCB3aWR0aCk7XG5cdFx0Zm9yIChsZXQgcm93SW5kZXggPSAxOyByb3dJbmRleCA8IGhlaWdodDsgcm93SW5kZXgrKykge1xuXHRcdFx0Y29uc3QgaW5zZXJ0aW9uQ29zdCA9IHJvd0luZGV4ID09PSAoaGVpZ2h0IC0gMSkgPyBlZGl0Q29zdHMucG9zdFF1ZXJ5SW5zZXJ0aW9uIDogZWRpdENvc3RzLmluc2VydGlvbjtcblx0XHRcdGZvciAobGV0IGNvbHVtbkluZGV4ID0gMTsgY29sdW1uSW5kZXggPCB3aWR0aDsgY29sdW1uSW5kZXgrKykge1xuXHRcdFx0XHRjb25zdCBkb2VzU3Vic3RpdHV0aW9uUmVwbGFjZSA9IHF1ZXJ5W3Jvd0luZGV4IC0gMV0gIT09IHN1YmplY3RbY29sdW1uSW5kZXggLSAxXTtcblx0XHRcdFx0Y29uc3Qgc3Vic3RpdHV0aW9uQ29zdCA9IGRvZXNTdWJzdGl0dXRpb25SZXBsYWNlID8gZWRpdENvc3RzLnN1YnN0aXR1dGlvbiA6IDA7XG5cdFx0XHRcdGNvbnN0IG9wZXJhdGlvbkNvc3RzID0gW1xuXHRcdFx0XHRcdG1hdHJpeFtyb3dJbmRleCAtIDFdW2NvbHVtbkluZGV4XSArIGVkaXRDb3N0cy5kZWxldGlvbixcblx0XHRcdFx0XHRtYXRyaXhbcm93SW5kZXhdW2NvbHVtbkluZGV4IC0gMV0gKyBpbnNlcnRpb25Db3N0LFxuXHRcdFx0XHRcdG1hdHJpeFtyb3dJbmRleCAtIDFdW2NvbHVtbkluZGV4IC0gMV0gKyBzdWJzdGl0dXRpb25Db3N0LFxuXHRcdFx0XHRdO1xuXHRcdFx0XHRjb25zdCBvcGVyYXRpb25JbmRleCA9IGdldE1pbkluZGV4KG9wZXJhdGlvbkNvc3RzKTtcblx0XHRcdFx0bWF0cml4W3Jvd0luZGV4XVtjb2x1bW5JbmRleF0gPSBvcGVyYXRpb25Db3N0c1tvcGVyYXRpb25JbmRleF07XG5cdFx0XHRcdGlmIChvcGVyYXRpb25JbmRleCA9PT0gMiAmJiAhZG9lc1N1YnN0aXR1dGlvblJlcGxhY2UpIHtcblx0XHRcdFx0XHRvcGVyYXRpb25NYXRyaXhbcm93SW5kZXhdW2NvbHVtbkluZGV4XSA9IDM7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0b3BlcmF0aW9uTWF0cml4W3Jvd0luZGV4XVtjb2x1bW5JbmRleF0gPSBvcGVyYXRpb25JbmRleDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gb3BlcmF0aW9uTWF0cml4O1xuXHR9XG5cblx0cHVibGljIGdldEluaXRpYWxPcGVyYXRpb25NYXRyaXgoaGVpZ2h0OiBudW1iZXIsIHdpZHRoOiBudW1iZXIpOiBudW1iZXJbXVtdIHtcblx0XHRjb25zdCBmaXJzdFJvdyA9IFtdO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgd2lkdGg7IGkrKykge1xuXHRcdFx0Zmlyc3RSb3cucHVzaCgxKTtcblx0XHR9XG5cblx0XHRjb25zdCBvcGVyYXRpb25NYXRyaXggPSBbZmlyc3RSb3ddO1xuXHRcdGZvcihsZXQgaSA9IDE7IGkgPCBoZWlnaHQ7IGkrKykge1xuXHRcdFx0Y29uc3Qgcm93ID0gbmV3IEFycmF5KHdpZHRoKTtcblx0XHRcdHJvd1swXSA9IDA7XG5cdFx0XHRvcGVyYXRpb25NYXRyaXgucHVzaChyb3cpO1xuXHRcdH1cblx0XHRyZXR1cm4gb3BlcmF0aW9uTWF0cml4O1xuXHR9XG5cblx0cHVibGljIGdldFN1YnN0aXR1dGlvbk9wZXJhdGlvbnMob3BlcmF0aW9uTWF0cml4OiBudW1iZXJbXVtdKSB7XG5cdFx0bGV0IHlMb2MgPSBvcGVyYXRpb25NYXRyaXgubGVuZ3RoIC0gMTtcblx0XHRsZXQgeExvYyA9IG9wZXJhdGlvbk1hdHJpeFswXS5sZW5ndGggLSAxO1xuXHRcdGxldCBzdWJzdGl0dXRpb25PcGVyYXRpb25zID0gW107XG5cblxuXHR9XG5cbn1cblxuZnVuY3Rpb24gZ2V0TWluSW5kZXgobnVtYmVyczogbnVtYmVyW10pIHtcblx0bGV0IG1pbkluZGV4ID0gMDtcblx0bGV0IG1pblZhbHVlID0gbnVtYmVyc1swXTtcblx0Zm9yIChsZXQgbmV4dEluZGV4ID0gMTsgbmV4dEluZGV4IDwgbnVtYmVycy5sZW5ndGg7IG5leHRJbmRleCsrKSB7XG5cdFx0Y29uc3QgbmV4dFZhbHVlID0gbnVtYmVyc1tuZXh0SW5kZXhdO1xuXHRcdGlmIChuZXh0VmFsdWUgPCBtaW5WYWx1ZSkge1xuXHRcdFx0bWluSW5kZXggPSBuZXh0SW5kZXg7XG5cdFx0XHRtaW5WYWx1ZSA9IG5leHRWYWx1ZTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIG1pbkluZGV4O1xufVxuIl19