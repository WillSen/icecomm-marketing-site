// Foundation JavaScript
// Documentation can be found at: http://foundation.zurb.com/docs
$(document).foundation();

var app = angular.module('tawnyOwlApp', [
  'ngRoute' 
  ]);

// REQUIRE UIROUTER; TODO: SWITCH CODE BELOW LATER

app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    .when("/", {templateUrl: "partials/home.html"})
    .when("/signup", {templateUrl: "partials/signup.html"})
    .when("/login", {templateUrl: "partials/login.html"})
}]);
  
app.controller('UsernameCtrl', function($scope, $http) {
  $http.get("/checkUsername").success(function (data) {
    console.log(data);
    $scope.A = data.username;
  });
})