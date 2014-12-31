// Foundation JavaScript
// Documentation can be found at: http://foundation.zurb.com/docs
$(document).foundation();

var app = angular.module('tawnyOwlApp', [
  'ngRoute' 
  ]);

// REQUIRE UIROUTER; TODO: SWITCH CODE BELOW LATER

app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    // Home
    .when("/", {templateUrl: "partials/home.html"})
    .when("/signup", {templateUrl: "partials/signup.html"})
    .when("/login", {templateUrl: "partials/login.html"})
    // Pages
    // .when("/about", {templateUrl: "partials/about.html", controller: "PageCtrl"})
    .when("/foundation", {templateUrl: "partials/foundation-components.html", controller: "SignupCtrl"})
}]);
  
app.controller('UsernameCtrl', function($scope, $http) {
  $http.get("/checkUsername").success(function (data) {
    console.log(data);
    $scope.A = data.username;
  });
})  

app.controller('SignupCtrl', function (/* $scope, $location, $http */) {
  console.log("SignupCtrl Controller reporting for duty.");

  // Activates the Carousel
  // $('.carousel').carousel({
  //   interval: 5000
  // });

  // // Activates Tooltips for Social Links
  // $('.tooltip-social').tooltip({
  //   selector: "a[data-toggle=tooltip]"
  // })
});