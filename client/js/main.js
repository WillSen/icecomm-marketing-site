
// Foundation JavaScript
// Documentation can be found at: http://foundation.zurb.com/docs
$(document).foundation();

var app = angular.module('tawnyOwlApp', [
  'ui.router',
  'tawnyOwlApp.authControllers',
  'mm.foundation'
  ]);

// switched from ngroute to ui.router
app.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

  var checkLoggedIn = function($q, $timeout, $http, $location, $rootScope){
    // Initialize a new promise
    var deferred = $q.defer();
    console.log('called');
    // Make an AJAX call to check if the user is logged in
    $http.get('/loggedin').success(function(user) {
      // Authenticated
      //
      console.log('called http', user);
      if (user !== '0') {
        $rootScope.currentUser = user;
        $timeout(deferred.resolve, 0);
      } else {
        $rootScope.currentUser = undefined;
        console.log('not logged in');
        $timeout(deferred.resolve, 0);
      }
    }).error(function(err) {
        console.log(err);
    });

    return deferred.promise;
  };





  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'client/partials/home.html',
      resolve: {
        loggedin: checkLoggedIn
      }
      // controller: 'HomeCtrl'
    })
    .state('signup', {
      url: '/signup',
      templateUrl: 'client/partials/signup.html',
      controller: 'SignupCtrl'
    })
    .state('login', {
      url: '/login',
      templateUrl: 'client/partials/login.html',
      controller: 'LoginCtrl',
      resolve: {
        loggedin: checkLoggedIn
      }
    })
    .state('getting-started', {
      url: '/getting-started',
      templateUrl: 'client/partials/getting-started.html',
      resolve: {
        loggedin: checkLoggedIn
      }
      // controller: ''
    })
    .state('docs', {
      url: '/docs',
      templateUrl: 'client/partials/docs.html',
      resolve: {
        loggedin: checkLoggedIn
      }
      // controller: ''
    })
    .state('demos', {
      url: '/demos',
      templateUrl: 'client/partials/demos.html',
      resolve: {
        loggedin: checkLoggedIn
      }
      // controller
    })
    .state('account', {
      url: '/account',
      resolve: {
        loggedin: checkLoggedIn
      },
      templateUrl: 'client/partials/account.html'
      // controller
    })


    $locationProvider.html5Mode(true);
});

app.controller('TopBarDemoCtrl', function ($scope, $rootScope, $location, TopBarDemoFactory) {
  $scope.logout = function() {
    TopBarDemoFactory.logout()
      .then(function(data) {
        $location.path('/');
      });
  }

  $scope.isLoggedIn = function() {
   return $scope.loggedIn = $rootScope.currentUser !== undefined;
  }

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

