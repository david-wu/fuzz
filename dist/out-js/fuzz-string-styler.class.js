"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FuzzStringStyler = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var FuzzStringStyler =
/*#__PURE__*/
function () {
  function FuzzStringStyler() {
    _classCallCheck(this, FuzzStringStyler);
  }

  _createClass(FuzzStringStyler, [{
    key: "styleWithTags",
    value: function styleWithTags(targetString, matchRanges, startDecorator, endDecorator) {
      var stringStyles = matchRanges.map(function (range) {
        return {
          range: range,
          startDecorator: startDecorator,
          endDecorator: endDecorator
        };
      });
      return this.styleString(targetString, stringStyles);
    }
  }, {
    key: "styleString",
    value: function styleString(targetString, stringStyles) {
      var startTagsByCharIndex = {};
      var endTagsByCharIndex = {};
      stringStyles.forEach(function (stringStyle) {
        var startIndex = stringStyle.range[0];
        var endIndex = stringStyle.range[1];
        startTagsByCharIndex[startIndex] = startTagsByCharIndex[startIndex] || [];
        startTagsByCharIndex[startIndex].push(stringStyle.startDecorator);
        endTagsByCharIndex[endIndex] = endTagsByCharIndex[endIndex] || [];
        endTagsByCharIndex[endIndex].push(stringStyle.endDecorator);
      });
      var styledStringArr = [];

      for (var i = 0; i < targetString.length; i++) {
        var _char = targetString[i];
        (startTagsByCharIndex[i] || []).forEach(function (tagToInsert) {
          styledStringArr.push(tagToInsert);
        });
        styledStringArr.push(_char);
        (endTagsByCharIndex[i] || []).forEach(function (tagToInsert) {
          styledStringArr.push(tagToInsert);
        });
      }

      return styledStringArr.join('');
    }
  }]);

  return FuzzStringStyler;
}();

