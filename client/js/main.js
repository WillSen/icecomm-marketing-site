
// Foundation JavaScript
// Documentation can be found at: http://foundation.zurb.com/docs
$(document).foundation();


var app = angular.module('tawnyOwlApp', [
  'ui.router',
  'tawnyOwlApp.authControllers',
  'mm.foundation',
  'hljs'
  ]);

// switched from ngroute to ui.router
app.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'client/partials/home.html'
      // controller: 'UsernameCtrl'
    })
    .state('signup', {
      url: '/signup',
      templateUrl: 'client/partials/signup.html',
      controller: 'SignupCtrl'
    })
    .state('login', {
      url: '/login',
      templateUrl: 'client/partials/login.html',
      controller: 'LoginCtrl'
    })
    .state('getting-started', {
      url: '/getting-started',
      templateUrl: 'client/partials/getting-started.html'
      // controller: ''
    })
    .state('docs', {
      url: '/docs',
      templateUrl: 'client/partials/docs.html'
      // controller: ''
    })
    .state('demos', {
      url: '/demos',
      templateUrl: 'client/partials/demos.html'
      // controller
    })
    .state('account', {
      url: '/account',
      templateUrl: 'client/partials/account.html'
      // controller
    })


    $locationProvider.html5Mode(true);
});

app.controller('TopBarDemoCtrl', function ($scope, $rootScope, TopBarDemoFactory) {
  $scope.logout = function() {
    TopBarDemoFactory.logout()
      .then(function(data) {
        window.location = '/';
      });
  }

  $scope.isLoggedIn = function() {
   return $scope.loggedIn = $rootScope.currentUser !== undefined;
  }
  console.log($scope.loggedIn);

});

app.controller('AnimationCtrl', function($scope) {
  $scope.doCtrlStuff = function(){
      $scope.isActive = true;
  }
})

app.factory('flash', function($rootScope) {

})

app.factory('TopBarDemoFactory', TopBarDemoFactory);

function TopBarDemoFactory($http) {

  return {
    logout: logout
  }

  function logout() {

    return $http({
      method: 'GET',
      url: '/logout'
    });
  };
}

