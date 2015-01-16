
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
    })
  }
})

app.controller('ForgotPasswordCtrl', function($scope, $http) {

  $scope.hasEmailBeenSent = false;
  $scope.invalidEmail = false;

  $scope.forgotPassword = function(email) {
    $http.post('/forgotPassword', {
      email: email
    }).success(function(forgotEmailObj) {
      if (forgotEmailObj.isValid) {
        $scope.email = "";
        $scope.hasEmailBeenSent = true;
        $scope.invalidEmail = false;
      }
      if (!forgotEmailObj.isValid) {
        $scope.invalidEmail = true;
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

app.controller('StatsCtrl', function($scope, $http) {
  $scope.getStats = function() {
    $http.get("/getAPIStats");
  };
});
