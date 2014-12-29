// Foundation JavaScript
// Documentation can be found at: http://foundation.zurb.com/docs
$(document).foundation();

var app = angular.module('tawnyOwlApp', [
  'ngRoute' 
  ]);

app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    // Home
    .when("/", {templateUrl: "partials/home.html"})
    // Pages
    // .when("/about", {templateUrl: "partials/about.html", controller: "PageCtrl"})
    .when("/foundation", {templateUrl: "partials/foundation-components.html", controller: "SignupCtrl"})
    
}]);

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