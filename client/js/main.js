
var app = angular.module('tawnyOwlApp', [
  'ui.router',
  'tawnyOwlApp.authControllers'
  ]);

// switched from ngroute to ui.router
app.config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'client/partials/home.html'
      // controller: ''
    })
    .state('signup', {
      url: '/signup',
      templateUrl: 'client/partials/signup.html',
      controller: 'SignupCtrl'
    })
    .state('login', {
      url: '/login',
      templateUrl: 'client/partials/login.html'
      // controller: ''
    })
});

app.controller('AnimationCtrl', function($scope) {
  $scope.doCtrlStuff = function(){
      $scope.isActive = true;
  } 
})
