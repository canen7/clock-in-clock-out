var app = angular.module('myApp', ['ngRoute', 'routeStyles', 'ngSanitize', 'ngCsv', 'anguFixedHeaderTable', 'ngMessages']);

app.config(function($routeProvider){

  $routeProvider
  //index page for non logged in users
  .when('/', {

    templateUrl: 'partials/index.html',
    controller:  'LoginController',
    css: 'stylesheets/login.css',
    data: {
      business : false
      ,  login : false
      ,  admin : false
    }

  //index page for businesses who have a matching ip
  }).when('/register', {

    templateUrl: 'partials/register.html',
    controller:  'LoginController',
    css: 'stylesheets/login.css',
    data: {
      business : false
      ,  login : false
      ,  admin : false
    }

  }).when('/main', {

    templateUrl: 'partials/main.html',
    controller: 'LoginController',
    data: {
      business : true
      ,  login : false
      ,  admin : false
    }

  //user main page
  }).when('/user/:id', {

    templateUrl: 'partials/user.html',
    controller: 'UserController',
    data: {
      business : true
      ,  login : true
      ,  admin : false
    }

  //admin dashboard
  }).when('/dashboard', {

    templateUrl: 'partials/dashboard.html',
    controller: 'DashboardController',
    data: {
      business : true
      ,  login : true
      ,  admin : true
    }

  //admin history
  }).when('/history', {

    templateUrl: 'partials/history.html',
    controller: 'HistoryController',
    data: {
      business : true
      ,  login : true
      ,  admin : true
    }

  //add employee page  
  }).when('/add_employee', {

    templateUrl: 'partials/add-edit.html',
    controller:  'EmployeeController',
    data: {
      business : true
      ,  login : true
      ,  admin : true
    }

  //admin settings
  }).when('/settings', {

    templateUrl: 'partials/settings.html',
    controller:  'BusinessController',
    data: {
      business : true
      ,  login : true
      ,  admin : true
    }

  //admin edit user page
  }).when('/edit/:id', {

    templateUrl: 'partials/add-edit.html',
    controller: 'EmployeeController',
     data: {
      business : true
      ,  login : true
      ,  admin : true
    }

  //route to root index
  }).otherwise({
    redirectTo: '/',
  });

})
.run(function ($rootScope, $location) {

  $rootScope.$on('$routeChangeStart', function (event, next, current) {

    if (next.$$route.data){
      var req_biz   = next.$$route.data.business;
      var req_login = next.$$route.data.login;
      var req_admin = next.$$route.data.admin;
      var verifciation = (req_biz || req_login || req_admin ? true : false );

      if ( verifciation && $rootScope.user === undefined ) {
        $location.path('/');
      } else {
        //check business is a num
        if (req_biz && isNaN($rootScope.user.business) ) {
          $location.path('/');
        }
        //check id is a num
        if (req_login && isNaN($rootScope.user.id) ) {
          $location.path('/main');
        }
        //check admin is true or false
        if (req_admin && !Boolean($rootScope.user.admin) && $rootScope.user.admin === false ){
          $location.path('/main');
        }
      }
    }
  });
});