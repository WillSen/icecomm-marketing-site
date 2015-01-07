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
  $scope.checkUnique = function() {
    console.log('the blur has activated');
    $http.get("/checkUserExists", {
        params: {username: $scope.username}
      })
      .success(function(data) {
        console.log('checkuserexists data' , data);
        if (data) {
          console.log('this user is already in the system');
          $scope.alreadyExistErrorMsg = "Not a unique user name!";
        }
      })
  }
})

// app.directive('alreadyExisting', function (){ 
//   return {
//     require: 'ngModel',
//     link: function(scope, elem, attr, ngModel) {
//       var alreadyExists = false;
//       $http.get("/checkUserExists", {
//           params: {username: $scope.username}
//         })
//         .success(function(data) {
//           console.log('checkuserexists data' , data);
//           alreadyExists = data;
//           $scope.errorMsg = data.err;
//         })
//       ngModel.$parsers.unshift(function (value) {
//         console.log(value);
//         ngModel.$setValidity('unique', !alreadyExists);
//         return value;
//       });
//     }
//   };
// });