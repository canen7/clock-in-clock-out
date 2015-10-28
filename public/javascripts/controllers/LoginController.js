app.controller('LoginController', function($scope, $rootScope, $location, LoginFactory, TableFactory) {

  //check if at registration page
  if ($location.$$path !== "/register"){ 
    LoginFactory.check_ip();
  }

  //forms object
  $scope.forms = {
    login : {
    }, 
    registration : {
      isMatch : true
    }
  };
  
  //variables object
  $scope.variables = {
          msg : null
    ,  biz_id : ($rootScope.user && !isNaN($rootScope.user.business) ? $rootScope.user.business : null)
    , pattern : {
                  email : /[-0-9a-zA-Z.+_]+@[-0-9a-zA-Z.+_]+\.[a-zA-Z]{2,4}/
                , letters : /^[a-zA-Z\s]*$/
                , password : /^[a-zA-Z0-9_]{6,72}$/
                , string : /^[a-zA-Z\s'"()\[\]]*$/
                , lettersNumbers : /^[a-zA-Z0-9\s]*$/
              }
  }

  //if on main page and business id is in rootscope
  if ($rootScope.user && !isNaN($rootScope.user.business) ){
    $scope.tables = {};
    TableFactory.general_employee_info(function(data){
      $scope.tables.users = data;
      $scope.tables.users.order = 'name';
    });
  }

  $scope.functions = {
    isMatch : function(){
      
      $scope.forms.registration.isMatch = ($scope.forms.registration.user.password === $scope.forms.registration.user.confirm);
      $scope.forms.regForm.confirm.$setValidity('match', ($scope.forms.registration.isMatch == false ? false : true ));
    
    }, submitForm : function(isValid){
      if (isValid){
        ($location.$$path !== "/register" 
          ? LoginFactory.login($scope.forms.login, function(data){
              $scope.variables.errorMessage = data;
            })
          : LoginFactory.register($scope.forms.registration, function(data){
              $scope.variables.errorMessage = data;
            })
        )
      } 
    }, logout : function(){
      LoginFactory.logout();
    }
  }
});