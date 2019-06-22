"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FuzzDeepKeyFinder = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var FuzzDeepKeyFinder =
/*#__PURE__*/
function () {
  function FuzzDeepKeyFinder() {
    _classCallCheck(this, FuzzDeepKeyFinder);
  }

  _createClass(FuzzDeepKeyFinder, [{
    key: "getAllKeys",
    value: function getAllKeys(allObjects) {
      var _this = this;

      var allKeys = new Set();
      allObjects.forEach(function (targetObject) {
        var objectKeys = _this.getKeysDeep(targetObject);

        objectKeys.forEach(function (objectKey) {
          allKeys.add(objectKey);
        });
      });
      return Array.from(allKeys);
    }
  }, {
    key: "getKeysDeep",
    value: function getKeysDeep(targetObject, currentPath, visitedObjects) {
      var _this2 = this;

      visitedObjects = visitedObjects || new Set();
      var childKeys = this.getKeys(targetObject);
      var searchableKeys = childKeys.filter(function (childKey) {
        return _this2.isSearchableValue(targetObject[childKey]);
      }).map(function (searchableKey) {
        return currentPath === undefined ? searchableKey : "".concat(currentPath, ".").concat(searchableKey);
      });
      childKeys.forEach(function (childKey) {
        var nextObject = targetObject[childKey];
        var nextPath = currentPath === undefined ? childKey : "".concat(currentPath, ".").concat(childKey);

        if (visitedObjects.has(nextObject)) {
          return;
        }

        visitedObjects.add(nextObject);

        var childKeys = _this2.getKeysDeep(nextObject, nextPath, visitedObjects);

        searchableKeys.push.apply(searchableKeys, childKeys);
      });
      return searchableKeys;
    }
  }, {
    key: "isSearchableValue",
    value: function isSearchableValue(value) {
      var valueType = _typeof(value);

      var index = ['string', 'number'].indexOf(valueType);
      return index !== -1;
    }
  }, {
    key: "getKeys",
    value: function getKeys(targetObject) {
      if (targetObject === null || targetObject === undefined) {
        return [];
      }

      if (typeof targetObject === 'string') {
        return [];
      }

      return Object.keys(targetObject);
    }
  }]);

  return FuzzDeepKeyFinder;
}();

