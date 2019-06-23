"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FuzzDiagnostics = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

;

var FuzzDiagnostics =
/*#__PURE__*/
function () {
  function FuzzDiagnostics() {
    _classCallCheck(this, FuzzDiagnostics);

    _defineProperty(this, "allFuzzItemsByKeyByOriginal", new WeakMap());

    _defineProperty(this, "fuzzalyticsByFuzzItem", new WeakMap());
  }

  _createClass(FuzzDiagnostics, [{
    key: "indexFuzzItems",
    value: function indexFuzzItems(fuzzItems) {
      var _this = this;

      fuzzItems.forEach(function (fuzzItem) {
        var fuzzItemsByKey = _this.allFuzzItemsByKeyByOriginal.get(fuzzItem.original);

        if (!fuzzItemsByKey) {
          fuzzItemsByKey = {};
        }

        fuzzItemsByKey[fuzzItem.key] = fuzzItem;

        _this.allFuzzItemsByKeyByOriginal.set(fuzzItem.original, fuzzItemsByKey);
      });
    }
  }, {
    key: "setFuzzalyticsForFuzzItem",
    value: function setFuzzalyticsForFuzzItem(fuzzItem, fuzzalytics) {
      this.fuzzalyticsByFuzzItem.set(fuzzItem, fuzzalytics);
    }
  }]);

  return FuzzDiagnostics;
}();

exports.FuzzDiagnostics = FuzzDiagnostics;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mdXp6LWRpYWdub3N0aWNzLmNsYXNzLnRzIl0sIm5hbWVzIjpbIkZ1enpEaWFnbm9zdGljcyIsIldlYWtNYXAiLCJmdXp6SXRlbXMiLCJmb3JFYWNoIiwiZnV6ekl0ZW0iLCJmdXp6SXRlbXNCeUtleSIsImFsbEZ1enpJdGVtc0J5S2V5QnlPcmlnaW5hbCIsImdldCIsIm9yaWdpbmFsIiwia2V5Iiwic2V0IiwiZnV6emFseXRpY3MiLCJmdXp6YWx5dGljc0J5RnV6ekl0ZW0iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUlDOztJQVNZQSxlOzs7Ozs7eURBRXVELElBQUlDLE9BQUosRTs7bURBQ0gsSUFBSUEsT0FBSixFOzs7OzttQ0FHekNDLFMsRUFBdUI7QUFBQTs7QUFDM0NBLE1BQUFBLFNBQVMsQ0FBQ0MsT0FBVixDQUFrQixVQUFDQyxRQUFELEVBQXdCO0FBQ3hDLFlBQUlDLGNBQWMsR0FBRyxLQUFJLENBQUNDLDJCQUFMLENBQWlDQyxHQUFqQyxDQUFxQ0gsUUFBUSxDQUFDSSxRQUE5QyxDQUFyQjs7QUFDQSxZQUFJLENBQUNILGNBQUwsRUFBcUI7QUFDbkJBLFVBQUFBLGNBQWMsR0FBRyxFQUFqQjtBQUNEOztBQUNEQSxRQUFBQSxjQUFjLENBQUNELFFBQVEsQ0FBQ0ssR0FBVixDQUFkLEdBQStCTCxRQUEvQjs7QUFDQSxRQUFBLEtBQUksQ0FBQ0UsMkJBQUwsQ0FBaUNJLEdBQWpDLENBQXFDTixRQUFRLENBQUNJLFFBQTlDLEVBQXdESCxjQUF4RDtBQUNELE9BUEQ7QUFRRDs7OzhDQUVnQ0QsUSxFQUFvQk8sVyxFQUEwQjtBQUM5RSxXQUFLQyxxQkFBTCxDQUEyQkYsR0FBM0IsQ0FBK0JOLFFBQS9CLEVBQXlDTyxXQUF6QztBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRnV6ekl0ZW0gfSBmcm9tICcuL21vZGVscy9pbmRleCc7XG5cbmludGVyZmFjZSBGdXp6SXRlbUJ5S2V5IHtcblx0W2tleTogc3RyaW5nXTogRnV6ekl0ZW0sXG59O1xuXG5leHBvcnQgaW50ZXJmYWNlIEZ1enphbHl0aWNzIHtcbiAgZWRpdE1hdHJpeDogbnVtYmVyW11bXSxcbiAgb3BlcmF0aW9uTWF0cml4OiBudW1iZXJbXVtdLFxuICB0cmF2ZXJzZWRDZWxsczogbnVtYmVyW11bXSxcbiAgd29yc3RQb3NzaWJsZUVkaXREaXN0YW5jZTogbnVtYmVyLFxufVxuXG5leHBvcnQgY2xhc3MgRnV6ekRpYWdub3N0aWNzIHtcblxuICBwdWJsaWMgYWxsRnV6ekl0ZW1zQnlLZXlCeU9yaWdpbmFsOiBXZWFrTWFwPGFueSwgRnV6ekl0ZW1CeUtleT4gPSBuZXcgV2Vha01hcDxhbnksIEZ1enpJdGVtQnlLZXk+KCk7XG4gIHB1YmxpYyBmdXp6YWx5dGljc0J5RnV6ekl0ZW06IFdlYWtNYXA8RnV6ekl0ZW0sIEZ1enphbHl0aWNzPiA9IG5ldyBXZWFrTWFwPEZ1enpJdGVtLCBGdXp6YWx5dGljcz4oKTtcblxuXG4gIHB1YmxpYyBpbmRleEZ1enpJdGVtcyhmdXp6SXRlbXM6IEZ1enpJdGVtW10pIHtcbiAgICBmdXp6SXRlbXMuZm9yRWFjaCgoZnV6ekl0ZW06IEZ1enpJdGVtKSA9PiB7XG4gICAgICBsZXQgZnV6ekl0ZW1zQnlLZXkgPSB0aGlzLmFsbEZ1enpJdGVtc0J5S2V5QnlPcmlnaW5hbC5nZXQoZnV6ekl0ZW0ub3JpZ2luYWwpO1xuICAgICAgaWYgKCFmdXp6SXRlbXNCeUtleSkge1xuICAgICAgICBmdXp6SXRlbXNCeUtleSA9IHt9O1xuICAgICAgfVxuICAgICAgZnV6ekl0ZW1zQnlLZXlbZnV6ekl0ZW0ua2V5XSA9IGZ1enpJdGVtO1xuICAgICAgdGhpcy5hbGxGdXp6SXRlbXNCeUtleUJ5T3JpZ2luYWwuc2V0KGZ1enpJdGVtLm9yaWdpbmFsLCBmdXp6SXRlbXNCeUtleSk7XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgc2V0RnV6emFseXRpY3NGb3JGdXp6SXRlbShmdXp6SXRlbTogRnV6ekl0ZW0sIGZ1enphbHl0aWNzOiBGdXp6YWx5dGljcykge1xuXHQgIHRoaXMuZnV6emFseXRpY3NCeUZ1enpJdGVtLnNldChmdXp6SXRlbSwgZnV6emFseXRpY3MpO1xuICB9XG5cblxufSJdfQ==