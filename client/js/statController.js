
var app = angular.module('tawnyOwlApp.statController', [
  'ui.router'
]);

app.controller('StatsCtrl', function($scope, $http, $rootScope) {
  $scope.getStats = function() {
    $http.get("/getAPIStats")
      .success(function(data) {
        data.sort(function(a, b) { 
          return Date.parse(a.date) - Date.parse(b.date);
        })

        var dayArr = ['x'];
        var countArr = ['Connections'];
        for (var i = 0; i < data.length; i++) {
          // use below line if we need to limit graph to past X days (eg past month)
          // var rawDay = Math.floor(Date.parse(data[i].date) / 86400000);

          var month = data[i].date.split(" ")[1];
          var day = data[i].date.split(" ")[2];
          // var year = data[i].date.split(" ")[3]
          var day = month + ' ' + day;
          if (dayArr.indexOf(day) === -1 && data[i].apiKey === $rootScope.currentApiKey) {
            dayArr.push(day);
            countArr.push(1);
          }
          else if (data[i].apiKey === $rootScope.currentApiKey){
            countArr[dayArr.indexOf(day)]++;
          }
        }
        if (dayArr.length > 1) {
            var chart = c3.generate({
              data: {
                x : 'x',
                columns: [
                  dayArr,
                  countArr,
                ],
                type: 'bar'
              },
              color: {
                pattern: ['#397AD9']
              },
              axis: {
                x: {
                  type: 'category' // this needed to load string x value
                }
              }
            });
        }
        else {
          $scope.noConnectionsMsg = "There are no connections to display from your API Key."
        }
    });
  };
});