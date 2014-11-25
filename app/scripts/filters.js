'use strict';

/* Filters */

angular.module('myApp.filters', [])

.filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    }
}])
.filter("asDate", function () {
    return function (input) {
        console.log('FILTER:asDate:'+input);
        return new Date(input);
    }
})
.filter('datetmUTC', function($filter)
{
 return function(input)
 {
  if(input == null){ return ""; } 
    console.log('FILTER:datetmUTC:'+input);
    var _date = $filter('date')(new Date(input),'MMM dd yyyy - HH:mm:ss');
    console.log('FILTER:datetmUTC:'+_date);
    var _now = new Date(_date);
    console.log('FILTER:datetmUTC:'+_now);
    console.log('FILTER:datetmUTC:'+_now.getTime());
    return _now.getTime();
 };
});