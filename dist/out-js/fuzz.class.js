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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mdXp6LmNsYXNzLnRzIl0sIm5hbWVzIjpbIkZ1enoiLCJERUZBVUxUX0VESVRfQ09TVFMiLCJERUZBVUxUX0VESVRfVEhSRVNIT0xEIiwiaXRlbXMiLCJzdWJqZWN0S2V5cyIsInF1ZXJ5IiwiZWRpdERpc3RhbmNlUGVyUXVlcnlMZW5ndGgiLCJmdXp6SXRlbXMiLCJnZXRGdXp6SXRlbXMiLCJzY29yZUZ1enpJdGVtcyIsImZpbHRlcmVkRnV6ekl0ZW1zIiwiZmlsdGVyIiwiZnV6ekl0ZW0iLCJlZGl0RGlzdGFuY2UiLCJsZW5ndGgiLCJzb3J0IiwiYSIsImIiLCJmb3JFYWNoIiwiaXRlbSIsImtleSIsInB1c2giLCJvcmlnaW5hbCIsInN1YmplY3QiLCJ0b0xvd2VyQ2FzZSIsImVkaXRNYXRyaXgiLCJnZXRJbml0aWFsRWRpdE1hdHJpeCIsImVkaXRDb3N0cyIsIm9wZXJhdGlvbk1hdHJpeCIsImZpbGxFZGl0TWF0cml4IiwibWF0Y2hMb2NhdGlvbnMiLCJnZXRNYXRjaExvY2F0aW9ucyIsImhlaWdodCIsIndpZHRoIiwiZmlyc3RSb3ciLCJpIiwicHJlUXVlcnlJbnNlcnRpb24iLCJpbml0aWFsRWRpdE1hdHJpeCIsInJvdyIsIkFycmF5IiwiZGVsZXRpb24iLCJtYXRyaXgiLCJnZXRJbml0aWFsT3BlcmF0aW9uTWF0cml4Iiwicm93SW5kZXgiLCJpbnNlcnRpb25Db3N0IiwicG9zdFF1ZXJ5SW5zZXJ0aW9uIiwiaW5zZXJ0aW9uIiwiY29sdW1uSW5kZXgiLCJkb2VzU3Vic3RpdHV0aW9uUmVwbGFjZSIsInN1YnN0aXR1dGlvbkNvc3QiLCJzdWJzdGl0dXRpb24iLCJvcGVyYXRpb25Db3N0cyIsIm9wZXJhdGlvbkluZGV4IiwiZ2V0TWluSW5kZXgiLCJ5TG9jIiwieExvYyIsInJldmVyc2UiLCJudW1iZXJzIiwibWluSW5kZXgiLCJtaW5WYWx1ZSIsIm5leHRJbmRleCIsIm5leHRWYWx1ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7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c291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRWRpdENvc3RzLCBGdXp6SXRlbSB9IGZyb20gJy4vbW9kZWxzJztcblxuZXhwb3J0IGNsYXNzIEZ1enoge1xuXG5cdHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgREVGQVVMVF9FRElUX1RIUkVTSE9MRDogbnVtYmVyID0gNDA7XG5cdHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgREVGQVVMVF9FRElUX0NPU1RTOiBFZGl0Q29zdHMgPSB7XG5cdFx0c3Vic3RpdHV0aW9uOiAxNDEsXG5cdFx0ZGVsZXRpb246IDEwMCxcblx0XHRpbnNlcnRpb246IDEwMCxcblx0XHRwcmVRdWVyeUluc2VydGlvbjogMTAsXG5cdFx0cG9zdFF1ZXJ5SW5zZXJ0aW9uOiA1LFxuXHR9XG5cblx0cHVibGljIGVkaXRDb3N0czogRWRpdENvc3RzID0geyAuLi5GdXp6LkRFRkFVTFRfRURJVF9DT1NUUyB9O1xuXHRwdWJsaWMgZWRpdERpc3RhbmNlUGVyUXVlcnlMZW5ndGg6IG51bWJlciA9IEZ1enouREVGQVVMVF9FRElUX1RIUkVTSE9MRDtcblxuXHRwdWJsaWMgZmlsdGVyU29ydChcblx0XHRpdGVtczogYW55W10sXG5cdFx0c3ViamVjdEtleXM6IHN0cmluZ1tdLFxuXHRcdHF1ZXJ5OiBzdHJpbmcsXG5cdFx0ZWRpdERpc3RhbmNlUGVyUXVlcnlMZW5ndGg6IG51bWJlciA9IHRoaXMuZWRpdERpc3RhbmNlUGVyUXVlcnlMZW5ndGgsXG5cdCk6IEZ1enpJdGVtW10ge1xuXHRcdGNvbnN0IGZ1enpJdGVtczogRnV6ekl0ZW1bXSA9IHRoaXMuZ2V0RnV6ekl0ZW1zKGl0ZW1zLCBzdWJqZWN0S2V5cywgcXVlcnkpO1xuXHRcdHRoaXMuc2NvcmVGdXp6SXRlbXMoZnV6ekl0ZW1zKTtcblx0XHRpZiAoIXF1ZXJ5KSB7IHJldHVybiBmdXp6SXRlbXM7IH1cblx0XHRjb25zdCBmaWx0ZXJlZEZ1enpJdGVtcyA9IGZ1enpJdGVtcy5maWx0ZXIoKGZ1enpJdGVtOiBGdXp6SXRlbSkgPT4ge1xuXHRcdFx0cmV0dXJuIGZ1enpJdGVtLmVkaXREaXN0YW5jZSA8PSAoZWRpdERpc3RhbmNlUGVyUXVlcnlMZW5ndGggKiBmdXp6SXRlbS5xdWVyeS5sZW5ndGgpO1xuXHRcdH0pO1xuXHRcdGZpbHRlcmVkRnV6ekl0ZW1zLnNvcnQoKGE6IEZ1enpJdGVtLCBiOiBGdXp6SXRlbSkgPT4gYS5lZGl0RGlzdGFuY2UgLSBiLmVkaXREaXN0YW5jZSk7XG5cdFx0cmV0dXJuIGZpbHRlcmVkRnV6ekl0ZW1zO1xuXHR9XG5cblx0cHVibGljIHNvcnQoXG5cdFx0aXRlbXM6IGFueVtdLFxuXHRcdHN1YmplY3RLZXlzOiBzdHJpbmdbXSxcblx0XHRxdWVyeTogc3RyaW5nLFxuXHQpOiBGdXp6SXRlbVtdIHtcblx0XHRjb25zdCBmdXp6SXRlbXM6IEZ1enpJdGVtW10gPSB0aGlzLmdldEZ1enpJdGVtcyhpdGVtcywgc3ViamVjdEtleXMsIHF1ZXJ5KTtcblx0XHR0aGlzLnNjb3JlRnV6ekl0ZW1zKGZ1enpJdGVtcyk7XG5cdFx0aWYgKCFxdWVyeSkgeyByZXR1cm4gZnV6ekl0ZW1zOyB9XG5cdFx0ZnV6ekl0ZW1zLnNvcnQoKGE6IEZ1enpJdGVtLCBiOiBGdXp6SXRlbSkgPT4gYS5lZGl0RGlzdGFuY2UgLSBiLmVkaXREaXN0YW5jZSk7XG5cdFx0cmV0dXJuIGZ1enpJdGVtcztcblx0fVxuXG5cdHB1YmxpYyBnZXRGdXp6SXRlbXMoXG5cdFx0aXRlbXM6IGFueVtdLFxuXHRcdHN1YmplY3RLZXlzOiBzdHJpbmdbXSxcblx0XHRxdWVyeTogc3RyaW5nXG5cdCk6IEZ1enpJdGVtW10ge1xuXHRcdGNvbnN0IGZ1enpJdGVtczogRnV6ekl0ZW1bXSA9IFtdO1xuXHRcdGl0ZW1zLmZvckVhY2goKGl0ZW06IGFueSkgPT4ge1xuXHRcdFx0c3ViamVjdEtleXMuZm9yRWFjaCgoa2V5OiBzdHJpbmcpID0+IHtcblx0XHRcdFx0ZnV6ekl0ZW1zLnB1c2goe1xuXHRcdFx0XHRcdG9yaWdpbmFsOiBpdGVtLFxuXHRcdFx0XHRcdGtleToga2V5LFxuXHRcdFx0XHRcdHN1YmplY3Q6IGl0ZW1ba2V5XS50b0xvd2VyQ2FzZSgpLFxuXHRcdFx0XHRcdHF1ZXJ5OiBxdWVyeS50b0xvd2VyQ2FzZSgpLFxuXHRcdFx0XHR9IGFzIEZ1enpJdGVtKTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHRcdHJldHVybiBmdXp6SXRlbXM7XG5cdH1cblxuXHRwdWJsaWMgc2NvcmVGdXp6SXRlbXMoZnV6ekl0ZW1zOiBGdXp6SXRlbVtdKSB7XG5cdFx0ZnV6ekl0ZW1zLmZvckVhY2goKGZ1enpJdGVtOiBGdXp6SXRlbSkgPT4ge1xuXHRcdFx0Y29uc3QgZWRpdE1hdHJpeCA9IHRoaXMuZ2V0SW5pdGlhbEVkaXRNYXRyaXgoXG5cdFx0XHRcdGZ1enpJdGVtLnF1ZXJ5LFxuXHRcdFx0XHRmdXp6SXRlbS5zdWJqZWN0LFxuXHRcdFx0XHR0aGlzLmVkaXRDb3N0cyxcblx0XHRcdCk7XG5cdFx0XHRjb25zdCBvcGVyYXRpb25NYXRyaXggPSB0aGlzLmZpbGxFZGl0TWF0cml4KFxuXHRcdFx0XHRlZGl0TWF0cml4LFxuXHRcdFx0XHRmdXp6SXRlbS5xdWVyeSxcblx0XHRcdFx0ZnV6ekl0ZW0uc3ViamVjdCxcblx0XHRcdFx0dGhpcy5lZGl0Q29zdHMsXG5cdFx0XHQpO1xuXHRcdFx0Y29uc3QgbWF0Y2hMb2NhdGlvbnMgPSB0aGlzLmdldE1hdGNoTG9jYXRpb25zKG9wZXJhdGlvbk1hdHJpeCk7XG5cdFx0XHRmdXp6SXRlbS5lZGl0TWF0cml4ID0gZWRpdE1hdHJpeDtcblx0XHRcdGZ1enpJdGVtLmVkaXREaXN0YW5jZSA9IGVkaXRNYXRyaXhbZWRpdE1hdHJpeC5sZW5ndGggLSAxXVtlZGl0TWF0cml4WzBdLmxlbmd0aCAtIDFdO1xuXHRcdFx0ZnV6ekl0ZW0ub3BlcmF0aW9uTWF0cml4ID0gb3BlcmF0aW9uTWF0cml4O1xuXHRcdFx0ZnV6ekl0ZW0ubWF0Y2hMb2NhdGlvbnMgPSBtYXRjaExvY2F0aW9ucztcblx0XHR9KTtcblx0fVxuXG5cdHB1YmxpYyBnZXRJbml0aWFsRWRpdE1hdHJpeChcblx0XHRxdWVyeTogc3RyaW5nLFxuXHRcdHN1YmplY3Q6IHN0cmluZyxcblx0XHRlZGl0Q29zdHM6IEVkaXRDb3N0cyxcblx0KTogbnVtYmVyW11bXSB7XG5cdFx0Y29uc3QgaGVpZ2h0ID0gcXVlcnkubGVuZ3RoICsgMTtcblx0XHRjb25zdCB3aWR0aCA9IHN1YmplY3QubGVuZ3RoICsgMTtcblxuXHRcdGNvbnN0IGZpcnN0Um93ID0gW107XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB3aWR0aDsgaSsrKSB7XG5cdFx0XHRmaXJzdFJvdy5wdXNoKGkgKiBlZGl0Q29zdHMucHJlUXVlcnlJbnNlcnRpb24pO1xuXHRcdH1cblxuXHRcdGNvbnN0IGluaXRpYWxFZGl0TWF0cml4ID0gW2ZpcnN0Um93XTtcblx0XHRmb3IgKGxldCBpID0gMTsgaSA8IGhlaWdodDsgaSsrKSB7XG5cdFx0XHRjb25zdCByb3cgPSBuZXcgQXJyYXkod2lkdGgpO1xuXHRcdFx0cm93WzBdID0gaSAqIGVkaXRDb3N0cy5kZWxldGlvbjtcblx0XHRcdGluaXRpYWxFZGl0TWF0cml4LnB1c2gocm93KTtcblx0XHR9XG5cdFx0cmV0dXJuIGluaXRpYWxFZGl0TWF0cml4O1xuXHR9XG5cblx0cHVibGljIGZpbGxFZGl0TWF0cml4KFxuXHRcdG1hdHJpeDogbnVtYmVyW11bXSxcblx0XHRxdWVyeTogc3RyaW5nLFxuXHRcdHN1YmplY3Q6IHN0cmluZyxcblx0XHRlZGl0Q29zdHM6IEVkaXRDb3N0cyxcblx0KTogbnVtYmVyW11bXSB7XG5cdFx0Y29uc3QgaGVpZ2h0ID0gbWF0cml4Lmxlbmd0aDtcblx0XHRjb25zdCB3aWR0aCA9IG1hdHJpeFswXS5sZW5ndGg7XG5cdFx0Y29uc3Qgb3BlcmF0aW9uTWF0cml4ID0gdGhpcy5nZXRJbml0aWFsT3BlcmF0aW9uTWF0cml4KGhlaWdodCwgd2lkdGgpO1xuXHRcdGZvciAobGV0IHJvd0luZGV4ID0gMTsgcm93SW5kZXggPCBoZWlnaHQ7IHJvd0luZGV4KyspIHtcblx0XHRcdGNvbnN0IGluc2VydGlvbkNvc3QgPSByb3dJbmRleCA9PT0gKGhlaWdodCAtIDEpID8gZWRpdENvc3RzLnBvc3RRdWVyeUluc2VydGlvbiA6IGVkaXRDb3N0cy5pbnNlcnRpb247XG5cdFx0XHRmb3IgKGxldCBjb2x1bW5JbmRleCA9IDE7IGNvbHVtbkluZGV4IDwgd2lkdGg7IGNvbHVtbkluZGV4KyspIHtcblx0XHRcdFx0Y29uc3QgZG9lc1N1YnN0aXR1dGlvblJlcGxhY2UgPSBxdWVyeVtyb3dJbmRleCAtIDFdICE9PSBzdWJqZWN0W2NvbHVtbkluZGV4IC0gMV07XG5cdFx0XHRcdGNvbnN0IHN1YnN0aXR1dGlvbkNvc3QgPSBkb2VzU3Vic3RpdHV0aW9uUmVwbGFjZSA/IGVkaXRDb3N0cy5zdWJzdGl0dXRpb24gOiAwO1xuXHRcdFx0XHRjb25zdCBvcGVyYXRpb25Db3N0cyA9IFtcblx0XHRcdFx0XHRtYXRyaXhbcm93SW5kZXggLSAxXVtjb2x1bW5JbmRleF0gKyBlZGl0Q29zdHMuZGVsZXRpb24sXG5cdFx0XHRcdFx0bWF0cml4W3Jvd0luZGV4XVtjb2x1bW5JbmRleCAtIDFdICsgaW5zZXJ0aW9uQ29zdCxcblx0XHRcdFx0XHRtYXRyaXhbcm93SW5kZXggLSAxXVtjb2x1bW5JbmRleCAtIDFdICsgc3Vic3RpdHV0aW9uQ29zdCxcblx0XHRcdFx0XTtcblx0XHRcdFx0Y29uc3Qgb3BlcmF0aW9uSW5kZXggPSBnZXRNaW5JbmRleChvcGVyYXRpb25Db3N0cyk7XG5cdFx0XHRcdG1hdHJpeFtyb3dJbmRleF1bY29sdW1uSW5kZXhdID0gb3BlcmF0aW9uQ29zdHNbb3BlcmF0aW9uSW5kZXhdO1xuXHRcdFx0XHRpZiAob3BlcmF0aW9uSW5kZXggPT09IDIgJiYgIWRvZXNTdWJzdGl0dXRpb25SZXBsYWNlKSB7XG5cdFx0XHRcdFx0b3BlcmF0aW9uTWF0cml4W3Jvd0luZGV4XVtjb2x1bW5JbmRleF0gPSAzO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG9wZXJhdGlvbk1hdHJpeFtyb3dJbmRleF1bY29sdW1uSW5kZXhdID0gb3BlcmF0aW9uSW5kZXg7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIG9wZXJhdGlvbk1hdHJpeDtcblx0fVxuXG5cdHB1YmxpYyBnZXRJbml0aWFsT3BlcmF0aW9uTWF0cml4KGhlaWdodDogbnVtYmVyLCB3aWR0aDogbnVtYmVyKTogbnVtYmVyW11bXSB7XG5cdFx0Y29uc3QgZmlyc3RSb3cgPSBbXTtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHdpZHRoOyBpKyspIHtcblx0XHRcdGZpcnN0Um93LnB1c2goMSk7XG5cdFx0fVxuXG5cdFx0Y29uc3Qgb3BlcmF0aW9uTWF0cml4ID0gW2ZpcnN0Um93XTtcblx0XHRmb3IobGV0IGkgPSAxOyBpIDwgaGVpZ2h0OyBpKyspIHtcblx0XHRcdGNvbnN0IHJvdyA9IG5ldyBBcnJheSh3aWR0aCk7XG5cdFx0XHRyb3dbMF0gPSAwO1xuXHRcdFx0b3BlcmF0aW9uTWF0cml4LnB1c2gocm93KTtcblx0XHR9XG5cdFx0cmV0dXJuIG9wZXJhdGlvbk1hdHJpeDtcblx0fVxuXG5cdHB1YmxpYyBnZXRNYXRjaExvY2F0aW9ucyhvcGVyYXRpb25NYXRyaXg6IG51bWJlcltdW10pOiBudW1iZXJbXSB7XG5cdFx0bGV0IHlMb2MgPSBvcGVyYXRpb25NYXRyaXgubGVuZ3RoIC0gMTtcblx0XHRsZXQgeExvYyA9IG9wZXJhdGlvbk1hdHJpeFswXS5sZW5ndGggLSAxO1xuXHRcdGxldCBtYXRjaExvY2F0aW9ucyA9IFtdO1xuXG5cdFx0d2hpbGUgKHlMb2MgIT09IDAgfHwgeExvYyAhPT0gMCkge1xuXHRcdFx0c3dpdGNoKG9wZXJhdGlvbk1hdHJpeFt5TG9jXVt4TG9jXSkge1xuXHRcdFx0XHRjYXNlIDA6XG5cdFx0XHRcdFx0eUxvYy0tXG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgMTpcblx0XHRcdFx0XHR4TG9jLS07XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgMjpcblx0XHRcdFx0XHR5TG9jLS07XG5cdFx0XHRcdFx0eExvYy0tO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIDM6XG5cdFx0XHRcdFx0eUxvYy0tO1xuXHRcdFx0XHRcdHhMb2MtLTtcblx0XHRcdFx0XHRtYXRjaExvY2F0aW9ucy5wdXNoKHlMb2MpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gbWF0Y2hMb2NhdGlvbnMucmV2ZXJzZSgpO1xuXHR9XG5cbn1cblxuZnVuY3Rpb24gZ2V0TWluSW5kZXgobnVtYmVyczogbnVtYmVyW10pOiBudW1iZXIge1xuXHRsZXQgbWluSW5kZXggPSAwO1xuXHRsZXQgbWluVmFsdWUgPSBudW1iZXJzWzBdO1xuXHRmb3IgKGxldCBuZXh0SW5kZXggPSAxOyBuZXh0SW5kZXggPCBudW1iZXJzLmxlbmd0aDsgbmV4dEluZGV4KyspIHtcblx0XHRjb25zdCBuZXh0VmFsdWUgPSBudW1iZXJzW25leHRJbmRleF07XG5cdFx0aWYgKG5leHRWYWx1ZSA8IG1pblZhbHVlKSB7XG5cdFx0XHRtaW5JbmRleCA9IG5leHRJbmRleDtcblx0XHRcdG1pblZhbHVlID0gbmV4dFZhbHVlO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gbWluSW5kZXg7XG59XG4iXX0=