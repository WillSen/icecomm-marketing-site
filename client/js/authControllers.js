
var app = angular.module('tawnyOwlApp.authControllers', [
  'ui.router'
]);

app.controller('UsernameCtrl', function($scope, $rootScope) {
  $scope.currentUser = $rootScope.currentUser;
})

app.controller('SignupCtrl', function($scope, $http, $rootScope, $state) {

  $scope.checkUniqueUserName = function() {
    $http.post("/checkUsernameExists", {
        username: $scope.username
      })
      .success(function(data) {
        if (data.alreadyExisting === true) {
          $scope.usernameAlreadyExistErrorMsg = "Not a unique user name!";
        }
        else {
          $scope.usernameAlreadyExistErrorMsg = "";
        }
      })
  }
  $scope.checkUniqueEmail = function() {
    $http.post("/checkEmailExists", {
        email: $scope.email
      })
      .success(function(data) {
        if (data.alreadyExisting === true) {
          $scope.emailAlreadyExistErrorMsg = "Not a unique email!";
        }
        else {
          $scope.emailAlreadyExistErrorMsg = "";
        }
      })
  }
  $scope.signUp = function(username, password, email) {
    if (!username || !password || !email) {
      //send error message
      $scope.errMsg = true;
    }
    else {
      $http.post("/signupChecker", {
        username: $scope.username,
        password: $scope.password,
        email: $scope.email
      }).success(function(data) {
        if (data === 'false') {
          $scope.errMsg = true;
        }
        else {
          $rootScope.currentUser = data.username;
          $rootScope.currentApiKey = data.apiKey;
          $scope.hasEmailBeenSent = true;
          $scope.username = "";
          $scope.password = "";
          $scope.email = "";
        }
      })
    }
  }
})

app.controller('LoginCtrl', function($scope, $http, $state, $rootScope) {
  $scope.login = function(username, password) {
    if (!username || !password) {
      //send error message
    }
    $http.post("/loginChecker", {
      username: $scope.username,
      password: $scope.password
    }).success(function(data) {
      if (data === 'false') {
        $scope.errMsg = true;
      }
      else {
        $rootScope.currentUser = data.username;
        $rootScope.currentApiKey = data.apiKey;
        $state.go('home');
      }
    }).error(function(err) {
      $scope.errMsg = true;
    })
  }
})

app.controller('ForgotPasswordCtrl', function($scope, $http) {

  $scope.hasEmailBeenSent = false;
  $scope.invalidEmail = false;

  // button can only be clicked once
  $scope.waitingForValidEmail = false;

  $scope.forgotPassword = function(email) {
    $scope.waitingForValidEmail = true;

    $http.post('/forgotPassword', {
      email: email
    }).success(function(forgotEmailObj) {
      if (forgotEmailObj.isValid) {
        $scope.email = "";
        $scope.hasEmailBeenSent = true;
        $scope.invalidEmail = false;
        $scope.waitingForValidEmail = true;
      }
      if (!forgotEmailObj.isValid) {
        $scope.invalidEmail = true;
        $scope.waitingForValidEmail = true;
        $scope.hasEmailBeenSent = false;
      }
    });
  }
});

app.controller('ResetPasswordCtrl', function($scope, $http, $location, $stateParams) {

  $scope.resetPassword = function(reset) {
    if ($scope.password !== $scope.verify_password) {
      $scope.differentPasswordError = true;
    }
    else {
      $http.post('/resetPassword', {
        resetId: $stateParams.resetId,
        password: $scope.password
      }).success(function(data) {

        $location.path('/');
      });
    }
  }
});

app.controller('StatsCtrl', function($scope, $http, $rootScope) {
  $scope.getStats = function() {
    $http.get("/getAPIStats")
      .success(function(data) {
        data.sort(function(a, b) { 
          return Date.parse(a.date) - Date.parse(b.date);
        })
        console.log('sorted', data);
        var dataStr = "";
        var dayArr = ['x'];
        var countArr = ['Connections'];
        for (var i = 0; i < data.length; i++) {
          var rawDay = Math.floor(Date.parse(data[i].date) / 86400000);
          console.log(Math.floor(Date.parse(data[i].date) / 86400000));
          var month = data[i].date.split(" ")[1];
          var day = data[i].date.split(" ")[2];
          var year = data[i].date.split(" ")[3]
          var day = month + ' ' + day + ' ' + year;
          if (dayArr.indexOf(day) === -1 && data[i].apiKey === $rootScope.currentApiKey) {
            dayArr.push(day);
            countArr.push(1);
          }
          else if (data[i].apiKey === $rootScope.currentApiKey){
            countArr[dayArr.indexOf(day)]++;
          }
          
          dataStr += "Raw: " + rawDay + "Date: " + month + ' ' + day + ' ' + year + "\n\n";
        }
        console.log('dayArr', dayArr);
        console.log('countArr', countArr);
        var chart = c3.generate({
          data: {
            x : 'x',
            columns: [
              dayArr,
              countArr,
            ],
            type: 'bar'
          },
          axis: {
            x: {
              type: 'category' // this needed to load string x value
            }
          }
        });
        $scope.userStats = "\n" + dataStr;
      });
  };
});
