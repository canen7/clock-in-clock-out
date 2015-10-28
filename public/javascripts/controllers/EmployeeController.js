//ADD / UPDATE EMPLOYEE
app.controller('EmployeeController', function($scope, $location, EmployeeFactory, LocationFactory, LoginFactory) {

  $scope.lists = {};
  $scope.forms = {};

  EmployeeFactory.supervisors(function(data){ $scope.lists.supervisors = data; });
  LocationFactory.all_locations(function(data){ $scope.lists.locations = data; });

  $scope.variables = {
      message : null
    ,  update : ($location.path() == '/add_employee' ? false : true )
    , pattern : {
                    email : /[-0-9a-zA-Z.+_]+@[-0-9a-zA-Z.+_]+\.[a-zA-Z]{2,4}/
                  , letter : /^[a-zA-Z\s]*$/
                  , password : /^[a-zA-Z0-9_]{6,72}$/
                  , lettersNumbers : /^[a-zA-Z0-9\s]*$/
                }
  }

  //check if page is to update or create new employee
  if ( $scope.variables.update == false ){
    $scope.forms.employee = { 
      start_date : new Date() 
      ,    match : true
    };
  } else {
    var userID = $location.path().split('/')[$location.path().split('/').length - 1];

    EmployeeFactory.get_employee(userID, function(data){

      $scope.forms.employee = {
          name       : data.name
        , title      : data.title
        , team       : data.team
        , location   : data.location_id
        , supervisor : data.supervisor_id
        , status     : data.status
        , note       : data.note
        , start_date : new Date(data.start_date)
        , email      : data.email
        , admin      : (data.type == 'admin' ? true : false )
        , match      : true
      };
    });
  }

 $scope.functions = {
    isMatch : function(){
      $scope.forms.employee.match = ($scope.forms.employee.password === $scope.forms.employee.confirm);
      $scope.forms.employeeForm.confirm.$setValidity('match', ($scope.forms.employee.match == false ? false : true ));
    }, submitForm : function(isValid){
      if (isValid){ 
        if ($scope.variables.update && $scope.forms.employee.match){
          EmployeeFactory.update_employee(userID, $scope.forms.employee, function(data){
            $scope.variables.message = data;
          });
        } else if (!$scope.update){
          EmployeeFactory.create_employee($scope.forms.employee, function(data){
            $scope.variables.message = data;
          });
        }
      }
    }, logout : function(){
      LoginFactory.logout();
    }
  }
});