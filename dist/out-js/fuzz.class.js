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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mdXp6LmNsYXNzLnRzIl0sIm5hbWVzIjpbIkZ1enoiLCJERUZBVUxUX0VESVRfQ09TVFMiLCJERUZBVUxUX0VESVRfVEhSRVNIT0xEIiwiaXRlbXMiLCJzdWJqZWN0S2V5cyIsInF1ZXJ5IiwiZWRpdERpc3RhbmNlUGVyUXVlcnlMZW5ndGgiLCJmdXp6SXRlbXMiLCJnZXRGdXp6SXRlbXMiLCJzY29yZUZ1enpJdGVtcyIsImZpbHRlcmVkRnV6ekl0ZW1zIiwiZmlsdGVyIiwiZnV6ekl0ZW0iLCJlZGl0RGlzdGFuY2UiLCJsZW5ndGgiLCJzb3J0IiwiYSIsImIiLCJmb3JFYWNoIiwiaXRlbSIsImtleSIsInB1c2giLCJvcmlnaW5hbCIsInN1YmplY3QiLCJlZGl0TWF0cml4IiwiZ2V0SW5pdGlhbEVkaXRNYXRyaXgiLCJlZGl0Q29zdHMiLCJmaWxsRWRpdE1hdHJpeCIsImhlaWdodCIsIndpZHRoIiwiZmlyc3RSb3ciLCJpIiwicHJlUXVlcnlJbnNlcnRpb24iLCJpbml0aWFsRWRpdE1hdHJpeCIsInJvdyIsIkFycmF5IiwiZGVsZXRpb24iLCJtYXRyaXgiLCJyb3dJbmRleCIsImluc2VydGlvbkNvc3QiLCJwb3N0UXVlcnlJbnNlcnRpb24iLCJpbnNlcnRpb24iLCJjb2x1bW5JbmRleCIsInN1YnN0aXR1dGlvbkNvc3QiLCJzdWJzdGl0dXRpb24iLCJsb3dlc3RBY2N1bXVsYXRlZENvc3QiLCJNYXRoIiwibWluIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztJQUVhQSxJOzs7Ozs7eURBV3VCQSxJQUFJLENBQUNDLGtCOzt3REFDSUQsSUFBSSxDQUFDRSxzQjs7Ozs7K0JBR2hEQyxLLEVBQ0FDLFcsRUFDQUMsSyxFQUVDO0FBQUEsVUFEREMsMEJBQ0MsdUVBRG9DLEtBQUtBLDBCQUN6QztBQUNELFVBQU1DLFNBQXFCLEdBQUcsS0FBS0MsWUFBTCxDQUFrQkwsS0FBbEIsRUFBeUJDLFdBQXpCLEVBQXNDQyxLQUF0QyxDQUE5QjtB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QixJQUFvQ2hCLFNBQVMsQ0FBQ1UsUUFEakIsRUFFN0JDLE1BQU0sQ0FBQ0MsUUFBRCxDQUFOLENBQWlCSSxXQUFXLEdBQUcsQ0FBL0IsSUFBb0NILGFBRlAsRUFHN0JGLE1BQU0sQ0FBQ0MsUUFBUSxHQUFHLENBQVosQ0FBTixDQUFxQkksV0FBVyxHQUFHLENBQW5DLElBQXdDQyxnQkFIWCxDQUE5QjtBQUtBTixVQUFBQSxNQUFNLENBQUNDLFFBQUQsQ0FBTixDQUFpQkksV0FBakIsSUFBZ0NHLHFCQUFoQztBQUNBO0FBQ0Q7O0FBQ0QsYUFBT1IsTUFBUDtBQUNBOzs7Ozs7OztnQkF4SFdyQyxJLDRCQUU0QyxFOztnQkFGNUNBLEksd0JBRzJDO0FBQ3RENEMsRUFBQUEsWUFBWSxFQUFFLEdBRHdDO0FBRXREUixFQUFBQSxRQUFRLEVBQUUsR0FGNEM7QUFHdERLLEVBQUFBLFNBQVMsRUFBRSxHQUgyQztBQUl0RFQsRUFBQUEsaUJBQWlCLEVBQUUsRUFKbUM7QUFLdERRLEVBQUFBLGtCQUFrQixFQUFFO0FBTGtDLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFZGl0Q29zdHMsIEZ1enpJdGVtIH0gZnJvbSAnLi9tb2RlbHMnO1xuXG5leHBvcnQgY2xhc3MgRnV6eiB7XG5cblx0cHVibGljIHN0YXRpYyByZWFkb25seSBERUZBVUxUX0VESVRfVEhSRVNIT0xEOiBudW1iZXIgPSA0MDtcblx0cHVibGljIHN0YXRpYyByZWFkb25seSBERUZBVUxUX0VESVRfQ09TVFM6IEVkaXRDb3N0cyA9IHtcblx0XHRzdWJzdGl0dXRpb246IDE0MSxcblx0XHRkZWxldGlvbjogMTAwLFxuXHRcdGluc2VydGlvbjogMTAwLFxuXHRcdHByZVF1ZXJ5SW5zZXJ0aW9uOiAxMCxcblx0XHRwb3N0UXVlcnlJbnNlcnRpb246IDUsXG5cdH1cblxuXHRwdWJsaWMgZWRpdENvc3RzOiBFZGl0Q29zdHMgPSB7IC4uLkZ1enouREVGQVVMVF9FRElUX0NPU1RTIH07XG5cdHB1YmxpYyBlZGl0RGlzdGFuY2VQZXJRdWVyeUxlbmd0aDogbnVtYmVyID0gRnV6ei5ERUZBVUxUX0VESVRfVEhSRVNIT0xEO1xuXG5cdHB1YmxpYyBmaWx0ZXJTb3J0KFxuXHRcdGl0ZW1zOiBhbnlbXSxcblx0XHRzdWJqZWN0S2V5czogc3RyaW5nW10sXG5cdFx0cXVlcnk6IHN0cmluZyxcblx0XHRlZGl0RGlzdGFuY2VQZXJRdWVyeUxlbmd0aDogbnVtYmVyID0gdGhpcy5lZGl0RGlzdGFuY2VQZXJRdWVyeUxlbmd0aCxcblx0KSB7XG5cdFx0Y29uc3QgZnV6ekl0ZW1zOiBGdXp6SXRlbVtdID0gdGhpcy5nZXRGdXp6SXRlbXMoaXRlbXMsIHN1YmplY3RLZXlzLCBxdWVyeSk7XG5cdFx0dGhpcy5zY29yZUZ1enpJdGVtcyhmdXp6SXRlbXMpO1xuXHRcdGNvbnN0IGZpbHRlcmVkRnV6ekl0ZW1zID0gZnV6ekl0ZW1zLmZpbHRlcigoZnV6ekl0ZW06IEZ1enpJdGVtKSA9PiB7XG5cdFx0XHRyZXR1cm4gZnV6ekl0ZW0uZWRpdERpc3RhbmNlIDw9IChlZGl0RGlzdGFuY2VQZXJRdWVyeUxlbmd0aCAqIGZ1enpJdGVtLnF1ZXJ5Lmxlbmd0aCk7XG5cdFx0fSk7XG5cdFx0ZmlsdGVyZWRGdXp6SXRlbXMuc29ydCgoYTogRnV6ekl0ZW0sIGI6IEZ1enpJdGVtKSA9PiBhLmVkaXREaXN0YW5jZSAtIGIuZWRpdERpc3RhbmNlKTtcblx0XHRyZXR1cm4gZmlsdGVyZWRGdXp6SXRlbXM7XG5cdH1cblxuXHRwdWJsaWMgc29ydChcblx0XHRpdGVtczogYW55W10sXG5cdFx0c3ViamVjdEtleXM6IHN0cmluZ1tdLFxuXHRcdHF1ZXJ5OiBzdHJpbmcsXG5cdCk6IEZ1enpJdGVtW10ge1xuXHRcdGNvbnN0IGZ1enpJdGVtczogRnV6ekl0ZW1bXSA9IHRoaXMuZ2V0RnV6ekl0ZW1zKGl0ZW1zLCBzdWJqZWN0S2V5cywgcXVlcnkpO1xuXHRcdHRoaXMuc2NvcmVGdXp6SXRlbXMoZnV6ekl0ZW1zKTtcblx0XHRmdXp6SXRlbXMuc29ydCgoYTogRnV6ekl0ZW0sIGI6IEZ1enpJdGVtKSA9PiBhLmVkaXREaXN0YW5jZSAtIGIuZWRpdERpc3RhbmNlKTtcblx0XHRyZXR1cm4gZnV6ekl0ZW1zO1xuXHR9XG5cblx0cHVibGljIGdldEZ1enpJdGVtcyhcblx0XHRpdGVtczogYW55W10sXG5cdFx0c3ViamVjdEtleXM6IHN0cmluZ1tdLFxuXHRcdHF1ZXJ5OiBzdHJpbmdcblx0KTogRnV6ekl0ZW1bXSB7XG5cdFx0Y29uc3QgZnV6ekl0ZW1zOiBGdXp6SXRlbVtdID0gW107XG5cdFx0aXRlbXMuZm9yRWFjaCgoaXRlbTogYW55KSA9PiB7XG5cdFx0XHRzdWJqZWN0S2V5cy5mb3JFYWNoKChrZXk6IHN0cmluZykgPT4ge1xuXHRcdFx0XHRmdXp6SXRlbXMucHVzaCh7XG5cdFx0XHRcdFx0b3JpZ2luYWw6IGl0ZW0sXG5cdFx0XHRcdFx0a2V5OiBrZXksXG5cdFx0XHRcdFx0c3ViamVjdDogaXRlbVtrZXldLFxuXHRcdFx0XHRcdHF1ZXJ5OiBxdWVyeSxcblx0XHRcdFx0fSBhcyBGdXp6SXRlbSk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0XHRyZXR1cm4gZnV6ekl0ZW1zO1xuXHR9XG5cblx0cHVibGljIHNjb3JlRnV6ekl0ZW1zKGZ1enpJdGVtczogRnV6ekl0ZW1bXSkge1xuXHRcdGZ1enpJdGVtcy5mb3JFYWNoKChmdXp6SXRlbTogRnV6ekl0ZW0pID0+IHtcblx0XHRcdGNvbnN0IGVkaXRNYXRyaXggPSB0aGlzLmdldEluaXRpYWxFZGl0TWF0cml4KFxuXHRcdFx0XHRmdXp6SXRlbS5xdWVyeSxcblx0XHRcdFx0ZnV6ekl0ZW0uc3ViamVjdCxcblx0XHRcdFx0dGhpcy5lZGl0Q29zdHMsXG5cdFx0XHQpO1xuXHRcdFx0dGhpcy5maWxsRWRpdE1hdHJpeChcblx0XHRcdFx0ZWRpdE1hdHJpeCxcblx0XHRcdFx0ZnV6ekl0ZW0ucXVlcnksXG5cdFx0XHRcdGZ1enpJdGVtLnN1YmplY3QsXG5cdFx0XHRcdHRoaXMuZWRpdENvc3RzLFxuXHRcdFx0KTtcblx0XHRcdGZ1enpJdGVtLmVkaXRNYXRyaXggPSBlZGl0TWF0cml4O1xuXHRcdFx0ZnV6ekl0ZW0uZWRpdERpc3RhbmNlID0gZWRpdE1hdHJpeFtlZGl0TWF0cml4Lmxlbmd0aCAtIDFdW2VkaXRNYXRyaXhbMF0ubGVuZ3RoIC0gMV07XG5cdFx0fSk7XG5cdH1cblxuXHRwdWJsaWMgZ2V0SW5pdGlhbEVkaXRNYXRyaXgoXG5cdFx0cXVlcnk6IHN0cmluZyxcblx0XHRzdWJqZWN0OiBzdHJpbmcsXG5cdFx0ZWRpdENvc3RzOiBFZGl0Q29zdHMsXG5cdCk6IG51bWJlcltdW10ge1xuXHRcdGNvbnN0IGhlaWdodCA9IHF1ZXJ5Lmxlbmd0aCArIDE7XG5cdFx0Y29uc3Qgd2lkdGggPSBzdWJqZWN0Lmxlbmd0aCArIDE7XG5cblx0XHRjb25zdCBmaXJzdFJvdyA9IFtdO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgd2lkdGg7IGkrKykge1xuXHRcdFx0Zmlyc3RSb3cucHVzaChpICogZWRpdENvc3RzLnByZVF1ZXJ5SW5zZXJ0aW9uKTtcblx0XHR9XG5cblx0XHRjb25zdCBpbml0aWFsRWRpdE1hdHJpeCA9IFtmaXJzdFJvd107XG5cdFx0Zm9yIChsZXQgaSA9IDE7IGkgPCBoZWlnaHQ7IGkrKykge1xuXHRcdFx0Y29uc3Qgcm93ID0gbmV3IEFycmF5KHdpZHRoKTtcblx0XHRcdHJvd1swXSA9IGkgKiBlZGl0Q29zdHMuZGVsZXRpb247XG5cdFx0XHRpbml0aWFsRWRpdE1hdHJpeC5wdXNoKHJvdyk7XG5cdFx0fVxuXHRcdHJldHVybiBpbml0aWFsRWRpdE1hdHJpeDtcblx0fVxuXG5cdHB1YmxpYyBmaWxsRWRpdE1hdHJpeChcblx0XHRtYXRyaXg6IG51bWJlcltdW10sXG5cdFx0cXVlcnk6IHN0cmluZyxcblx0XHRzdWJqZWN0OiBzdHJpbmcsXG5cdFx0ZWRpdENvc3RzOiBFZGl0Q29zdHMsXG5cdCk6IG51bWJlcltdW10ge1xuXHRcdGNvbnN0IGhlaWdodCA9IG1hdHJpeC5sZW5ndGg7XG5cdFx0Y29uc3Qgd2lkdGggPSBtYXRyaXhbMF0ubGVuZ3RoO1xuXHRcdGZvciAobGV0IHJvd0luZGV4ID0gMTsgcm93SW5kZXggPCBoZWlnaHQ7IHJvd0luZGV4KyspIHtcblx0XHRcdGNvbnN0IGluc2VydGlvbkNvc3QgPSByb3dJbmRleCA9PT0gKGhlaWdodCAtIDEpID8gZWRpdENvc3RzLnBvc3RRdWVyeUluc2VydGlvbiA6IGVkaXRDb3N0cy5pbnNlcnRpb247XG5cdFx0XHRmb3IgKGxldCBjb2x1bW5JbmRleCA9IDE7IGNvbHVtbkluZGV4IDwgd2lkdGg7IGNvbHVtbkluZGV4KyspIHtcblx0XHRcdFx0Y29uc3Qgc3Vic3RpdHV0aW9uQ29zdCA9IHF1ZXJ5W3Jvd0luZGV4IC0gMV0gPT09IHN1YmplY3RbY29sdW1uSW5kZXggLSAxXSA/IDAgOiBlZGl0Q29zdHMuc3Vic3RpdHV0aW9uO1xuXHRcdFx0XHRjb25zdCBsb3dlc3RBY2N1bXVsYXRlZENvc3QgPSBNYXRoLm1pbihcblx0XHRcdFx0XHRtYXRyaXhbcm93SW5kZXggLSAxXVtjb2x1bW5JbmRleF0gKyBlZGl0Q29zdHMuZGVsZXRpb24sXG5cdFx0XHRcdFx0bWF0cml4W3Jvd0luZGV4XVtjb2x1bW5JbmRleCAtIDFdICsgaW5zZXJ0aW9uQ29zdCxcblx0XHRcdFx0XHRtYXRyaXhbcm93SW5kZXggLSAxXVtjb2x1bW5JbmRleCAtIDFdICsgc3Vic3RpdHV0aW9uQ29zdCxcblx0XHRcdFx0KTtcblx0XHRcdFx0bWF0cml4W3Jvd0luZGV4XVtjb2x1bW5JbmRleF0gPSBsb3dlc3RBY2N1bXVsYXRlZENvc3Q7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBtYXRyaXg7XG5cdH1cbn1cbiJdfQ==