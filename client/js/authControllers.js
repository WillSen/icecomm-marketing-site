var app = angular.module('tawnyOwlApp.authControllers', [
  'ui.router'
]);

app.controller('UsernameCtrl', function($scope, $http) {
  $http.get("/checkUsername").success(function (data) {
    console.log(data);
    $scope.user = data.username;
  });
})

app.controller('SignupCtrl', function($scope, $http) {
  $scope.getUsername = function() {
    console.log($scope.username);
    $http.get("/checkUserExists", {
        params: {username: $scope.username}
      })
      .success(function(data) {
        console.log('checkuserexists data' , data);
        $scope.errorMsg = data.err;
      })
  }
  
})