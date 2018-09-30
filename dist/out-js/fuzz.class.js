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
            matchLocations.push(xLoc);
        }
      }

      return matchLocations.reverse();
    }
  }]);

  return Fuzz;
}();

exports.Fuzz = Fuzz;

_defineProperty(Fuzz, "DEFAULT_EDIT_THRESHOLD", 60);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mdXp6LmNsYXNzLnRzIl0sIm5hbWVzIjpbIkZ1enoiLCJERUZBVUxUX0VESVRfQ09TVFMiLCJERUZBVUxUX0VESVRfVEhSRVNIT0xEIiwiaXRlbXMiLCJzdWJqZWN0S2V5cyIsInF1ZXJ5IiwiZWRpdERpc3RhbmNlUGVyUXVlcnlMZW5ndGgiLCJmdXp6SXRlbXMiLCJnZXRGdXp6SXRlbXMiLCJzY29yZUZ1enpJdGVtcyIsImZpbHRlcmVkRnV6ekl0ZW1zIiwiZmlsdGVyIiwiZnV6ekl0ZW0iLCJlZGl0RGlzdGFuY2UiLCJsZW5ndGgiLCJzb3J0IiwiYSIsImIiLCJmb3JFYWNoIiwiaXRlbSIsImtleSIsInB1c2giLCJvcmlnaW5hbCIsInN1YmplY3QiLCJ0b0xvd2VyQ2FzZSIsImVkaXRNYXRyaXgiLCJnZXRJbml0aWFsRWRpdE1hdHJpeCIsImVkaXRDb3N0cyIsIm9wZXJhdGlvbk1hdHJpeCIsImZpbGxFZGl0TWF0cml4IiwibWF0Y2hMb2NhdGlvbnMiLCJnZXRNYXRjaExvY2F0aW9ucyIsImhlaWdodCIsIndpZHRoIiwiZmlyc3RSb3ciLCJpIiwicHJlUXVlcnlJbnNlcnRpb24iLCJpbml0aWFsRWRpdE1hdHJpeCIsInJvdyIsIkFycmF5IiwiZGVsZXRpb24iLCJtYXRyaXgiLCJnZXRJbml0aWFsT3BlcmF0aW9uTWF0cml4Iiwicm93SW5kZXgiLCJpbnNlcnRpb25Db3N0IiwicG9zdFF1ZXJ5SW5zZXJ0aW9uIiwiaW5zZXJ0aW9uIiwiY29sdW1uSW5kZXgiLCJkb2VzU3Vic3RpdHV0aW9uUmVwbGFjZSIsInN1YnN0aXR1dGlvbkNvc3QiLCJzdWJzdGl0dXRpb24iLCJvcGVyYXRpb25Db3N0cyIsIm9wZXJhdGlvbkluZGV4IiwiZ2V0TWluSW5kZXgiLCJ5TG9jIiwieExvYyIsInJldmVyc2UiLCJudW1iZXJzIiwibWluSW5kZXgiLCJtaW5WYWx1ZSIsIm5leHRJbmRleCIsIm5leHRWYWx1ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7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c291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRWRpdENvc3RzLCBGdXp6SXRlbSB9IGZyb20gJy4vbW9kZWxzJztcblxuZXhwb3J0IGNsYXNzIEZ1enoge1xuXG5cdHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgREVGQVVMVF9FRElUX1RIUkVTSE9MRDogbnVtYmVyID0gNjA7XG5cdHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgREVGQVVMVF9FRElUX0NPU1RTOiBFZGl0Q29zdHMgPSB7XG5cdFx0c3Vic3RpdHV0aW9uOiAxNDEsXG5cdFx0ZGVsZXRpb246IDEwMCxcblx0XHRpbnNlcnRpb246IDEwMCxcblx0XHRwcmVRdWVyeUluc2VydGlvbjogNCxcblx0XHRwb3N0UXVlcnlJbnNlcnRpb246IDIsXG5cdH1cblxuXHRwdWJsaWMgZWRpdENvc3RzOiBFZGl0Q29zdHMgPSB7IC4uLkZ1enouREVGQVVMVF9FRElUX0NPU1RTIH07XG5cdHB1YmxpYyBlZGl0RGlzdGFuY2VQZXJRdWVyeUxlbmd0aDogbnVtYmVyID0gRnV6ei5ERUZBVUxUX0VESVRfVEhSRVNIT0xEO1xuXG5cdHB1YmxpYyBmaWx0ZXJTb3J0KFxuXHRcdGl0ZW1zOiBhbnlbXSxcblx0XHRzdWJqZWN0S2V5czogc3RyaW5nW10sXG5cdFx0cXVlcnk6IHN0cmluZyxcblx0XHRlZGl0RGlzdGFuY2VQZXJRdWVyeUxlbmd0aDogbnVtYmVyID0gdGhpcy5lZGl0RGlzdGFuY2VQZXJRdWVyeUxlbmd0aCxcblx0KTogRnV6ekl0ZW1bXSB7XG5cdFx0Y29uc3QgZnV6ekl0ZW1zOiBGdXp6SXRlbVtdID0gdGhpcy5nZXRGdXp6SXRlbXMoaXRlbXMsIHN1YmplY3RLZXlzLCBxdWVyeSk7XG5cdFx0dGhpcy5zY29yZUZ1enpJdGVtcyhmdXp6SXRlbXMpO1xuXHRcdGlmICghcXVlcnkpIHsgcmV0dXJuIGZ1enpJdGVtczsgfVxuXHRcdGNvbnN0IGZpbHRlcmVkRnV6ekl0ZW1zID0gZnV6ekl0ZW1zLmZpbHRlcigoZnV6ekl0ZW06IEZ1enpJdGVtKSA9PiB7XG5cdFx0XHRyZXR1cm4gZnV6ekl0ZW0uZWRpdERpc3RhbmNlIDw9IChlZGl0RGlzdGFuY2VQZXJRdWVyeUxlbmd0aCAqIGZ1enpJdGVtLnF1ZXJ5Lmxlbmd0aCk7XG5cdFx0fSk7XG5cdFx0ZmlsdGVyZWRGdXp6SXRlbXMuc29ydCgoYTogRnV6ekl0ZW0sIGI6IEZ1enpJdGVtKSA9PiBhLmVkaXREaXN0YW5jZSAtIGIuZWRpdERpc3RhbmNlKTtcblx0XHRyZXR1cm4gZmlsdGVyZWRGdXp6SXRlbXM7XG5cdH1cblxuXHRwdWJsaWMgc29ydChcblx0XHRpdGVtczogYW55W10sXG5cdFx0c3ViamVjdEtleXM6IHN0cmluZ1tdLFxuXHRcdHF1ZXJ5OiBzdHJpbmcsXG5cdCk6IEZ1enpJdGVtW10ge1xuXHRcdGNvbnN0IGZ1enpJdGVtczogRnV6ekl0ZW1bXSA9IHRoaXMuZ2V0RnV6ekl0ZW1zKGl0ZW1zLCBzdWJqZWN0S2V5cywgcXVlcnkpO1xuXHRcdHRoaXMuc2NvcmVGdXp6SXRlbXMoZnV6ekl0ZW1zKTtcblx0XHRpZiAoIXF1ZXJ5KSB7IHJldHVybiBmdXp6SXRlbXM7IH1cblx0XHRmdXp6SXRlbXMuc29ydCgoYTogRnV6ekl0ZW0sIGI6IEZ1enpJdGVtKSA9PiBhLmVkaXREaXN0YW5jZSAtIGIuZWRpdERpc3RhbmNlKTtcblx0XHRyZXR1cm4gZnV6ekl0ZW1zO1xuXHR9XG5cblx0cHVibGljIGdldEZ1enpJdGVtcyhcblx0XHRpdGVtczogYW55W10sXG5cdFx0c3ViamVjdEtleXM6IHN0cmluZ1tdLFxuXHRcdHF1ZXJ5OiBzdHJpbmdcblx0KTogRnV6ekl0ZW1bXSB7XG5cdFx0Y29uc3QgZnV6ekl0ZW1zOiBGdXp6SXRlbVtdID0gW107XG5cdFx0aXRlbXMuZm9yRWFjaCgoaXRlbTogYW55KSA9PiB7XG5cdFx0XHRzdWJqZWN0S2V5cy5mb3JFYWNoKChrZXk6IHN0cmluZykgPT4ge1xuXHRcdFx0XHRmdXp6SXRlbXMucHVzaCh7XG5cdFx0XHRcdFx0b3JpZ2luYWw6IGl0ZW0sXG5cdFx0XHRcdFx0a2V5OiBrZXksXG5cdFx0XHRcdFx0c3ViamVjdDogaXRlbVtrZXldLnRvTG93ZXJDYXNlKCksXG5cdFx0XHRcdFx0cXVlcnk6IHF1ZXJ5LnRvTG93ZXJDYXNlKCksXG5cdFx0XHRcdH0gYXMgRnV6ekl0ZW0pO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIGZ1enpJdGVtcztcblx0fVxuXG5cdHB1YmxpYyBzY29yZUZ1enpJdGVtcyhmdXp6SXRlbXM6IEZ1enpJdGVtW10pIHtcblx0XHRmdXp6SXRlbXMuZm9yRWFjaCgoZnV6ekl0ZW06IEZ1enpJdGVtKSA9PiB7XG5cdFx0XHRjb25zdCBlZGl0TWF0cml4ID0gdGhpcy5nZXRJbml0aWFsRWRpdE1hdHJpeChcblx0XHRcdFx0ZnV6ekl0ZW0ucXVlcnksXG5cdFx0XHRcdGZ1enpJdGVtLnN1YmplY3QsXG5cdFx0XHRcdHRoaXMuZWRpdENvc3RzLFxuXHRcdFx0KTtcblx0XHRcdGNvbnN0IG9wZXJhdGlvbk1hdHJpeCA9IHRoaXMuZmlsbEVkaXRNYXRyaXgoXG5cdFx0XHRcdGVkaXRNYXRyaXgsXG5cdFx0XHRcdGZ1enpJdGVtLnF1ZXJ5LFxuXHRcdFx0XHRmdXp6SXRlbS5zdWJqZWN0LFxuXHRcdFx0XHR0aGlzLmVkaXRDb3N0cyxcblx0XHRcdCk7XG5cdFx0XHRjb25zdCBtYXRjaExvY2F0aW9ucyA9IHRoaXMuZ2V0TWF0Y2hMb2NhdGlvbnMob3BlcmF0aW9uTWF0cml4KTtcblx0XHRcdGZ1enpJdGVtLmVkaXRNYXRyaXggPSBlZGl0TWF0cml4O1xuXHRcdFx0ZnV6ekl0ZW0uZWRpdERpc3RhbmNlID0gZWRpdE1hdHJpeFtlZGl0TWF0cml4Lmxlbmd0aCAtIDFdW2VkaXRNYXRyaXhbMF0ubGVuZ3RoIC0gMV07XG5cdFx0XHRmdXp6SXRlbS5vcGVyYXRpb25NYXRyaXggPSBvcGVyYXRpb25NYXRyaXg7XG5cdFx0XHRmdXp6SXRlbS5tYXRjaExvY2F0aW9ucyA9IG1hdGNoTG9jYXRpb25zO1xuXHRcdH0pO1xuXHR9XG5cblx0cHVibGljIGdldEluaXRpYWxFZGl0TWF0cml4KFxuXHRcdHF1ZXJ5OiBzdHJpbmcsXG5cdFx0c3ViamVjdDogc3RyaW5nLFxuXHRcdGVkaXRDb3N0czogRWRpdENvc3RzLFxuXHQpOiBudW1iZXJbXVtdIHtcblx0XHRjb25zdCBoZWlnaHQgPSBxdWVyeS5sZW5ndGggKyAxO1xuXHRcdGNvbnN0IHdpZHRoID0gc3ViamVjdC5sZW5ndGggKyAxO1xuXG5cdFx0Y29uc3QgZmlyc3RSb3cgPSBbXTtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHdpZHRoOyBpKyspIHtcblx0XHRcdGZpcnN0Um93LnB1c2goaSAqIGVkaXRDb3N0cy5wcmVRdWVyeUluc2VydGlvbik7XG5cdFx0fVxuXG5cdFx0Y29uc3QgaW5pdGlhbEVkaXRNYXRyaXggPSBbZmlyc3RSb3ddO1xuXHRcdGZvciAobGV0IGkgPSAxOyBpIDwgaGVpZ2h0OyBpKyspIHtcblx0XHRcdGNvbnN0IHJvdyA9IG5ldyBBcnJheSh3aWR0aCk7XG5cdFx0XHRyb3dbMF0gPSBpICogZWRpdENvc3RzLmRlbGV0aW9uO1xuXHRcdFx0aW5pdGlhbEVkaXRNYXRyaXgucHVzaChyb3cpO1xuXHRcdH1cblx0XHRyZXR1cm4gaW5pdGlhbEVkaXRNYXRyaXg7XG5cdH1cblxuXHRwdWJsaWMgZmlsbEVkaXRNYXRyaXgoXG5cdFx0bWF0cml4OiBudW1iZXJbXVtdLFxuXHRcdHF1ZXJ5OiBzdHJpbmcsXG5cdFx0c3ViamVjdDogc3RyaW5nLFxuXHRcdGVkaXRDb3N0czogRWRpdENvc3RzLFxuXHQpOiBudW1iZXJbXVtdIHtcblx0XHRjb25zdCBoZWlnaHQgPSBtYXRyaXgubGVuZ3RoO1xuXHRcdGNvbnN0IHdpZHRoID0gbWF0cml4WzBdLmxlbmd0aDtcblx0XHRjb25zdCBvcGVyYXRpb25NYXRyaXggPSB0aGlzLmdldEluaXRpYWxPcGVyYXRpb25NYXRyaXgoaGVpZ2h0LCB3aWR0aCk7XG5cdFx0Zm9yIChsZXQgcm93SW5kZXggPSAxOyByb3dJbmRleCA8IGhlaWdodDsgcm93SW5kZXgrKykge1xuXHRcdFx0Y29uc3QgaW5zZXJ0aW9uQ29zdCA9IHJvd0luZGV4ID09PSAoaGVpZ2h0IC0gMSkgPyBlZGl0Q29zdHMucG9zdFF1ZXJ5SW5zZXJ0aW9uIDogZWRpdENvc3RzLmluc2VydGlvbjtcblx0XHRcdGZvciAobGV0IGNvbHVtbkluZGV4ID0gMTsgY29sdW1uSW5kZXggPCB3aWR0aDsgY29sdW1uSW5kZXgrKykge1xuXHRcdFx0XHRjb25zdCBkb2VzU3Vic3RpdHV0aW9uUmVwbGFjZSA9IHF1ZXJ5W3Jvd0luZGV4IC0gMV0gIT09IHN1YmplY3RbY29sdW1uSW5kZXggLSAxXTtcblx0XHRcdFx0Y29uc3Qgc3Vic3RpdHV0aW9uQ29zdCA9IGRvZXNTdWJzdGl0dXRpb25SZXBsYWNlID8gZWRpdENvc3RzLnN1YnN0aXR1dGlvbiA6IDA7XG5cdFx0XHRcdGNvbnN0IG9wZXJhdGlvbkNvc3RzID0gW1xuXHRcdFx0XHRcdG1hdHJpeFtyb3dJbmRleCAtIDFdW2NvbHVtbkluZGV4XSArIGVkaXRDb3N0cy5kZWxldGlvbixcblx0XHRcdFx0XHRtYXRyaXhbcm93SW5kZXhdW2NvbHVtbkluZGV4IC0gMV0gKyBpbnNlcnRpb25Db3N0LFxuXHRcdFx0XHRcdG1hdHJpeFtyb3dJbmRleCAtIDFdW2NvbHVtbkluZGV4IC0gMV0gKyBzdWJzdGl0dXRpb25Db3N0LFxuXHRcdFx0XHRdO1xuXHRcdFx0XHRjb25zdCBvcGVyYXRpb25JbmRleCA9IGdldE1pbkluZGV4KG9wZXJhdGlvbkNvc3RzKTtcblx0XHRcdFx0bWF0cml4W3Jvd0luZGV4XVtjb2x1bW5JbmRleF0gPSBvcGVyYXRpb25Db3N0c1tvcGVyYXRpb25JbmRleF07XG5cdFx0XHRcdGlmIChvcGVyYXRpb25JbmRleCA9PT0gMiAmJiAhZG9lc1N1YnN0aXR1dGlvblJlcGxhY2UpIHtcblx0XHRcdFx0XHRvcGVyYXRpb25NYXRyaXhbcm93SW5kZXhdW2NvbHVtbkluZGV4XSA9IDM7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0b3BlcmF0aW9uTWF0cml4W3Jvd0luZGV4XVtjb2x1bW5JbmRleF0gPSBvcGVyYXRpb25JbmRleDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gb3BlcmF0aW9uTWF0cml4O1xuXHR9XG5cblx0cHVibGljIGdldEluaXRpYWxPcGVyYXRpb25NYXRyaXgoaGVpZ2h0OiBudW1iZXIsIHdpZHRoOiBudW1iZXIpOiBudW1iZXJbXVtdIHtcblx0XHRjb25zdCBmaXJzdFJvdyA9IFtdO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgd2lkdGg7IGkrKykge1xuXHRcdFx0Zmlyc3RSb3cucHVzaCgxKTtcblx0XHR9XG5cblx0XHRjb25zdCBvcGVyYXRpb25NYXRyaXggPSBbZmlyc3RSb3ddO1xuXHRcdGZvcihsZXQgaSA9IDE7IGkgPCBoZWlnaHQ7IGkrKykge1xuXHRcdFx0Y29uc3Qgcm93ID0gbmV3IEFycmF5KHdpZHRoKTtcblx0XHRcdHJvd1swXSA9IDA7XG5cdFx0XHRvcGVyYXRpb25NYXRyaXgucHVzaChyb3cpO1xuXHRcdH1cblx0XHRyZXR1cm4gb3BlcmF0aW9uTWF0cml4O1xuXHR9XG5cblx0cHVibGljIGdldE1hdGNoTG9jYXRpb25zKG9wZXJhdGlvbk1hdHJpeDogbnVtYmVyW11bXSk6IG51bWJlcltdIHtcblx0XHRsZXQgeUxvYyA9IG9wZXJhdGlvbk1hdHJpeC5sZW5ndGggLSAxO1xuXHRcdGxldCB4TG9jID0gb3BlcmF0aW9uTWF0cml4WzBdLmxlbmd0aCAtIDE7XG5cdFx0bGV0IG1hdGNoTG9jYXRpb25zID0gW107XG5cblx0XHR3aGlsZSAoeUxvYyAhPT0gMCB8fCB4TG9jICE9PSAwKSB7XG5cdFx0XHRzd2l0Y2gob3BlcmF0aW9uTWF0cml4W3lMb2NdW3hMb2NdKSB7XG5cdFx0XHRcdGNhc2UgMDpcblx0XHRcdFx0XHR5TG9jLS1cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHRcdHhMb2MtLTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHRcdHlMb2MtLTtcblx0XHRcdFx0XHR4TG9jLS07XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgMzpcblx0XHRcdFx0XHR5TG9jLS07XG5cdFx0XHRcdFx0eExvYy0tO1xuXHRcdFx0XHRcdG1hdGNoTG9jYXRpb25zLnB1c2goeExvYyk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBtYXRjaExvY2F0aW9ucy5yZXZlcnNlKCk7XG5cdH1cblxufVxuXG5mdW5jdGlvbiBnZXRNaW5JbmRleChudW1iZXJzOiBudW1iZXJbXSk6IG51bWJlciB7XG5cdGxldCBtaW5JbmRleCA9IDA7XG5cdGxldCBtaW5WYWx1ZSA9IG51bWJlcnNbMF07XG5cdGZvciAobGV0IG5leHRJbmRleCA9IDE7IG5leHRJbmRleCA8IG51bWJlcnMubGVuZ3RoOyBuZXh0SW5kZXgrKykge1xuXHRcdGNvbnN0IG5leHRWYWx1ZSA9IG51bWJlcnNbbmV4dEluZGV4XTtcblx0XHRpZiAobmV4dFZhbHVlIDwgbWluVmFsdWUpIHtcblx0XHRcdG1pbkluZGV4ID0gbmV4dEluZGV4O1xuXHRcdFx0bWluVmFsdWUgPSBuZXh0VmFsdWU7XG5cdFx0fVxuXHR9XG5cdHJldHVybiBtaW5JbmRleDtcbn1cbiJdfQ==