exports.FuzzDeepKeyFinder = FuzzDeepKeyFinder;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mdXp6LWRlZXAta2V5LWZpbmRlci5jbGFzcy50cyJdLCJuYW1lcyI6WyJGdXp6RGVlcEtleUZpbmRlciIsImFsbE9iamVjdHMiLCJhbGxLZXlzIiwiU2V0IiwiZm9yRWFjaCIsInRhcmdldE9iamVjdCIsIm9iamVjdEtleXMiLCJnZXRLZXlzRGVlcCIsIm9iamVjdEtleSIsImFkZCIsIkFycmF5IiwiZnJvbSIsImN1cnJlbnRQYXRoIiwidmlzaXRlZE9iamVjdHMiLCJjaGlsZEtleXMiLCJnZXRLZXlzIiwic2VhcmNoYWJsZUtleXMiLCJmaWx0ZXIiLCJjaGlsZEtleSIsImlzU2VhcmNoYWJsZVZhbHVlIiwibWFwIiwic2VhcmNoYWJsZUtleSIsInVuZGVmaW5lZCIsIm5leHRPYmplY3QiLCJuZXh0UGF0aCIsImhhcyIsInB1c2giLCJhcHBseSIsInZhbHVlIiwidmFsdWVUeXBlIiwiaW5kZXgiLCJpbmRleE9mIiwiT2JqZWN0Iiwia2V5cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0lBQ2FBLGlCOzs7Ozs7Ozs7K0JBRU1DLFUsRUFBNkI7QUFBQTs7QUFDOUMsVUFBTUMsT0FBTyxHQUFHLElBQUlDLEdBQUosRUFBaEI7QUFDQUYsTUFBQUEsVUFBVSxDQUFDRyxPQUFYLENBQW1CLFVBQUNDLFlBQUQsRUFBa0I7QUFDcEMsWUFBTUMsVUFBVSxHQUFHLEtBQUksQ0FBQ0MsV0FBTCxDQUFpQkYsWUFBakIsQ0FBbkI7O0FBQ0FDLFFBQUFBLFVBQVUsQ0FBQ0YsT0FBWCxDQUFtQixVQUFDSSxTQUFELEVBQWU7QUFDakNOLFVBQUFBLE9BQU8sQ0FBQ08sR0FBUixDQUFZRCxTQUFaO0FBQ0EsU0FGRDtBQUdBLE9BTEQ7QUFNQSxhQUFPRSxLQUFLLENBQUNDLElBQU4sQ0FBV1QsT0FBWCxDQUFQO0FBQ0E7OztnQ0FFa0JHLFksRUFBbUJPLFcsRUFBc0JDLGMsRUFBcUM7QUFBQTs7QUFDL0ZBLE1BQUFBLGNBQWMsR0FBR0EsY0FBYyxJQUFJLElBQUlWLEdBQUosRUFBbkM7QUFFQSxVQUFNVyxTQUFTLEdBQUcsS0FBS0MsT0FBTCxDQUFhVixZQUFiLENBQWxCO0FBRUEsVUFBTVcsY0FBYyxHQUFHRixTQUFTLENBQzdCRyxNQURvQixDQUNiLFVBQUNDLFFBQUQ7QUFBQSxlQUFjLE1BQUksQ0FBQ0MsaUJBQUwsQ0FBdUJkLFlBQVksQ0FBQ2EsUUFBRCxDQUFuQyxDQUFkO0FBQUEsT0FEYSxFQUVwQkUsR0FGb0IsQ0FFaEIsVUFBQ0MsYUFBRCxFQUFtQjtBQUN0QixlQUFRVCxXQUFXLEtBQUtVLFNBQWpCLEdBQ0hELGFBREcsYUFFQVQsV0FGQSxjQUVlUyxhQUZmLENBQVA7QUFHRCxPQU5vQixDQUF2QjtBQVFBUCxNQUFBQSxTQUFTLENBQUNWLE9BQVYsQ0FBa0IsVUFBQ2MsUUFBRCxFQUFjO0FBQzlCLFlBQU1LLFVBQVUsR0FBR2xCLFlBQVksQ0FBQ2EsUUFBRCxDQUEvQjtBQUNBLFlBQU1NLFFBQVEsR0FBSVosV0FBVyxLQUFLVSxTQUFqQixHQUNiSixRQURhLGFBRVZOLFdBRlUsY0FFS00sUUFGTCxDQUFqQjs7QUFJQSxZQUFJTCxjQUFjLENBQUNZLEdBQWYsQ0FBbUJGLFVBQW5CLENBQUosRUFBb0M7QUFDbEM7QUFDRDs7QUFDRFYsUUFBQUEsY0FBYyxDQUFDSixHQUFmLENBQW1CYyxVQUFuQjs7QUFFQSxZQUFNVCxTQUFTLEdBQUcsTUFBSSxDQUFDUCxXQUFMLENBQWlCZ0IsVUFBakIsRUFBNkJDLFFBQTdCLEVBQXVDWCxjQUF2QyxDQUFsQjs7QUFDQUcsUUFBQUEsY0FBYyxDQUFDVSxJQUFmLENBQW9CQyxLQUFwQixDQUEwQlgsY0FBMUIsRUFBMENGLFNBQTFDO0FBQ0QsT0FiRDtBQWVBLGFBQU9FLGNBQVA7QUFDRDs7O3NDQUV3QlksSyxFQUFxQjtBQUN6QyxVQUFNQyxTQUFTLFdBQVVELEtBQVYsQ0FBZjs7QUFDQSxVQUFNRSxLQUFLLEdBQUcsQ0FBQyxRQUFELEVBQVcsUUFBWCxFQUFxQkMsT0FBckIsQ0FBNkJGLFNBQTdCLENBQWQ7QUFDSCxhQUFPQyxLQUFLLEtBQUssQ0FBQyxDQUFsQjtBQUNEOzs7NEJBRWN6QixZLEVBQW1CO0FBQ2hDLFVBQUlBLFlBQVksS0FBSyxJQUFqQixJQUF5QkEsWUFBWSxLQUFLaUIsU0FBOUMsRUFBeUQ7QUFDdkQsZUFBTyxFQUFQO0FBQ0Q7O0FBQ0QsVUFBSSxPQUFPakIsWUFBUCxLQUF3QixRQUE1QixFQUFzQztBQUNwQyxlQUFPLEVBQVA7QUFDRDs7QUFDRCxhQUFPMkIsTUFBTSxDQUFDQyxJQUFQLENBQVk1QixZQUFaLENBQVA7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbIlxuZXhwb3J0IGNsYXNzIEZ1enpEZWVwS2V5RmluZGVyIHtcblxuXHRwdWJsaWMgZ2V0QWxsS2V5cyhhbGxPYmplY3RzOiBhbnlbXSk6IHN0cmluZ1tdIHtcblx0XHRjb25zdCBhbGxLZXlzID0gbmV3IFNldDxzdHJpbmc+KCk7XG5cdFx0YWxsT2JqZWN0cy5mb3JFYWNoKCh0YXJnZXRPYmplY3QpID0+IHtcblx0XHRcdGNvbnN0IG9iamVjdEtleXMgPSB0aGlzLmdldEtleXNEZWVwKHRhcmdldE9iamVjdCk7XG5cdFx0XHRvYmplY3RLZXlzLmZvckVhY2goKG9iamVjdEtleSkgPT4ge1xuXHRcdFx0XHRhbGxLZXlzLmFkZChvYmplY3RLZXkpO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIEFycmF5LmZyb20oYWxsS2V5cyk7XG5cdH1cblxuXHRwdWJsaWMgZ2V0S2V5c0RlZXAodGFyZ2V0T2JqZWN0OiBhbnksIGN1cnJlbnRQYXRoPzogc3RyaW5nLCB2aXNpdGVkT2JqZWN0cz86IFNldDxhbnk+KTogc3RyaW5nW10ge1xuXHQgIHZpc2l0ZWRPYmplY3RzID0gdmlzaXRlZE9iamVjdHMgfHwgbmV3IFNldCgpO1xuXG5cdCAgY29uc3QgY2hpbGRLZXlzID0gdGhpcy5nZXRLZXlzKHRhcmdldE9iamVjdClcblxuXHQgIGNvbnN0IHNlYXJjaGFibGVLZXlzID0gY2hpbGRLZXlzXG5cdCAgICAuZmlsdGVyKChjaGlsZEtleSkgPT4gdGhpcy5pc1NlYXJjaGFibGVWYWx1ZSh0YXJnZXRPYmplY3RbY2hpbGRLZXldKSlcblx0ICAgIC5tYXAoKHNlYXJjaGFibGVLZXkpID0+IHtcblx0ICAgICAgcmV0dXJuIChjdXJyZW50UGF0aCA9PT0gdW5kZWZpbmVkKVxuXHQgICAgICAgID8gc2VhcmNoYWJsZUtleVxuXHQgICAgICAgIDogYCR7Y3VycmVudFBhdGh9LiR7c2VhcmNoYWJsZUtleX1gO1xuXHQgICAgfSk7XG5cblx0ICBjaGlsZEtleXMuZm9yRWFjaCgoY2hpbGRLZXkpID0+IHtcblx0ICAgIGNvbnN0IG5leHRPYmplY3QgPSB0YXJnZXRPYmplY3RbY2hpbGRLZXldO1xuXHQgICAgY29uc3QgbmV4dFBhdGggPSAoY3VycmVudFBhdGggPT09IHVuZGVmaW5lZClcblx0ICAgICAgPyBjaGlsZEtleVxuXHQgICAgICA6IGAke2N1cnJlbnRQYXRofS4ke2NoaWxkS2V5fWA7XG5cblx0ICAgIGlmICh2aXNpdGVkT2JqZWN0cy5oYXMobmV4dE9iamVjdCkpIHtcblx0ICAgICAgcmV0dXJuO1xuXHQgICAgfVxuXHQgICAgdmlzaXRlZE9iamVjdHMuYWRkKG5leHRPYmplY3QpO1xuXG5cdCAgICBjb25zdCBjaGlsZEtleXMgPSB0aGlzLmdldEtleXNEZWVwKG5leHRPYmplY3QsIG5leHRQYXRoLCB2aXNpdGVkT2JqZWN0cyk7XG5cdCAgICBzZWFyY2hhYmxlS2V5cy5wdXNoLmFwcGx5KHNlYXJjaGFibGVLZXlzLCBjaGlsZEtleXMpO1xuXHQgIH0pO1xuXG5cdCAgcmV0dXJuIHNlYXJjaGFibGVLZXlzO1xuXHR9XG5cblx0cHVibGljIGlzU2VhcmNoYWJsZVZhbHVlKHZhbHVlOiBhbnkpOiBib29sZWFuIHtcbiAgICAgIGNvbnN0IHZhbHVlVHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgICAgIGNvbnN0IGluZGV4ID0gWydzdHJpbmcnLCAnbnVtYmVyJ10uaW5kZXhPZih2YWx1ZVR5cGUpO1xuXHQgIHJldHVybiBpbmRleCAhPT0gLTE7XG5cdH1cblxuXHRwdWJsaWMgZ2V0S2V5cyh0YXJnZXRPYmplY3Q6IGFueSkge1xuXHQgIGlmICh0YXJnZXRPYmplY3QgPT09IG51bGwgfHwgdGFyZ2V0T2JqZWN0ID09PSB1bmRlZmluZWQpIHtcblx0ICAgIHJldHVybiBbXTtcblx0ICB9XG5cdCAgaWYgKHR5cGVvZiB0YXJnZXRPYmplY3QgPT09ICdzdHJpbmcnKSB7XG5cdCAgICByZXR1cm4gW107XG5cdCAgfVxuXHQgIHJldHVybiBPYmplY3Qua2V5cyh0YXJnZXRPYmplY3QpO1xuXHR9XG5cbn1cbiJdfQ==