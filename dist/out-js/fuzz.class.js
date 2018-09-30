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
            matchLocations.push([yLoc]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mdXp6LmNsYXNzLnRzIl0sIm5hbWVzIjpbIkZ1enoiLCJERUZBVUxUX0VESVRfQ09TVFMiLCJERUZBVUxUX0VESVRfVEhSRVNIT0xEIiwiaXRlbXMiLCJzdWJqZWN0S2V5cyIsInF1ZXJ5IiwiZWRpdERpc3RhbmNlUGVyUXVlcnlMZW5ndGgiLCJmdXp6SXRlbXMiLCJnZXRGdXp6SXRlbXMiLCJzY29yZUZ1enpJdGVtcyIsImZpbHRlcmVkRnV6ekl0ZW1zIiwiZmlsdGVyIiwiZnV6ekl0ZW0iLCJlZGl0RGlzdGFuY2UiLCJsZW5ndGgiLCJzb3J0IiwiYSIsImIiLCJmb3JFYWNoIiwiaXRlbSIsImtleSIsInB1c2giLCJvcmlnaW5hbCIsInN1YmplY3QiLCJlZGl0TWF0cml4IiwiZ2V0SW5pdGlhbEVkaXRNYXRyaXgiLCJlZGl0Q29zdHMiLCJvcGVyYXRpb25NYXRyaXgiLCJmaWxsRWRpdE1hdHJpeCIsIm1hdGNoTG9jYXRpb25zIiwiZ2V0TWF0Y2hMb2NhdGlvbnMiLCJoZWlnaHQiLCJ3aWR0aCIsImZpcnN0Um93IiwiaSIsInByZVF1ZXJ5SW5zZXJ0aW9uIiwiaW5pdGlhbEVkaXRNYXRyaXgiLCJyb3ciLCJBcnJheSIsImRlbGV0aW9uIiwibWF0cml4IiwiZ2V0SW5pdGlhbE9wZXJhdGlvbk1hdHJpeCIsInJvd0luZGV4IiwiaW5zZXJ0aW9uQ29zdCIsInBvc3RRdWVyeUluc2VydGlvbiIsImluc2VydGlvbiIsImNvbHVtbkluZGV4IiwiZG9lc1N1YnN0aXR1dGlvblJlcGxhY2UiLCJzdWJzdGl0dXRpb25Db3N0Iiwic3Vic3RpdHV0aW9uIiwib3BlcmF0aW9uQ29zdHMiLCJvcGVyYXRpb25JbmRleCIsImdldE1pbkluZGV4IiwieUxvYyIsInhMb2MiLCJyZXZlcnNlIiwibnVtYmVycyIsIm1pbkluZGV4IiwibWluVmFsdWUiLCJuZXh0SW5kZXgiLCJuZXh0VmFsdWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBRWFBLEk7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QUEsSUFBSTtBQUNKQyxZQUFBQSxJQUFJO0FBQ0o7O0FBQ0QsZUFBSyxDQUFMO0FBQ0NELFlBQUFBLElBQUk7QUFDSkMsWUFBQUEsSUFBSTtBQUNKekIsWUFBQUEsY0FBYyxDQUFDUixJQUFmLENBQW9CLENBQUNnQyxJQUFELENBQXBCO0FBZEY7QUFnQkE7O0FBQ0QsYUFBT3hCLGNBQWMsQ0FBQzBCLE9BQWYsRUFBUDtBQUVBOzs7Ozs7OztnQkE3S1d2RCxJLDRCQUU0QyxFOztnQkFGNUNBLEksd0JBRzJDO0FBQ3REaUQsRUFBQUEsWUFBWSxFQUFFLEdBRHdDO0FBRXREVixFQUFBQSxRQUFRLEVBQUUsR0FGNEM7QUFHdERNLEVBQUFBLFNBQVMsRUFBRSxHQUgyQztBQUl0RFYsRUFBQUEsaUJBQWlCLEVBQUUsRUFKbUM7QUFLdERTLEVBQUFBLGtCQUFrQixFQUFFO0FBTGtDLEM7O0FBOEt4RCxTQUFTUSxXQUFULENBQXFCSSxPQUFyQixFQUF3QztBQUN2QyxNQUFJQyxRQUFRLEdBQUcsQ0FBZjtBQUNBLE1BQUlDLFFBQVEsR0FBR0YsT0FBTyxDQUFDLENBQUQsQ0FBdEI7O0FBQ0EsT0FBSyxJQUFJRyxTQUFTLEdBQUcsQ0FBckIsRUFBd0JBLFNBQVMsR0FBR0gsT0FBTyxDQUFDMUMsTUFBNUMsRUFBb0Q2QyxTQUFTLEVBQTdELEVBQWlFO0FBQ2hFLFFBQU1DLFNBQVMsR0FBR0osT0FBTyxDQUFDRyxTQUFELENBQXpCOztBQUNBLFFBQUlDLFNBQVMsR0FBR0YsUUFBaEIsRUFBMEI7QUFDekJELE1BQUFBLFFBQVEsR0FBR0UsU0FBWDtBQUNBRCxNQUFBQSxRQUFRLEdBQUdFLFNBQVg7QUFDQTtBQUNEOztBQUNELFNBQU9ILFFBQVA7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEVkaXRDb3N0cywgRnV6ekl0ZW0gfSBmcm9tICcuL21vZGVscyc7XG5cbmV4cG9ydCBjbGFzcyBGdXp6IHtcblxuXHRwdWJsaWMgc3RhdGljIHJlYWRvbmx5IERFRkFVTFRfRURJVF9USFJFU0hPTEQ6IG51bWJlciA9IDQwO1xuXHRwdWJsaWMgc3RhdGljIHJlYWRvbmx5IERFRkFVTFRfRURJVF9DT1NUUzogRWRpdENvc3RzID0ge1xuXHRcdHN1YnN0aXR1dGlvbjogMTQxLFxuXHRcdGRlbGV0aW9uOiAxMDAsXG5cdFx0aW5zZXJ0aW9uOiAxMDAsXG5cdFx0cHJlUXVlcnlJbnNlcnRpb246IDEwLFxuXHRcdHBvc3RRdWVyeUluc2VydGlvbjogNSxcblx0fVxuXG5cdHB1YmxpYyBlZGl0Q29zdHM6IEVkaXRDb3N0cyA9IHsgLi4uRnV6ei5ERUZBVUxUX0VESVRfQ09TVFMgfTtcblx0cHVibGljIGVkaXREaXN0YW5jZVBlclF1ZXJ5TGVuZ3RoOiBudW1iZXIgPSBGdXp6LkRFRkFVTFRfRURJVF9USFJFU0hPTEQ7XG5cblx0cHVibGljIGZpbHRlclNvcnQoXG5cdFx0aXRlbXM6IGFueVtdLFxuXHRcdHN1YmplY3RLZXlzOiBzdHJpbmdbXSxcblx0XHRxdWVyeTogc3RyaW5nLFxuXHRcdGVkaXREaXN0YW5jZVBlclF1ZXJ5TGVuZ3RoOiBudW1iZXIgPSB0aGlzLmVkaXREaXN0YW5jZVBlclF1ZXJ5TGVuZ3RoLFxuXHQpIHtcblx0XHRjb25zdCBmdXp6SXRlbXM6IEZ1enpJdGVtW10gPSB0aGlzLmdldEZ1enpJdGVtcyhpdGVtcywgc3ViamVjdEtleXMsIHF1ZXJ5KTtcblx0XHR0aGlzLnNjb3JlRnV6ekl0ZW1zKGZ1enpJdGVtcyk7XG5cdFx0Y29uc3QgZmlsdGVyZWRGdXp6SXRlbXMgPSBmdXp6SXRlbXMuZmlsdGVyKChmdXp6SXRlbTogRnV6ekl0ZW0pID0+IHtcblx0XHRcdHJldHVybiBmdXp6SXRlbS5lZGl0RGlzdGFuY2UgPD0gKGVkaXREaXN0YW5jZVBlclF1ZXJ5TGVuZ3RoICogZnV6ekl0ZW0ucXVlcnkubGVuZ3RoKTtcblx0XHR9KTtcblx0XHRmaWx0ZXJlZEZ1enpJdGVtcy5zb3J0KChhOiBGdXp6SXRlbSwgYjogRnV6ekl0ZW0pID0+IGEuZWRpdERpc3RhbmNlIC0gYi5lZGl0RGlzdGFuY2UpO1xuXHRcdHJldHVybiBmaWx0ZXJlZEZ1enpJdGVtcztcblx0fVxuXG5cdHB1YmxpYyBzb3J0KFxuXHRcdGl0ZW1zOiBhbnlbXSxcblx0XHRzdWJqZWN0S2V5czogc3RyaW5nW10sXG5cdFx0cXVlcnk6IHN0cmluZyxcblx0KTogRnV6ekl0ZW1bXSB7XG5cdFx0Y29uc3QgZnV6ekl0ZW1zOiBGdXp6SXRlbVtdID0gdGhpcy5nZXRGdXp6SXRlbXMoaXRlbXMsIHN1YmplY3RLZXlzLCBxdWVyeSk7XG5cdFx0dGhpcy5zY29yZUZ1enpJdGVtcyhmdXp6SXRlbXMpO1xuXHRcdGZ1enpJdGVtcy5zb3J0KChhOiBGdXp6SXRlbSwgYjogRnV6ekl0ZW0pID0+IGEuZWRpdERpc3RhbmNlIC0gYi5lZGl0RGlzdGFuY2UpO1xuXHRcdHJldHVybiBmdXp6SXRlbXM7XG5cdH1cblxuXHRwdWJsaWMgZ2V0RnV6ekl0ZW1zKFxuXHRcdGl0ZW1zOiBhbnlbXSxcblx0XHRzdWJqZWN0S2V5czogc3RyaW5nW10sXG5cdFx0cXVlcnk6IHN0cmluZ1xuXHQpOiBGdXp6SXRlbVtdIHtcblx0XHRjb25zdCBmdXp6SXRlbXM6IEZ1enpJdGVtW10gPSBbXTtcblx0XHRpdGVtcy5mb3JFYWNoKChpdGVtOiBhbnkpID0+IHtcblx0XHRcdHN1YmplY3RLZXlzLmZvckVhY2goKGtleTogc3RyaW5nKSA9PiB7XG5cdFx0XHRcdGZ1enpJdGVtcy5wdXNoKHtcblx0XHRcdFx0XHRvcmlnaW5hbDogaXRlbSxcblx0XHRcdFx0XHRrZXk6IGtleSxcblx0XHRcdFx0XHRzdWJqZWN0OiBpdGVtW2tleV0sXG5cdFx0XHRcdFx0cXVlcnk6IHF1ZXJ5LFxuXHRcdFx0XHR9IGFzIEZ1enpJdGVtKTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHRcdHJldHVybiBmdXp6SXRlbXM7XG5cdH1cblxuXHRwdWJsaWMgc2NvcmVGdXp6SXRlbXMoZnV6ekl0ZW1zOiBGdXp6SXRlbVtdKSB7XG5cdFx0ZnV6ekl0ZW1zLmZvckVhY2goKGZ1enpJdGVtOiBGdXp6SXRlbSkgPT4ge1xuXHRcdFx0Y29uc3QgZWRpdE1hdHJpeCA9IHRoaXMuZ2V0SW5pdGlhbEVkaXRNYXRyaXgoXG5cdFx0XHRcdGZ1enpJdGVtLnF1ZXJ5LFxuXHRcdFx0XHRmdXp6SXRlbS5zdWJqZWN0LFxuXHRcdFx0XHR0aGlzLmVkaXRDb3N0cyxcblx0XHRcdCk7XG5cdFx0XHRjb25zdCBvcGVyYXRpb25NYXRyaXggPSB0aGlzLmZpbGxFZGl0TWF0cml4KFxuXHRcdFx0XHRlZGl0TWF0cml4LFxuXHRcdFx0XHRmdXp6SXRlbS5xdWVyeSxcblx0XHRcdFx0ZnV6ekl0ZW0uc3ViamVjdCxcblx0XHRcdFx0dGhpcy5lZGl0Q29zdHMsXG5cdFx0XHQpO1xuXHRcdFx0Y29uc3QgbWF0Y2hMb2NhdGlvbnMgPSB0aGlzLmdldE1hdGNoTG9jYXRpb25zKG9wZXJhdGlvbk1hdHJpeCk7XG5cdFx0XHRmdXp6SXRlbS5lZGl0TWF0cml4ID0gZWRpdE1hdHJpeDtcblx0XHRcdGZ1enpJdGVtLmVkaXREaXN0YW5jZSA9IGVkaXRNYXRyaXhbZWRpdE1hdHJpeC5sZW5ndGggLSAxXVtlZGl0TWF0cml4WzBdLmxlbmd0aCAtIDFdO1xuXHRcdFx0ZnV6ekl0ZW0ub3BlcmF0aW9uTWF0cml4ID0gb3BlcmF0aW9uTWF0cml4O1xuXHRcdFx0ZnV6ekl0ZW0ubWF0Y2hMb2NhdGlvbnMgPSBtYXRjaExvY2F0aW9ucztcblx0XHR9KTtcblx0fVxuXG5cdHB1YmxpYyBnZXRJbml0aWFsRWRpdE1hdHJpeChcblx0XHRxdWVyeTogc3RyaW5nLFxuXHRcdHN1YmplY3Q6IHN0cmluZyxcblx0XHRlZGl0Q29zdHM6IEVkaXRDb3N0cyxcblx0KTogbnVtYmVyW11bXSB7XG5cdFx0Y29uc3QgaGVpZ2h0ID0gcXVlcnkubGVuZ3RoICsgMTtcblx0XHRjb25zdCB3aWR0aCA9IHN1YmplY3QubGVuZ3RoICsgMTtcblxuXHRcdGNvbnN0IGZpcnN0Um93ID0gW107XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB3aWR0aDsgaSsrKSB7XG5cdFx0XHRmaXJzdFJvdy5wdXNoKGkgKiBlZGl0Q29zdHMucHJlUXVlcnlJbnNlcnRpb24pO1xuXHRcdH1cblxuXHRcdGNvbnN0IGluaXRpYWxFZGl0TWF0cml4ID0gW2ZpcnN0Um93XTtcblx0XHRmb3IgKGxldCBpID0gMTsgaSA8IGhlaWdodDsgaSsrKSB7XG5cdFx0XHRjb25zdCByb3cgPSBuZXcgQXJyYXkod2lkdGgpO1xuXHRcdFx0cm93WzBdID0gaSAqIGVkaXRDb3N0cy5kZWxldGlvbjtcblx0XHRcdGluaXRpYWxFZGl0TWF0cml4LnB1c2gocm93KTtcblx0XHR9XG5cdFx0cmV0dXJuIGluaXRpYWxFZGl0TWF0cml4O1xuXHR9XG5cblx0cHVibGljIGZpbGxFZGl0TWF0cml4KFxuXHRcdG1hdHJpeDogbnVtYmVyW11bXSxcblx0XHRxdWVyeTogc3RyaW5nLFxuXHRcdHN1YmplY3Q6IHN0cmluZyxcblx0XHRlZGl0Q29zdHM6IEVkaXRDb3N0cyxcblx0KTogbnVtYmVyW11bXSB7XG5cdFx0Y29uc3QgaGVpZ2h0ID0gbWF0cml4Lmxlbmd0aDtcblx0XHRjb25zdCB3aWR0aCA9IG1hdHJpeFswXS5sZW5ndGg7XG5cdFx0Y29uc3Qgb3BlcmF0aW9uTWF0cml4ID0gdGhpcy5nZXRJbml0aWFsT3BlcmF0aW9uTWF0cml4KGhlaWdodCwgd2lkdGgpO1xuXHRcdGZvciAobGV0IHJvd0luZGV4ID0gMTsgcm93SW5kZXggPCBoZWlnaHQ7IHJvd0luZGV4KyspIHtcblx0XHRcdGNvbnN0IGluc2VydGlvbkNvc3QgPSByb3dJbmRleCA9PT0gKGhlaWdodCAtIDEpID8gZWRpdENvc3RzLnBvc3RRdWVyeUluc2VydGlvbiA6IGVkaXRDb3N0cy5pbnNlcnRpb247XG5cdFx0XHRmb3IgKGxldCBjb2x1bW5JbmRleCA9IDE7IGNvbHVtbkluZGV4IDwgd2lkdGg7IGNvbHVtbkluZGV4KyspIHtcblx0XHRcdFx0Y29uc3QgZG9lc1N1YnN0aXR1dGlvblJlcGxhY2UgPSBxdWVyeVtyb3dJbmRleCAtIDFdICE9PSBzdWJqZWN0W2NvbHVtbkluZGV4IC0gMV07XG5cdFx0XHRcdGNvbnN0IHN1YnN0aXR1dGlvbkNvc3QgPSBkb2VzU3Vic3RpdHV0aW9uUmVwbGFjZSA/IGVkaXRDb3N0cy5zdWJzdGl0dXRpb24gOiAwO1xuXHRcdFx0XHRjb25zdCBvcGVyYXRpb25Db3N0cyA9IFtcblx0XHRcdFx0XHRtYXRyaXhbcm93SW5kZXggLSAxXVtjb2x1bW5JbmRleF0gKyBlZGl0Q29zdHMuZGVsZXRpb24sXG5cdFx0XHRcdFx0bWF0cml4W3Jvd0luZGV4XVtjb2x1bW5JbmRleCAtIDFdICsgaW5zZXJ0aW9uQ29zdCxcblx0XHRcdFx0XHRtYXRyaXhbcm93SW5kZXggLSAxXVtjb2x1bW5JbmRleCAtIDFdICsgc3Vic3RpdHV0aW9uQ29zdCxcblx0XHRcdFx0XTtcblx0XHRcdFx0Y29uc3Qgb3BlcmF0aW9uSW5kZXggPSBnZXRNaW5JbmRleChvcGVyYXRpb25Db3N0cyk7XG5cdFx0XHRcdG1hdHJpeFtyb3dJbmRleF1bY29sdW1uSW5kZXhdID0gb3BlcmF0aW9uQ29zdHNbb3BlcmF0aW9uSW5kZXhdO1xuXHRcdFx0XHRpZiAob3BlcmF0aW9uSW5kZXggPT09IDIgJiYgIWRvZXNTdWJzdGl0dXRpb25SZXBsYWNlKSB7XG5cdFx0XHRcdFx0b3BlcmF0aW9uTWF0cml4W3Jvd0luZGV4XVtjb2x1bW5JbmRleF0gPSAzO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG9wZXJhdGlvbk1hdHJpeFtyb3dJbmRleF1bY29sdW1uSW5kZXhdID0gb3BlcmF0aW9uSW5kZXg7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIG9wZXJhdGlvbk1hdHJpeDtcblx0fVxuXG5cdHB1YmxpYyBnZXRJbml0aWFsT3BlcmF0aW9uTWF0cml4KGhlaWdodDogbnVtYmVyLCB3aWR0aDogbnVtYmVyKTogbnVtYmVyW11bXSB7XG5cdFx0Y29uc3QgZmlyc3RSb3cgPSBbXTtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHdpZHRoOyBpKyspIHtcblx0XHRcdGZpcnN0Um93LnB1c2goMSk7XG5cdFx0fVxuXG5cdFx0Y29uc3Qgb3BlcmF0aW9uTWF0cml4ID0gW2ZpcnN0Um93XTtcblx0XHRmb3IobGV0IGkgPSAxOyBpIDwgaGVpZ2h0OyBpKyspIHtcblx0XHRcdGNvbnN0IHJvdyA9IG5ldyBBcnJheSh3aWR0aCk7XG5cdFx0XHRyb3dbMF0gPSAwO1xuXHRcdFx0b3BlcmF0aW9uTWF0cml4LnB1c2gocm93KTtcblx0XHR9XG5cdFx0cmV0dXJuIG9wZXJhdGlvbk1hdHJpeDtcblx0fVxuXG5cdHB1YmxpYyBnZXRNYXRjaExvY2F0aW9ucyhvcGVyYXRpb25NYXRyaXg6IG51bWJlcltdW10pIHtcblx0XHRsZXQgeUxvYyA9IG9wZXJhdGlvbk1hdHJpeC5sZW5ndGggLSAxO1xuXHRcdGxldCB4TG9jID0gb3BlcmF0aW9uTWF0cml4WzBdLmxlbmd0aCAtIDE7XG5cdFx0bGV0IG1hdGNoTG9jYXRpb25zID0gW107XG5cblx0XHR3aGlsZSAoeUxvYyAhPT0gMCB8fCB4TG9jICE9PSAwKSB7XG5cdFx0XHRzd2l0Y2gob3BlcmF0aW9uTWF0cml4W3lMb2NdW3hMb2NdKSB7XG5cdFx0XHRcdGNhc2UgMDpcblx0XHRcdFx0XHR5TG9jLS1cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHRcdHhMb2MtLTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHRcdHlMb2MtLTtcblx0XHRcdFx0XHR4TG9jLS07XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgMzpcblx0XHRcdFx0XHR5TG9jLS07XG5cdFx0XHRcdFx0eExvYy0tO1xuXHRcdFx0XHRcdG1hdGNoTG9jYXRpb25zLnB1c2goW3lMb2NdKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIG1hdGNoTG9jYXRpb25zLnJldmVyc2UoKTtcblxuXHR9XG5cbn1cblxuZnVuY3Rpb24gZ2V0TWluSW5kZXgobnVtYmVyczogbnVtYmVyW10pIHtcblx0bGV0IG1pbkluZGV4ID0gMDtcblx0bGV0IG1pblZhbHVlID0gbnVtYmVyc1swXTtcblx0Zm9yIChsZXQgbmV4dEluZGV4ID0gMTsgbmV4dEluZGV4IDwgbnVtYmVycy5sZW5ndGg7IG5leHRJbmRleCsrKSB7XG5cdFx0Y29uc3QgbmV4dFZhbHVlID0gbnVtYmVyc1tuZXh0SW5kZXhdO1xuXHRcdGlmIChuZXh0VmFsdWUgPCBtaW5WYWx1ZSkge1xuXHRcdFx0bWluSW5kZXggPSBuZXh0SW5kZXg7XG5cdFx0XHRtaW5WYWx1ZSA9IG5leHRWYWx1ZTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIG1pbkluZGV4O1xufVxuIl19