exports.FuzzStringStyler = FuzzStringStyler;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mdXp6LXN0cmluZy1zdHlsZXIuY2xhc3MudHMiXSwibmFtZXMiOlsiRnV6elN0cmluZ1N0eWxlciIsInRhcmdldFN0cmluZyIsIm1hdGNoUmFuZ2VzIiwic3RhcnREZWNvcmF0b3IiLCJlbmREZWNvcmF0b3IiLCJzdHJpbmdTdHlsZXMiLCJtYXAiLCJyYW5nZSIsInN0eWxlU3RyaW5nIiwic3RhcnRUYWdzQnlDaGFySW5kZXgiLCJlbmRUYWdzQnlDaGFySW5kZXgiLCJmb3JFYWNoIiwic3RyaW5nU3R5bGUiLCJzdGFydEluZGV4IiwiZW5kSW5kZXgiLCJwdXNoIiwic3R5bGVkU3RyaW5nQXJyIiwiaSIsImxlbmd0aCIsImNoYXIiLCJ0YWdUb0luc2VydCIsImpvaW4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7SUFDYUEsZ0I7Ozs7Ozs7OztrQ0FHVEMsWSxFQUNBQyxXLEVBQ0FDLGMsRUFDQUMsWSxFQUNBO0FBQ0EsVUFBTUMsWUFBWSxHQUFHSCxXQUFXLENBQUNJLEdBQVosQ0FBZ0IsVUFBQ0MsS0FBRCxFQUFnQjtBQUNuRCxlQUFPO0FBQ0xBLFVBQUFBLEtBQUssRUFBTEEsS0FESztBQUVMSixVQUFBQSxjQUFjLEVBQWRBLGNBRks7QUFHTEMsVUFBQUEsWUFBWSxFQUFaQTtBQUhLLFNBQVA7QUFLRCxPQU5vQixDQUFyQjtBQU9BLGFBQU8sS0FBS0ksV0FBTCxDQUFpQlAsWUFBakIsRUFBK0JJLFlBQS9CLENBQVA7QUFDRDs7O2dDQUVrQkosWSxFQUFzQkksWSxFQUE2QjtBQUNwRSxVQUFNSSxvQkFBeUIsR0FBRyxFQUFsQztBQUNBLFVBQU1DLGtCQUF1QixHQUFHLEVBQWhDO0FBQ0FMLE1BQUFBLFlBQVksQ0FBQ00sT0FBYixDQUFxQixVQUFDQyxXQUFELEVBQWlCO0FBQ3BDLFlBQU1DLFVBQVUsR0FBR0QsV0FBVyxDQUFDTCxLQUFaLENBQWtCLENBQWxCLENBQW5CO0FBQ0EsWUFBTU8sUUFBUSxHQUFHRixXQUFXLENBQUNMLEtBQVosQ0FBa0IsQ0FBbEIsQ0FBakI7QUFDQUUsUUFBQUEsb0JBQW9CLENBQUNJLFVBQUQsQ0FBcEIsR0FBbUNKLG9CQUFvQixDQUFDSSxVQUFELENBQXBCLElBQW9DLEVBQXZFO0FBQ0FKLFFBQUFBLG9CQUFvQixDQUFDSSxVQUFELENBQXBCLENBQWlDRSxJQUFqQyxDQUFzQ0gsV0FBVyxDQUFDVCxjQUFsRDtBQUNBTyxRQUFBQSxrQkFBa0IsQ0FBQ0ksUUFBRCxDQUFsQixHQUErQkosa0JBQWtCLENBQUNJLFFBQUQsQ0FBbEIsSUFBZ0MsRUFBL0Q7QUFDQUosUUFBQUEsa0JBQWtCLENBQUNJLFFBQUQsQ0FBbEIsQ0FBNkJDLElBQTdCLENBQWtDSCxXQUFXLENBQUNSLFlBQTlDO0FBQ0QsT0FQRDtBQVNBLFVBQU1ZLGVBQWUsR0FBRyxFQUF4Qjs7QUFDQSxXQUFLLElBQUlDLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdoQixZQUFZLENBQUNpQixNQUFqQyxFQUF5Q0QsQ0FBQyxFQUExQyxFQUE4QztBQUM1QyxZQUFNRSxLQUFJLEdBQUdsQixZQUFZLENBQUNnQixDQUFELENBQXpCO0FBQ0EsU0FBQ1Isb0JBQW9CLENBQUNRLENBQUQsQ0FBcEIsSUFBMkIsRUFBNUIsRUFBZ0NOLE9BQWhDLENBQXdDLFVBQUNTLFdBQUQsRUFBeUI7QUFDL0RKLFVBQUFBLGVBQWUsQ0FBQ0QsSUFBaEIsQ0FBcUJLLFdBQXJCO0FBQ0QsU0FGRDtBQUdBSixRQUFBQSxlQUFlLENBQUNELElBQWhCLENBQXFCSSxLQUFyQjtBQUNBLFNBQUNULGtCQUFrQixDQUFDTyxDQUFELENBQWxCLElBQXlCLEVBQTFCLEVBQThCTixPQUE5QixDQUFzQyxVQUFDUyxXQUFELEVBQXlCO0FBQzdESixVQUFBQSxlQUFlLENBQUNELElBQWhCLENBQXFCSyxXQUFyQjtBQUNELFNBRkQ7QUFHRDs7QUFDRCxhQUFPSixlQUFlLENBQUNLLElBQWhCLENBQXFCLEVBQXJCLENBQVA7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbIlxuZXhwb3J0IGNsYXNzIEZ1enpTdHJpbmdTdHlsZXIge1xuXG4gIHB1YmxpYyBzdHlsZVdpdGhUYWdzKFxuICAgIHRhcmdldFN0cmluZzogc3RyaW5nLFxuICAgIG1hdGNoUmFuZ2VzOiBhbnlbXSxcbiAgICBzdGFydERlY29yYXRvcjogc3RyaW5nLFxuICAgIGVuZERlY29yYXRvcjogc3RyaW5nLFxuICApIHtcbiAgICBjb25zdCBzdHJpbmdTdHlsZXMgPSBtYXRjaFJhbmdlcy5tYXAoKHJhbmdlOiBhbnkpID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHJhbmdlLFxuICAgICAgICBzdGFydERlY29yYXRvcixcbiAgICAgICAgZW5kRGVjb3JhdG9yLFxuICAgICAgfTtcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcy5zdHlsZVN0cmluZyh0YXJnZXRTdHJpbmcsIHN0cmluZ1N0eWxlcyk7XG4gIH1cblxuICBwdWJsaWMgc3R5bGVTdHJpbmcodGFyZ2V0U3RyaW5nOiBzdHJpbmcsIHN0cmluZ1N0eWxlczogYW55W10pOiBzdHJpbmcge1xuICAgIGNvbnN0IHN0YXJ0VGFnc0J5Q2hhckluZGV4OiBhbnkgPSB7fTtcbiAgICBjb25zdCBlbmRUYWdzQnlDaGFySW5kZXg6IGFueSA9IHt9O1xuICAgIHN0cmluZ1N0eWxlcy5mb3JFYWNoKChzdHJpbmdTdHlsZSkgPT4ge1xuICAgICAgY29uc3Qgc3RhcnRJbmRleCA9IHN0cmluZ1N0eWxlLnJhbmdlWzBdO1xuICAgICAgY29uc3QgZW5kSW5kZXggPSBzdHJpbmdTdHlsZS5yYW5nZVsxXTtcbiAgICAgIHN0YXJ0VGFnc0J5Q2hhckluZGV4W3N0YXJ0SW5kZXhdID0gc3RhcnRUYWdzQnlDaGFySW5kZXhbc3RhcnRJbmRleF0gfHwgW107XG4gICAgICBzdGFydFRhZ3NCeUNoYXJJbmRleFtzdGFydEluZGV4XS5wdXNoKHN0cmluZ1N0eWxlLnN0YXJ0RGVjb3JhdG9yKTtcbiAgICAgIGVuZFRhZ3NCeUNoYXJJbmRleFtlbmRJbmRleF0gPSBlbmRUYWdzQnlDaGFySW5kZXhbZW5kSW5kZXhdIHx8IFtdO1xuICAgICAgZW5kVGFnc0J5Q2hhckluZGV4W2VuZEluZGV4XS5wdXNoKHN0cmluZ1N0eWxlLmVuZERlY29yYXRvcik7XG4gICAgfSk7XG5cbiAgICBjb25zdCBzdHlsZWRTdHJpbmdBcnIgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRhcmdldFN0cmluZy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgY2hhciA9IHRhcmdldFN0cmluZ1tpXTtcbiAgICAgIChzdGFydFRhZ3NCeUNoYXJJbmRleFtpXSB8fCBbXSkuZm9yRWFjaCgodGFnVG9JbnNlcnQ6IHN0cmluZykgPT4ge1xuICAgICAgICBzdHlsZWRTdHJpbmdBcnIucHVzaCh0YWdUb0luc2VydCk7XG4gICAgICB9KTtcbiAgICAgIHN0eWxlZFN0cmluZ0Fyci5wdXNoKGNoYXIpO1xuICAgICAgKGVuZFRhZ3NCeUNoYXJJbmRleFtpXSB8fCBbXSkuZm9yRWFjaCgodGFnVG9JbnNlcnQ6IHN0cmluZykgPT4ge1xuICAgICAgICBzdHlsZWRTdHJpbmdBcnIucHVzaCh0YWdUb0luc2VydCk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHN0eWxlZFN0cmluZ0Fyci5qb2luKCcnKTtcbiAgfVxufVxuIl19