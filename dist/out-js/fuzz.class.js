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

        var matchLocations = _this.getMatchLocations(operationMatrix);

        fuzzItem.editMatrix = editMatrix;
        fuzzItem.editDistance = editMatrix[editMatrix.length - 1][editMatrix[0].length - 1];
        fuzzItem.operationMatrix = operationMatrix;
        fuzzItem.subjectMatchIndexSet = new Set(matchLocations);
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
            matchLocations.push(xLoc);
        }
      }

      return matchLocations.reverse();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mdXp6LmNsYXNzLnRzIl0sIm5hbWVzIjpbIkZ1enoiLCJERUZBVUxUX0VESVRfQ09TVFMiLCJERUZBVUxUX0VESVRfVEhSRVNIT0xEIiwiaXRlbXMiLCJzdWJqZWN0S2V5cyIsInF1ZXJ5IiwiZWRpdERpc3RhbmNlUGVyUXVlcnlMZW5ndGgiLCJmdXp6SXRlbXMiLCJnZXRGdXp6SXRlbXMiLCJzY29yZUZ1enpJdGVtcyIsImZpbHRlcmVkRnV6ekl0ZW1zIiwiZmlsdGVyIiwiZnV6ekl0ZW0iLCJlZGl0RGlzdGFuY2UiLCJsZW5ndGgiLCJzb3J0IiwiYSIsImIiLCJmb3JFYWNoIiwiaXRlbSIsImtleSIsInB1c2giLCJvcmlnaW5hbCIsInN1YmplY3QiLCJ0b0xvd2VyQ2FzZSIsImVkaXRNYXRyaXgiLCJnZXRJbml0aWFsRWRpdE1hdHJpeCIsImVkaXRDb3N0cyIsIm9wZXJhdGlvbk1hdHJpeCIsImZpbGxFZGl0TWF0cml4IiwibWF0Y2hMb2NhdGlvbnMiLCJnZXRNYXRjaExvY2F0aW9ucyIsInN1YmplY3RNYXRjaEluZGV4U2V0IiwiU2V0IiwiaGVpZ2h0Iiwid2lkdGgiLCJmaXJzdFJvdyIsImkiLCJwcmVRdWVyeUluc2VydGlvbiIsImluaXRpYWxFZGl0TWF0cml4Iiwicm93IiwiQXJyYXkiLCJkZWxldGlvbiIsIm1hdHJpeCIsImdldEluaXRpYWxPcGVyYXRpb25NYXRyaXgiLCJyb3dJbmRleCIsImluc2VydGlvbkNvc3QiLCJwb3N0UXVlcnlJbnNlcnRpb24iLCJpbnNlcnRpb24iLCJjb2x1bW5JbmRleCIsImRvZXNTdWJzdGl0dXRpb25SZXBsYWNlIiwic3Vic3RpdHV0aW9uQ29zdCIsInN1YnN0aXR1dGlvbiIsIm9wZXJhdGlvbkNvc3RzIiwib3BlcmF0aW9uSW5kZXgiLCJnZXRNaW5JbmRleCIsInlMb2MiLCJ4TG9jIiwicmV2ZXJzZSIsIm51bWJlcnMiLCJtaW5JbmRleCIsIm1pblZhbHVlIiwibmV4dEluZGV4IiwibmV4dFZh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QUFBQSxRQUFRLEdBQUdFLFNBQVg7QUFDQTtBQUNEOztBQUNELFNBQU9ILFFBQVA7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEVkaXRDb3N0cywgRnV6ekl0ZW0gfSBmcm9tICcuL21vZGVscyc7XG5cbmV4cG9ydCBjbGFzcyBGdXp6IHtcblxuXHRwdWJsaWMgc3RhdGljIHJlYWRvbmx5IERFRkFVTFRfRURJVF9USFJFU0hPTEQ6IG51bWJlciA9IDQ1O1xuXHRwdWJsaWMgc3RhdGljIHJlYWRvbmx5IERFRkFVTFRfRURJVF9DT1NUUzogRWRpdENvc3RzID0ge1xuXHRcdHN1YnN0aXR1dGlvbjogMTQxLFxuXHRcdGRlbGV0aW9uOiAxMDAsXG5cdFx0aW5zZXJ0aW9uOiAxMDAsXG5cdFx0cHJlUXVlcnlJbnNlcnRpb246IDQsXG5cdFx0cG9zdFF1ZXJ5SW5zZXJ0aW9uOiAyLFxuXHR9XG5cblx0cHVibGljIGVkaXRDb3N0czogRWRpdENvc3RzID0geyAuLi5GdXp6LkRFRkFVTFRfRURJVF9DT1NUUyB9O1xuXHRwdWJsaWMgZWRpdERpc3RhbmNlUGVyUXVlcnlMZW5ndGg6IG51bWJlciA9IEZ1enouREVGQVVMVF9FRElUX1RIUkVTSE9MRDtcblxuXHRwdWJsaWMgZmlsdGVyU29ydChcblx0XHRpdGVtczogYW55W10sXG5cdFx0c3ViamVjdEtleXM6IHN0cmluZ1tdLFxuXHRcdHF1ZXJ5OiBzdHJpbmcsXG5cdFx0ZWRpdERpc3RhbmNlUGVyUXVlcnlMZW5ndGg6IG51bWJlciA9IHRoaXMuZWRpdERpc3RhbmNlUGVyUXVlcnlMZW5ndGgsXG5cdCk6IEZ1enpJdGVtW10ge1xuXHRcdGNvbnN0IGZ1enpJdGVtczogRnV6ekl0ZW1bXSA9IHRoaXMuZ2V0RnV6ekl0ZW1zKGl0ZW1zLCBzdWJqZWN0S2V5cywgcXVlcnkpO1xuXHRcdHRoaXMuc2NvcmVGdXp6SXRlbXMoZnV6ekl0ZW1zKTtcblx0XHRpZiAoIXF1ZXJ5KSB7IHJldHVybiBmdXp6SXRlbXM7IH1cblx0XHRjb25zdCBmaWx0ZXJlZEZ1enpJdGVtcyA9IGZ1enpJdGVtcy5maWx0ZXIoKGZ1enpJdGVtOiBGdXp6SXRlbSkgPT4ge1xuXHRcdFx0cmV0dXJuIGZ1enpJdGVtLmVkaXREaXN0YW5jZSA8PSAoZWRpdERpc3RhbmNlUGVyUXVlcnlMZW5ndGggKiBmdXp6SXRlbS5xdWVyeS5sZW5ndGgpO1xuXHRcdH0pO1xuXHRcdGZpbHRlcmVkRnV6ekl0ZW1zLnNvcnQoKGE6IEZ1enpJdGVtLCBiOiBGdXp6SXRlbSkgPT4gYS5lZGl0RGlzdGFuY2UgLSBiLmVkaXREaXN0YW5jZSk7XG5cdFx0cmV0dXJuIGZpbHRlcmVkRnV6ekl0ZW1zO1xuXHR9XG5cblx0cHVibGljIHNvcnQoXG5cdFx0aXRlbXM6IGFueVtdLFxuXHRcdHN1YmplY3RLZXlzOiBzdHJpbmdbXSxcblx0XHRxdWVyeTogc3RyaW5nLFxuXHQpOiBGdXp6SXRlbVtdIHtcblx0XHRjb25zdCBmdXp6SXRlbXM6IEZ1enpJdGVtW10gPSB0aGlzLmdldEZ1enpJdGVtcyhpdGVtcywgc3ViamVjdEtleXMsIHF1ZXJ5KTtcblx0XHR0aGlzLnNjb3JlRnV6ekl0ZW1zKGZ1enpJdGVtcyk7XG5cdFx0aWYgKCFxdWVyeSkgeyByZXR1cm4gZnV6ekl0ZW1zOyB9XG5cdFx0ZnV6ekl0ZW1zLnNvcnQoKGE6IEZ1enpJdGVtLCBiOiBGdXp6SXRlbSkgPT4gYS5lZGl0RGlzdGFuY2UgLSBiLmVkaXREaXN0YW5jZSk7XG5cdFx0cmV0dXJuIGZ1enpJdGVtcztcblx0fVxuXG5cdHB1YmxpYyBnZXRGdXp6SXRlbXMoXG5cdFx0aXRlbXM6IGFueVtdLFxuXHRcdHN1YmplY3RLZXlzOiBzdHJpbmdbXSxcblx0XHRxdWVyeTogc3RyaW5nXG5cdCk6IEZ1enpJdGVtW10ge1xuXHRcdGNvbnN0IGZ1enpJdGVtczogRnV6ekl0ZW1bXSA9IFtdO1xuXHRcdGl0ZW1zLmZvckVhY2goKGl0ZW06IGFueSkgPT4ge1xuXHRcdFx0c3ViamVjdEtleXMuZm9yRWFjaCgoa2V5OiBzdHJpbmcpID0+IHtcblx0XHRcdFx0ZnV6ekl0ZW1zLnB1c2goe1xuXHRcdFx0XHRcdG9yaWdpbmFsOiBpdGVtLFxuXHRcdFx0XHRcdGtleToga2V5LFxuXHRcdFx0XHRcdHN1YmplY3Q6IGl0ZW1ba2V5XS50b0xvd2VyQ2FzZSgpLFxuXHRcdFx0XHRcdHF1ZXJ5OiBxdWVyeS50b0xvd2VyQ2FzZSgpLFxuXHRcdFx0XHR9IGFzIEZ1enpJdGVtKTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHRcdHJldHVybiBmdXp6SXRlbXM7XG5cdH1cblxuXHRwdWJsaWMgc2NvcmVGdXp6SXRlbXMoZnV6ekl0ZW1zOiBGdXp6SXRlbVtdKSB7XG5cdFx0ZnV6ekl0ZW1zLmZvckVhY2goKGZ1enpJdGVtOiBGdXp6SXRlbSkgPT4ge1xuXHRcdFx0Y29uc3QgZWRpdE1hdHJpeCA9IHRoaXMuZ2V0SW5pdGlhbEVkaXRNYXRyaXgoXG5cdFx0XHRcdGZ1enpJdGVtLnF1ZXJ5LFxuXHRcdFx0XHRmdXp6SXRlbS5zdWJqZWN0LFxuXHRcdFx0XHR0aGlzLmVkaXRDb3N0cyxcblx0XHRcdCk7XG5cdFx0XHRjb25zdCBvcGVyYXRpb25NYXRyaXggPSB0aGlzLmZpbGxFZGl0TWF0cml4KFxuXHRcdFx0XHRlZGl0TWF0cml4LFxuXHRcdFx0XHRmdXp6SXRlbS5xdWVyeSxcblx0XHRcdFx0ZnV6ekl0ZW0uc3ViamVjdCxcblx0XHRcdFx0dGhpcy5lZGl0Q29zdHMsXG5cdFx0XHQpO1xuXHRcdFx0Y29uc3QgbWF0Y2hMb2NhdGlvbnMgPSB0aGlzLmdldE1hdGNoTG9jYXRpb25zKG9wZXJhdGlvbk1hdHJpeCk7XG5cdFx0XHRmdXp6SXRlbS5lZGl0TWF0cml4ID0gZWRpdE1hdHJpeDtcblx0XHRcdGZ1enpJdGVtLmVkaXREaXN0YW5jZSA9IGVkaXRNYXRyaXhbZWRpdE1hdHJpeC5sZW5ndGggLSAxXVtlZGl0TWF0cml4WzBdLmxlbmd0aCAtIDFdO1xuXHRcdFx0ZnV6ekl0ZW0ub3BlcmF0aW9uTWF0cml4ID0gb3BlcmF0aW9uTWF0cml4O1xuXHRcdFx0ZnV6ekl0ZW0uc3ViamVjdE1hdGNoSW5kZXhTZXQgPSBuZXcgU2V0KG1hdGNoTG9jYXRpb25zKTtcblx0XHR9KTtcblx0fVxuXG5cdHB1YmxpYyBnZXRJbml0aWFsRWRpdE1hdHJpeChcblx0XHRxdWVyeTogc3RyaW5nLFxuXHRcdHN1YmplY3Q6IHN0cmluZyxcblx0XHRlZGl0Q29zdHM6IEVkaXRDb3N0cyxcblx0KTogbnVtYmVyW11bXSB7XG5cdFx0Y29uc3QgaGVpZ2h0ID0gcXVlcnkubGVuZ3RoICsgMTtcblx0XHRjb25zdCB3aWR0aCA9IHN1YmplY3QubGVuZ3RoICsgMTtcblxuXHRcdGNvbnN0IGZpcnN0Um93ID0gW107XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB3aWR0aDsgaSsrKSB7XG5cdFx0XHRmaXJzdFJvdy5wdXNoKGkgKiBlZGl0Q29zdHMucHJlUXVlcnlJbnNlcnRpb24pO1xuXHRcdH1cblxuXHRcdGNvbnN0IGluaXRpYWxFZGl0TWF0cml4ID0gW2ZpcnN0Um93XTtcblx0XHRmb3IgKGxldCBpID0gMTsgaSA8IGhlaWdodDsgaSsrKSB7XG5cdFx0XHRjb25zdCByb3cgPSBuZXcgQXJyYXkod2lkdGgpO1xuXHRcdFx0cm93WzBdID0gaSAqIGVkaXRDb3N0cy5kZWxldGlvbjtcblx0XHRcdGluaXRpYWxFZGl0TWF0cml4LnB1c2gocm93KTtcblx0XHR9XG5cdFx0cmV0dXJuIGluaXRpYWxFZGl0TWF0cml4O1xuXHR9XG5cblx0cHVibGljIGZpbGxFZGl0TWF0cml4KFxuXHRcdG1hdHJpeDogbnVtYmVyW11bXSxcblx0XHRxdWVyeTogc3RyaW5nLFxuXHRcdHN1YmplY3Q6IHN0cmluZyxcblx0XHRlZGl0Q29zdHM6IEVkaXRDb3N0cyxcblx0KTogbnVtYmVyW11bXSB7XG5cdFx0Y29uc3QgaGVpZ2h0ID0gbWF0cml4Lmxlbmd0aDtcblx0XHRjb25zdCB3aWR0aCA9IG1hdHJpeFswXS5sZW5ndGg7XG5cdFx0Y29uc3Qgb3BlcmF0aW9uTWF0cml4ID0gdGhpcy5nZXRJbml0aWFsT3BlcmF0aW9uTWF0cml4KGhlaWdodCwgd2lkdGgpO1xuXHRcdGZvciAobGV0IHJvd0luZGV4ID0gMTsgcm93SW5kZXggPCBoZWlnaHQ7IHJvd0luZGV4KyspIHtcblx0XHRcdGNvbnN0IGluc2VydGlvbkNvc3QgPSByb3dJbmRleCA9PT0gKGhlaWdodCAtIDEpID8gZWRpdENvc3RzLnBvc3RRdWVyeUluc2VydGlvbiA6IGVkaXRDb3N0cy5pbnNlcnRpb247XG5cdFx0XHRmb3IgKGxldCBjb2x1bW5JbmRleCA9IDE7IGNvbHVtbkluZGV4IDwgd2lkdGg7IGNvbHVtbkluZGV4KyspIHtcblx0XHRcdFx0Y29uc3QgZG9lc1N1YnN0aXR1dGlvblJlcGxhY2UgPSBxdWVyeVtyb3dJbmRleCAtIDFdICE9PSBzdWJqZWN0W2NvbHVtbkluZGV4IC0gMV07XG5cdFx0XHRcdGNvbnN0IHN1YnN0aXR1dGlvbkNvc3QgPSBkb2VzU3Vic3RpdHV0aW9uUmVwbGFjZSA/IGVkaXRDb3N0cy5zdWJzdGl0dXRpb24gOiAwO1xuXHRcdFx0XHRjb25zdCBvcGVyYXRpb25Db3N0cyA9IFtcblx0XHRcdFx0XHRtYXRyaXhbcm93SW5kZXggLSAxXVtjb2x1bW5JbmRleF0gKyBlZGl0Q29zdHMuZGVsZXRpb24sXG5cdFx0XHRcdFx0bWF0cml4W3Jvd0luZGV4XVtjb2x1bW5JbmRleCAtIDFdICsgaW5zZXJ0aW9uQ29zdCxcblx0XHRcdFx0XHRtYXRyaXhbcm93SW5kZXggLSAxXVtjb2x1bW5JbmRleCAtIDFdICsgc3Vic3RpdHV0aW9uQ29zdCxcblx0XHRcdFx0XTtcblx0XHRcdFx0Y29uc3Qgb3BlcmF0aW9uSW5kZXggPSBnZXRNaW5JbmRleChvcGVyYXRpb25Db3N0cyk7XG5cdFx0XHRcdG1hdHJpeFtyb3dJbmRleF1bY29sdW1uSW5kZXhdID0gb3BlcmF0aW9uQ29zdHNbb3BlcmF0aW9uSW5kZXhdO1xuXHRcdFx0XHRpZiAob3BlcmF0aW9uSW5kZXggPT09IDIgJiYgIWRvZXNTdWJzdGl0dXRpb25SZXBsYWNlKSB7XG5cdFx0XHRcdFx0b3BlcmF0aW9uTWF0cml4W3Jvd0luZGV4XVtjb2x1bW5JbmRleF0gPSAzO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG9wZXJhdGlvbk1hdHJpeFtyb3dJbmRleF1bY29sdW1uSW5kZXhdID0gb3BlcmF0aW9uSW5kZXg7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIG9wZXJhdGlvbk1hdHJpeDtcblx0fVxuXG5cdHB1YmxpYyBnZXRJbml0aWFsT3BlcmF0aW9uTWF0cml4KGhlaWdodDogbnVtYmVyLCB3aWR0aDogbnVtYmVyKTogbnVtYmVyW11bXSB7XG5cdFx0Y29uc3QgZmlyc3RSb3cgPSBbXTtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHdpZHRoOyBpKyspIHtcblx0XHRcdGZpcnN0Um93LnB1c2goMSk7XG5cdFx0fVxuXG5cdFx0Y29uc3Qgb3BlcmF0aW9uTWF0cml4ID0gW2ZpcnN0Um93XTtcblx0XHRmb3IobGV0IGkgPSAxOyBpIDwgaGVpZ2h0OyBpKyspIHtcblx0XHRcdGNvbnN0IHJvdyA9IG5ldyBBcnJheSh3aWR0aCk7XG5cdFx0XHRyb3dbMF0gPSAwO1xuXHRcdFx0b3BlcmF0aW9uTWF0cml4LnB1c2gocm93KTtcblx0XHR9XG5cdFx0cmV0dXJuIG9wZXJhdGlvbk1hdHJpeDtcblx0fVxuXG5cdHB1YmxpYyBnZXRNYXRjaExvY2F0aW9ucyhvcGVyYXRpb25NYXRyaXg6IG51bWJlcltdW10pOiBudW1iZXJbXSB7XG5cdFx0bGV0IHlMb2MgPSBvcGVyYXRpb25NYXRyaXgubGVuZ3RoIC0gMTtcblx0XHRsZXQgeExvYyA9IG9wZXJhdGlvbk1hdHJpeFswXS5sZW5ndGggLSAxO1xuXHRcdGxldCBtYXRjaExvY2F0aW9ucyA9IFtdO1xuXG5cdFx0d2hpbGUgKHlMb2MgIT09IDAgfHwgeExvYyAhPT0gMCkge1xuXHRcdFx0c3dpdGNoKG9wZXJhdGlvbk1hdHJpeFt5TG9jXVt4TG9jXSkge1xuXHRcdFx0XHRjYXNlIDA6XG5cdFx0XHRcdFx0eUxvYy0tXG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgMTpcblx0XHRcdFx0XHR4TG9jLS07XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgMjpcblx0XHRcdFx0XHR5TG9jLS07XG5cdFx0XHRcdFx0eExvYy0tO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIDM6XG5cdFx0XHRcdFx0eUxvYy0tO1xuXHRcdFx0XHRcdHhMb2MtLTtcblx0XHRcdFx0XHRtYXRjaExvY2F0aW9ucy5wdXNoKHhMb2MpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gbWF0Y2hMb2NhdGlvbnMucmV2ZXJzZSgpO1xuXHR9XG5cbn1cblxuZnVuY3Rpb24gZ2V0TWluSW5kZXgobnVtYmVyczogbnVtYmVyW10pOiBudW1iZXIge1xuXHRsZXQgbWluSW5kZXggPSAwO1xuXHRsZXQgbWluVmFsdWUgPSBudW1iZXJzWzBdO1xuXHRmb3IgKGxldCBuZXh0SW5kZXggPSAxOyBuZXh0SW5kZXggPCBudW1iZXJzLmxlbmd0aDsgbmV4dEluZGV4KyspIHtcblx0XHRjb25zdCBuZXh0VmFsdWUgPSBudW1iZXJzW25leHRJbmRleF07XG5cdFx0aWYgKG5leHRWYWx1ZSA8IG1pblZhbHVlKSB7XG5cdFx0XHRtaW5JbmRleCA9IG5leHRJbmRleDtcblx0XHRcdG1pblZhbHVlID0gbmV4dFZhbHVlO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gbWluSW5kZXg7XG59XG4iXX0=