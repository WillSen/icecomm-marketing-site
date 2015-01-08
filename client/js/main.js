
// Foundation JavaScript
// Documentation can be found at: http://foundation.zurb.com/docs
$(document).foundation();

var app = angular.module('tawnyOwlApp', [
  'ui.router',
  'tawnyOwlApp.authControllers',
  'mm.foundation'
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
    .state('getting-started', {
      url: '/getting-started',
      templateUrl: 'client/partials/getting-started.html'
      // controller: ''
    })
});

app.controller('TopBarDemoCtrl', function ($scope) {

});

app.controller('AnimationCtrl', function($scope) {
  $scope.doCtrlStuff = function(){
      $scope.isActive = true;
  } 
})
