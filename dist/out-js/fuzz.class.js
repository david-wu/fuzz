"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Fuzz = void 0;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

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

        _this.fillEditMatrix(editMatrix, fuzzItem.query, fuzzItem.subject, _this.editCosts);

        fuzzItem.editMatrix = editMatrix;
        fuzzItem.editDistance = editMatrix[editMatrix.length - 1][editMatrix[0].length - 1];
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

      for (var rowIndex = 1; rowIndex < height; rowIndex++) {
        var insertionCost = rowIndex === height - 1 ? editCosts.postQueryInsertion : editCosts.insertion;

        for (var columnIndex = 1; columnIndex < width; columnIndex++) {
          var substitutionCost = query[rowIndex - 1] === subject[columnIndex - 1] ? 0 : editCosts.substitution;
          var lowestAccumulatedCost = Math.min(matrix[rowIndex - 1][columnIndex] + editCosts.deletion, matrix[rowIndex][columnIndex - 1] + insertionCost, matrix[rowIndex - 1][columnIndex - 1] + substitutionCost);
          matrix[rowIndex][columnIndex] = lowestAccumulatedCost;
        }
      }

      return matrix;
    }
  }, {
    key: "debugFuzzItem",
    value: function debugFuzzItem(fuzzItem) {
      var tableHeader = fuzzItem.subject.split('').map(function (character) {
        return padString(character, 6);
      }).join('');
      var tableRows = fuzzItem.editMatrix.map(function (row, rowIndex) {
        var rowString = row.map(function (cell) {
          return padString(cell, 6);
        }).join('');
        return "".concat(fuzzItem.query[rowIndex - 1] || ' ', " ").concat(rowString);
      });
      return ["\nquery: ".concat(fuzzItem.query, ", subject: ").concat(fuzzItem.subject, ", editDistance: ").concat(fuzzItem.editDistance), "        ".concat(tableHeader)].concat(_toConsumableArray(tableRows)).join('\n');
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

function padString(subject, padding) {
  return (' '.repeat(padding) + subject).slice(-padding);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mdXp6LmNsYXNzLnRzIl0sIm5hbWVzIjpbIkZ1enoiLCJERUZBVUxUX0VESVRfQ09TVFMiLCJERUZBVUxUX0VESVRfVEhSRVNIT0xEIiwiaXRlbXMiLCJzdWJqZWN0S2V5cyIsInF1ZXJ5IiwiZWRpdERpc3RhbmNlUGVyUXVlcnlMZW5ndGgiLCJmdXp6SXRlbXMiLCJnZXRGdXp6SXRlbXMiLCJzY29yZUZ1enpJdGVtcyIsImZpbHRlcmVkRnV6ekl0ZW1zIiwiZmlsdGVyIiwiZnV6ekl0ZW0iLCJlZGl0RGlzdGFuY2UiLCJsZW5ndGgiLCJzb3J0IiwiYSIsImIiLCJmb3JFYWNoIiwiaXRlbSIsImtleSIsInB1c2giLCJvcmlnaW5hbCIsInN1YmplY3QiLCJlZGl0TWF0cml4IiwiZ2V0SW5pdGlhbEVkaXRNYXRyaXgiLCJlZGl0Q29zdHMiLCJmaWxsRWRpdE1hdHJpeCIsImhlaWdodCIsIndpZHRoIiwiZmlyc3RSb3ciLCJpIiwicHJlUXVlcnlJbnNlcnRpb24iLCJpbml0aWFsRWRpdE1hdHJpeCIsInJvdyIsIkFycmF5IiwiZGVsZXRpb24iLCJtYXRyaXgiLCJyb3dJbmRleCIsImluc2VydGlvbkNvc3QiLCJwb3N0UXVlcnlJbnNlcnRpb24iLCJpbnNlcnRpb24iLCJjb2x1bW5JbmRleCIsInN1YnN0aXR1dGlvbkNvc3QiLCJzdWJzdGl0dXRpb24iLCJsb3dlc3RBY2N1bXVsYXRlZENvc3QiLCJNYXRoIiwibWluIiwidGFibGVIZWFkZXIiLCJzcGxpdCIsIm1hcCIsImNoYXJhY3RlciIsInBhZFN0cmluZyIsImpvaW4iLCJ0YWJsZVJvd3MiLCJyb3dTdHJpbmciLCJjZWxsIiwicGFkZGluZyIsInJlcGVhdCIsInNsaWNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBR2FBLEk7Ozs7Ozt5REFXdUJBLElBQUksQ0FBQ0Msa0I7O3dEQUNJRCxJQUFJLENBQUNFLHNCOzs7OzsrQkFHaERDLEssRUFDQUMsVyxFQUNB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akQ7QUFDQSxPQUgyQixDQUE1QjtBQUlBLGFBQU8sb0JBQ00zQyxRQUFRLENBQUNQLEtBRGYsd0JBQ2tDTyxRQUFRLENBQUNXLE9BRDNDLDZCQUNxRVgsUUFBUSxDQUFDQyxZQUQ5RSxxQkFFS21DLFdBRkwsNkJBR0hNLFNBSEcsR0FJTEQsSUFKSyxDQUlBLElBSkEsQ0FBUDtBQUtBOzs7Ozs7OztnQkFySVdyRCxJLDRCQUU0QyxFOztnQkFGNUNBLEksd0JBRzJDO0FBQ3RENEMsRUFBQUEsWUFBWSxFQUFFLEdBRHdDO0FBRXREUixFQUFBQSxRQUFRLEVBQUUsR0FGNEM7QUFHdERLLEVBQUFBLFNBQVMsRUFBRSxHQUgyQztBQUl0RFQsRUFBQUEsaUJBQWlCLEVBQUUsRUFKbUM7QUFLdERRLEVBQUFBLGtCQUFrQixFQUFFO0FBTGtDLEM7O0FBc0l4RCxTQUFTWSxTQUFULENBQW1CN0IsT0FBbkIsRUFBaUNrQyxPQUFqQyxFQUEwRDtBQUN6RCxTQUFPLENBQUMsSUFBSUMsTUFBSixDQUFXRCxPQUFYLElBQXNCbEMsT0FBdkIsRUFBZ0NvQyxLQUFoQyxDQUFzQyxDQUFDRixPQUF2QyxDQUFQO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCB7IEVkaXRDb3N0cywgRnV6ekl0ZW0gfSBmcm9tICcuL21vZGVscyc7XG5cbmV4cG9ydCBjbGFzcyBGdXp6IHtcblxuXHRwdWJsaWMgc3RhdGljIHJlYWRvbmx5IERFRkFVTFRfRURJVF9USFJFU0hPTEQ6IG51bWJlciA9IDQwO1xuXHRwdWJsaWMgc3RhdGljIHJlYWRvbmx5IERFRkFVTFRfRURJVF9DT1NUUzogRWRpdENvc3RzID0ge1xuXHRcdHN1YnN0aXR1dGlvbjogMTQxLFxuXHRcdGRlbGV0aW9uOiAxMDAsXG5cdFx0aW5zZXJ0aW9uOiAxMDAsXG5cdFx0cHJlUXVlcnlJbnNlcnRpb246IDEwLFxuXHRcdHBvc3RRdWVyeUluc2VydGlvbjogNSxcblx0fVxuXG5cdHB1YmxpYyBlZGl0Q29zdHM6IEVkaXRDb3N0cyA9IHsgLi4uRnV6ei5ERUZBVUxUX0VESVRfQ09TVFMgfTtcblx0cHVibGljIGVkaXREaXN0YW5jZVBlclF1ZXJ5TGVuZ3RoOiBudW1iZXIgPSBGdXp6LkRFRkFVTFRfRURJVF9USFJFU0hPTEQ7XG5cblx0cHVibGljIGZpbHRlclNvcnQoXG5cdFx0aXRlbXM6IGFueVtdLFxuXHRcdHN1YmplY3RLZXlzOiBzdHJpbmdbXSxcblx0XHRxdWVyeTogc3RyaW5nLFxuXHRcdGVkaXREaXN0YW5jZVBlclF1ZXJ5TGVuZ3RoOiBudW1iZXIgPSB0aGlzLmVkaXREaXN0YW5jZVBlclF1ZXJ5TGVuZ3RoLFxuXHQpIHtcblx0XHRjb25zdCBmdXp6SXRlbXM6IEZ1enpJdGVtW10gPSB0aGlzLmdldEZ1enpJdGVtcyhpdGVtcywgc3ViamVjdEtleXMsIHF1ZXJ5KTtcblx0XHR0aGlzLnNjb3JlRnV6ekl0ZW1zKGZ1enpJdGVtcyk7XG5cdFx0Y29uc3QgZmlsdGVyZWRGdXp6SXRlbXMgPSBmdXp6SXRlbXMuZmlsdGVyKChmdXp6SXRlbTogRnV6ekl0ZW0pID0+IHtcblx0XHRcdHJldHVybiBmdXp6SXRlbS5lZGl0RGlzdGFuY2UgPD0gKGVkaXREaXN0YW5jZVBlclF1ZXJ5TGVuZ3RoICogZnV6ekl0ZW0ucXVlcnkubGVuZ3RoKTtcblx0XHR9KTtcblx0XHRmaWx0ZXJlZEZ1enpJdGVtcy5zb3J0KChhOiBGdXp6SXRlbSwgYjogRnV6ekl0ZW0pID0+IGEuZWRpdERpc3RhbmNlIC0gYi5lZGl0RGlzdGFuY2UpO1xuXHRcdHJldHVybiBmaWx0ZXJlZEZ1enpJdGVtcztcblx0fVxuXG5cdHB1YmxpYyBzb3J0KFxuXHRcdGl0ZW1zOiBhbnlbXSxcblx0XHRzdWJqZWN0S2V5czogc3RyaW5nW10sXG5cdFx0cXVlcnk6IHN0cmluZyxcblx0KTogRnV6ekl0ZW1bXSB7XG5cdFx0Y29uc3QgZnV6ekl0ZW1zOiBGdXp6SXRlbVtdID0gdGhpcy5nZXRGdXp6SXRlbXMoaXRlbXMsIHN1YmplY3RLZXlzLCBxdWVyeSk7XG5cdFx0dGhpcy5zY29yZUZ1enpJdGVtcyhmdXp6SXRlbXMpO1xuXHRcdGZ1enpJdGVtcy5zb3J0KChhOiBGdXp6SXRlbSwgYjogRnV6ekl0ZW0pID0+IGEuZWRpdERpc3RhbmNlIC0gYi5lZGl0RGlzdGFuY2UpO1xuXHRcdHJldHVybiBmdXp6SXRlbXM7XG5cdH1cblxuXHRwdWJsaWMgZ2V0RnV6ekl0ZW1zKFxuXHRcdGl0ZW1zOiBhbnlbXSxcblx0XHRzdWJqZWN0S2V5czogc3RyaW5nW10sXG5cdFx0cXVlcnk6IHN0cmluZ1xuXHQpOiBGdXp6SXRlbVtdIHtcblx0XHRjb25zdCBmdXp6SXRlbXM6IEZ1enpJdGVtW10gPSBbXTtcblx0XHRpdGVtcy5mb3JFYWNoKChpdGVtOiBhbnkpID0+IHtcblx0XHRcdHN1YmplY3RLZXlzLmZvckVhY2goKGtleTogc3RyaW5nKSA9PiB7XG5cdFx0XHRcdGZ1enpJdGVtcy5wdXNoKHtcblx0XHRcdFx0XHRvcmlnaW5hbDogaXRlbSxcblx0XHRcdFx0XHRrZXk6IGtleSxcblx0XHRcdFx0XHRzdWJqZWN0OiBpdGVtW2tleV0sXG5cdFx0XHRcdFx0cXVlcnk6IHF1ZXJ5LFxuXHRcdFx0XHR9IGFzIEZ1enpJdGVtKTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHRcdHJldHVybiBmdXp6SXRlbXM7XG5cdH1cblxuXHRwdWJsaWMgc2NvcmVGdXp6SXRlbXMoZnV6ekl0ZW1zOiBGdXp6SXRlbVtdKSB7XG5cdFx0ZnV6ekl0ZW1zLmZvckVhY2goKGZ1enpJdGVtOiBGdXp6SXRlbSkgPT4ge1xuXHRcdFx0Y29uc3QgZWRpdE1hdHJpeCA9IHRoaXMuZ2V0SW5pdGlhbEVkaXRNYXRyaXgoXG5cdFx0XHRcdGZ1enpJdGVtLnF1ZXJ5LFxuXHRcdFx0XHRmdXp6SXRlbS5zdWJqZWN0LFxuXHRcdFx0XHR0aGlzLmVkaXRDb3N0cyxcblx0XHRcdCk7XG5cdFx0XHR0aGlzLmZpbGxFZGl0TWF0cml4KFxuXHRcdFx0XHRlZGl0TWF0cml4LFxuXHRcdFx0XHRmdXp6SXRlbS5xdWVyeSxcblx0XHRcdFx0ZnV6ekl0ZW0uc3ViamVjdCxcblx0XHRcdFx0dGhpcy5lZGl0Q29zdHMsXG5cdFx0XHQpO1xuXHRcdFx0ZnV6ekl0ZW0uZWRpdE1hdHJpeCA9IGVkaXRNYXRyaXg7XG5cdFx0XHRmdXp6SXRlbS5lZGl0RGlzdGFuY2UgPSBlZGl0TWF0cml4W2VkaXRNYXRyaXgubGVuZ3RoIC0gMV1bZWRpdE1hdHJpeFswXS5sZW5ndGggLSAxXTtcblx0XHR9KTtcblx0fVxuXG5cdHB1YmxpYyBnZXRJbml0aWFsRWRpdE1hdHJpeChcblx0XHRxdWVyeTogc3RyaW5nLFxuXHRcdHN1YmplY3Q6IHN0cmluZyxcblx0XHRlZGl0Q29zdHM6IEVkaXRDb3N0cyxcblx0KTogbnVtYmVyW11bXSB7XG5cdFx0Y29uc3QgaGVpZ2h0ID0gcXVlcnkubGVuZ3RoICsgMTtcblx0XHRjb25zdCB3aWR0aCA9IHN1YmplY3QubGVuZ3RoICsgMTtcblxuXHRcdGNvbnN0IGZpcnN0Um93ID0gW107XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB3aWR0aDsgaSsrKSB7XG5cdFx0XHRmaXJzdFJvdy5wdXNoKGkgKiBlZGl0Q29zdHMucHJlUXVlcnlJbnNlcnRpb24pO1xuXHRcdH1cblxuXHRcdGNvbnN0IGluaXRpYWxFZGl0TWF0cml4ID0gW2ZpcnN0Um93XTtcblx0XHRmb3IgKGxldCBpID0gMTsgaSA8IGhlaWdodDsgaSsrKSB7XG5cdFx0XHRjb25zdCByb3cgPSBuZXcgQXJyYXkod2lkdGgpO1xuXHRcdFx0cm93WzBdID0gaSAqIGVkaXRDb3N0cy5kZWxldGlvbjtcblx0XHRcdGluaXRpYWxFZGl0TWF0cml4LnB1c2gocm93KTtcblx0XHR9XG5cdFx0cmV0dXJuIGluaXRpYWxFZGl0TWF0cml4O1xuXHR9XG5cblx0cHVibGljIGZpbGxFZGl0TWF0cml4KFxuXHRcdG1hdHJpeDogbnVtYmVyW11bXSxcblx0XHRxdWVyeTogc3RyaW5nLFxuXHRcdHN1YmplY3Q6IHN0cmluZyxcblx0XHRlZGl0Q29zdHM6IEVkaXRDb3N0cyxcblx0KTogbnVtYmVyW11bXSB7XG5cdFx0Y29uc3QgaGVpZ2h0ID0gbWF0cml4Lmxlbmd0aDtcblx0XHRjb25zdCB3aWR0aCA9IG1hdHJpeFswXS5sZW5ndGg7XG5cdFx0Zm9yIChsZXQgcm93SW5kZXggPSAxOyByb3dJbmRleCA8IGhlaWdodDsgcm93SW5kZXgrKykge1xuXHRcdFx0Y29uc3QgaW5zZXJ0aW9uQ29zdCA9IHJvd0luZGV4ID09PSAoaGVpZ2h0IC0gMSkgPyBlZGl0Q29zdHMucG9zdFF1ZXJ5SW5zZXJ0aW9uIDogZWRpdENvc3RzLmluc2VydGlvbjtcblx0XHRcdGZvciAobGV0IGNvbHVtbkluZGV4ID0gMTsgY29sdW1uSW5kZXggPCB3aWR0aDsgY29sdW1uSW5kZXgrKykge1xuXHRcdFx0XHRjb25zdCBzdWJzdGl0dXRpb25Db3N0ID0gcXVlcnlbcm93SW5kZXggLSAxXSA9PT0gc3ViamVjdFtjb2x1bW5JbmRleCAtIDFdID8gMCA6IGVkaXRDb3N0cy5zdWJzdGl0dXRpb247XG5cdFx0XHRcdGNvbnN0IGxvd2VzdEFjY3VtdWxhdGVkQ29zdCA9IE1hdGgubWluKFxuXHRcdFx0XHRcdG1hdHJpeFtyb3dJbmRleCAtIDFdW2NvbHVtbkluZGV4XSArIGVkaXRDb3N0cy5kZWxldGlvbixcblx0XHRcdFx0XHRtYXRyaXhbcm93SW5kZXhdW2NvbHVtbkluZGV4IC0gMV0gKyBpbnNlcnRpb25Db3N0LFxuXHRcdFx0XHRcdG1hdHJpeFtyb3dJbmRleCAtIDFdW2NvbHVtbkluZGV4IC0gMV0gKyBzdWJzdGl0dXRpb25Db3N0LFxuXHRcdFx0XHQpO1xuXHRcdFx0XHRtYXRyaXhbcm93SW5kZXhdW2NvbHVtbkluZGV4XSA9IGxvd2VzdEFjY3VtdWxhdGVkQ29zdDtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIG1hdHJpeDtcblx0fVxuXG5cdHB1YmxpYyBkZWJ1Z0Z1enpJdGVtKGZ1enpJdGVtOiBGdXp6SXRlbSk6IHN0cmluZyB7XG5cdFx0Y29uc3QgdGFibGVIZWFkZXI6IHN0cmluZyA9IGZ1enpJdGVtLnN1YmplY3Quc3BsaXQoJycpLm1hcCgoY2hhcmFjdGVyOiBzdHJpbmcpID0+IHBhZFN0cmluZyhjaGFyYWN0ZXIsIDYpKS5qb2luKCcnKTtcblx0XHRjb25zdCB0YWJsZVJvd3M6IHN0cmluZ1tdID0gZnV6ekl0ZW0uZWRpdE1hdHJpeC5tYXAoKHJvdzogbnVtYmVyW10sIHJvd0luZGV4OiBudW1iZXIpID0+IHtcblx0XHRcdGNvbnN0IHJvd1N0cmluZyA9IHJvdy5tYXAoKGNlbGw6IG51bWJlcikgPT4gcGFkU3RyaW5nKGNlbGwsIDYpKS5qb2luKCcnKTtcblx0XHRcdHJldHVybiBgJHtmdXp6SXRlbS5xdWVyeVtyb3dJbmRleCAtIDFdIHx8ICcgJ30gJHtyb3dTdHJpbmd9YDtcblx0XHR9KTtcblx0XHRyZXR1cm4gW1xuXHRcdFx0YFxcbnF1ZXJ5OiAke2Z1enpJdGVtLnF1ZXJ5fSwgc3ViamVjdDogJHtmdXp6SXRlbS5zdWJqZWN0fSwgZWRpdERpc3RhbmNlOiAke2Z1enpJdGVtLmVkaXREaXN0YW5jZX1gLFxuXHRcdFx0YCAgICAgICAgJHt0YWJsZUhlYWRlcn1gLFxuXHRcdFx0Li4udGFibGVSb3dzLFxuXHRcdF0uam9pbignXFxuJylcblx0fVxufVxuXG5cbmZ1bmN0aW9uIHBhZFN0cmluZyhzdWJqZWN0OiBhbnksIHBhZGRpbmc6IG51bWJlcik6IHN0cmluZyB7XG5cdHJldHVybiAoJyAnLnJlcGVhdChwYWRkaW5nKSArIHN1YmplY3QpLnNsaWNlKC1wYWRkaW5nKTtcbn1cbiJdfQ==