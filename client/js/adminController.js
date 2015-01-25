
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
  $scope.getAdminStats = function(cb) {
    console.log('getting admin stats');
    var userData = getUserData();
    var graphData = {
      userArr: ['x'],
      countArr: ['Connections']
    };
    cb(userData, graphData)
  };

  $scope.requestAdminStats = function(userData, graphData) {
    $http.get("/getAdminStats")
      .success(function(data) {
        data.sort(function(a, b) {
          return Date.parse(a.date) - Date.parse(b.date);
        })
        console.log('userData', userData);
        populateData(data, graphData, userData);
        if (graphData.userArr.length > 1) {
          generateGraph(graphData.countArr, graphData.userArr);
        }
        else {
          // $scope.noConnectionsMsg = "There are no connections to display from your API Key."
        }
      });
  }

  function getUserData() {
    $http.get("/getAdminUserData")
      .success(function(data) {
        console.log('adminuserdata', data)
        return data;
      })
  }

  function matchUserApi(api, userData) {
    for (var i = 0; i < userData.length; i++) {
      if (userData[i].apiKey === api) {
        return userData[i].username;
      }
    }
    return undefined;
  }

  function populateData(rawData, graphData, userData) {
    for (var i = 0; i < rawData.length; i++) {

      var user = rawData[i].apiKey;
      // var user = matchUserApi(userApi, userData);
      if (graphData.userArr.indexOf(user) === -1) {
        graphData.userArr.push(user);
        graphData.countArr.push(1);
      }
      else {
        graphData.countArr[graphData.userArr.indexOf(user)]++;
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
        },
        rotated: true
      }
    });
    return chart2;
  }
})