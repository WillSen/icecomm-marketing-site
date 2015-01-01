// Foundation JavaScript
// Documentation can be found at: http://foundation.zurb.com/docs
$(document).foundation();

var app = angular.module('tawnyOwlApp', [
  // 'ngRoute',
  'ui.router'
  ]);

// REQUIRE UIROUTER
app.config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'partials/home.html'
      // add controller
    })
    .state('signup', {
      url: '/signup',
      templateUrl: 'partials/signup.html'
      // add controller
    })
    .state('login', {
      url: '/login',
      templateUrl: 'partials/login.html'
      // controller: 'UsernameCtrl'
    })

  // $routeProvider
  //   .when("/", {templateUrl: "partials/home.html"})
  //   .when("/signup", {templateUrl: "partials/signup.html"})
  //   .when("/login", {templateUrl: "partials/login.html"})
});
  
app.controller('UsernameCtrl', function($scope, $http) {
  $http.get("/checkUsername").success(function (data) {
    console.log(data);
    $scope.user = data.username;
  });
})