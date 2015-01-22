
var app = angular.module('tawnyOwlApp.adminController', [
  'ui.router'
]);

app.controller('AdminCtrl', function($scope, $rootScope, $http) {
  $scope.isAdmin = function() {
    if ($rootScope.currentUser && $rootScope.currentUser.username === "azai91") {
      return true;
    }
    else {
      return false;
    }
  }
  $scope.getAdminStats = function() {
    $scope.getAdminStats = function() {
      console.log('getting admin stats');
      var graphData = {
        userArr: ['x'],
        countArr: ['Connections']
      }
      $http.get("/getAdminStats")
        .success(function(data) {
          console.log(data);
          data.sort(function(a, b) {
            return Date.parse(a.date) - Date.parse(b.date);
          })

          populateData(data, graphData);
          if (graphData.userArr.length > 1) {
            generateGraph(graphData.userArr, graphData.countArr);
          }
          else {
            // $scope.noConnectionsMsg = "There are no connections to display from your API Key."
          }
      });
    };

    function populateData(rawData, graphData) {
      for (var i = 0; i < rawData.length; i++) {
        // use below line if we need to limit graph to past X days (eg past month)
        // var rawDay = Math.floor(Date.parse(rawData[i].date) / 86400000);

        var userApi = rawData[i].apiKey;
        if (graphData.userArr.indexOf(userApi) === -1) {
          graphData.userArr.push(userApi);
          graphData.countArr.push(1);
        }
        else {
          graphData.countArr[graphData.userArr.indexOf(userApi)]++;
        }
      }
    }

    function generateGraph(Xdata, Ydata) {
      var chart2 = c3.generate({
        data: {
          x : 'x',
          columns: [
            Xdata,
            Ydata,
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
      return chart2;
    }
  }
})

// app.controller('StatsCtrl', function($scope, $http, $rootScope) {
//   $scope.getStats = function() {
//     var graphData = {
//       dayArr: ['x'],
//       countArr: ['Connections']
//     }
//     $http.get("/getAPIStats", {
//         userApiKey: $rootScope.currentApiKey
//       })
//       .success(function(data) {
//         data.sort(function(a, b) {
//           return Date.parse(a.date) - Date.parse(b.date);
//         })

//         populateData(data, graphData);
//         if (graphData.dayArr.length > 1) {
//           generateGraph(graphData.dayArr, graphData.countArr);
//         }
//         else {
//           $scope.noConnectionsMsg = "There are no connections to display from your API Key."
//         }
//     });
//   };

//   function populateData(rawData, graphData) {
//     for (var i = 0; i < rawData.length; i++) {
//       // use below line if we need to limit graph to past X days (eg past month)
//       // var rawDay = Math.floor(Date.parse(rawData[i].date) / 86400000);

//       var month = rawData[i].date.split(" ")[1];
//       var day = rawData[i].date.split(" ")[2];
//       // var year = rawData[i].date.split(" ")[3]
//       var day = month + ' ' + day;
//       if (graphData.dayArr.indexOf(day) === -1) {
//         graphData.dayArr.push(day);
//         graphData.countArr.push(1);
//       }
//       else {
//         graphData.countArr[graphData.dayArr.indexOf(day)]++;
//       }
//     }
//   }

//   function generateGraph(Xdata, Ydata) {
//     var chart = c3.generate({
//       data: {
//         x : 'x',
//         columns: [
//           Xdata,
//           Ydata,
//         ],
//         type: 'bar'
//       },
//       color: {
//         pattern: ['#397AD9']
//       },
//       axis: {
//         x: {
//           type: 'category' // this needed to load string x value
//         }
//       }
//     });
//     return chart;
//   }
// });