
// Foundation JavaScript
// Documentation can be found at: http://foundation.zurb.com/docs
$(document).foundation();

$(document).ready(function(){

  ZeroClipboard.setMoviePath('http://davidwalsh.name/demo/ZeroClipboard.swf');
  //create client
  var clip = new ZeroClipboard.Client();

  //event
  clip.setText("Testing 1.2.3.4");
  clip.glue('copy-api-key');
  ZeroClipboard.dispatch();

  //ert(JSON.stringify(clip));
});

var app = angular.module('tawnyOwlApp', [
  'ui.router',
  'tawnyOwlApp.statController',
  'tawnyOwlApp.authControllers',
  'tawnyOwlApp.adminController',
  'mm.foundation',
  'hljs',
  'angularytics'
  ]);

// switched from ngroute to ui.router
app.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {



  var checkLoggedIn = function($q, $timeout, $http, $location, $rootScope) {
    // Initialize a new promise
    var deferred = $q.defer();
    // Make an AJAX call to check if the user is logged in
    $http.get('/loggedin').success(function(user) {
      // Authenticated
      if (user !== '0') {
        $rootScope.currentUser = user;
        $timeout(deferred.resolve, 0);
      } else {
        $rootScope.currentUser = undefined;
        $timeout(deferred.resolve, 0);
      }
    }).error(function(err) {
        $location.path('/');
    });

    return deferred.promise;
  };

  var checkLoggedInForAccounts = function($q, $timeout, $http, $location, $rootScope) {
    // Initialize a new promise
    var deferred = $q.defer();
    // Make an AJAX call to check if the user is logged in
    $http.get('/loggedin').success(function(user) {
      // Authenticated
      if (user !== '0') {
        $rootScope.currentUser = user;
        $timeout(deferred.resolve, 0);
      } else {
        $rootScope.currentUser = undefined;
        $location.path('/');
        $timeout(deferred.resolve, 0);
      }
    }).error(function(err) {
        $location.path('/');
    });

    return deferred.promise;
  };


  var checkResetLink = function($q, $timeout, $http, $state, $rootScope, $stateParams, $location) {

    var deferred = $q.defer();

    $http.post('/verifyResetCode', {
      resetId: $stateParams.resetId
    }).success(function(resetObj) {
      // query id is valid
      if (!resetObj.isValid) {
        $location.path('/');
      }
        $timeout(deferred.resolve, 0);

    }).error(function(err) {
      $location.path('/');
      $timeout(deferred.resolve, 0);
    });

    return deferred.promise;
  }



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

      // might neeed to remove
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
      templateUrl: 'client/partials/account.html',
      resolve: {
        loggedin: checkLoggedInForAccounts
      }
      // controller
    })
    .state('how-it-works', {
      url:'/how-it-works',
      templateUrl: 'client/partials/how-it-works.html'
    })
    .state('forgot-password', {
      url: '/forgot-password',
      controller: 'ForgotPasswordCtrl',
      templateUrl: 'client/partials/forgot-password.html'
    })
    .state('reset-password', {
      url: '/reset/:resetId',
      controller: 'ResetPasswordCtrl',
      resolve: {
        checkResetLink: checkResetLink
      },
      templateUrl: 'client/partials/reset-password.html'
    });

    $locationProvider.html5Mode(true);
}).config(['AngularyticsProvider', function(AngularyticsProvider) {
  AngularyticsProvider.setEventHandlers(['GoogleUniversal']);
}]).run(['Angularytics', function(Angularytics) {
  Angularytics.init();
}]);

app.controller('TopBarDemoCtrl', function ($scope, $rootScope, $location, $state, TopBarDemoFactory) {
  $scope.logout = function() {
    TopBarDemoFactory.logout()
      .then(function(data) {
        $state.reload();
        $state.go('home');
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

