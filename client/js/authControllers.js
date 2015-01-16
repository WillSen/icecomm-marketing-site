
var app = angular.module('tawnyOwlApp.authControllers', [
  'ui.router'
]);

app.controller('UsernameCtrl', function($scope, $rootScope) {
  $scope.currentUser = $rootScope.currentUser;
})

app.controller('SignupCtrl', function($scope, $http, $rootScope, $state) {
  $scope.checkUnique = function() {
    console.log('the blur has activated');
    $http.get("/checkUserExists", {
        params: {username: $scope.username}
      })
      .success(function(data) {
        console.log('checkuserexists data' , data.alreadyExisting);
        if (data.alreadyExisting === true) {
          console.log('this user is already in the system');
          $scope.alreadyExistErrorMsg = "Not a unique user name!";
        }
        else {
          console.log('this user is not yet in the db');
          $scope.alreadyExistErrorMsg = "";
        }
      })
  }
  $scope.signUp = function(username, password, email) {
    console.log('username', username);
    console.log('password', password);
    console.log('email', email);
    if (!username || !password || !email) {
      //send error message
      console.log('valid username and password and email required');
      $scope.errMsg = true;
    }
    else {
      console.log('signup checker reached on frontend');
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
          $state.go('home');
        }
      })
    }
  }
})

app.controller('LoginCtrl', function($scope, $http, $state, $rootScope) {
  $scope.login = function(username, password) {
    if (!username || !password) {
      //send error message
      console.log('both username and password required');
    }
    console.log('loginChecker reached on frontend')
    $http.post("/loginChecker", {
      username: $scope.username,
      password: $scope.password
    }).success(function(data) {
      console.log('data from backend', data);
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
      console.log('data', forgotEmailObj);
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