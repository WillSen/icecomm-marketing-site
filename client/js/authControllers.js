var app = angular.module('tawnyOwlApp.authControllers', [
  'ui.router'
]);

app.controller('UsernameCtrl', function($scope, $http) {
  $http.get("/checkUsername").success(function (data) {
    console.log(data);
    $scope.user = data.username;
    $scope.apiKey = data.apiKey;
  });
})

app.controller('SignupCtrl', function($scope, $http) {
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
})


// app.controller('ApiCtrl', function($scope, $http) {
//   $http.get("/findApi").success(function (data) {
//     console.log(data);
//     $scope.user = data.username;
//   });
// })