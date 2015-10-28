app.controller('BusinessController', function($scope, $rootScope, BusinessFactory, EmployeeFactory, LocationFactory, LoginFactory) {

  $scope.forms = {};
  $scope.tables = {};
  $scope.variables = {
      msg  :  null
    , page : 'user'
    , pattern : {
                    email : /[-0-9a-zA-Z.+_]+@[-0-9a-zA-Z.+_]+\.[a-zA-Z]{2,4}/
                  , letter : /^[a-zA-Z\s]*$/
                  , password : /^[a-zA-Z0-9_]{6,72}$/
                  , ipv : /([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4}|(\d{1,3}\.){3}\d{1,3}/
                }
  }

  EmployeeFactory.get_employee($rootScope.user.id, function(data){
    $scope.forms.user = {
      name : data.name,
      email : data.email,
      password : '',
      confirm : '',
      isMatch : true
    }
  });

  BusinessFactory.get_name(function(data){ 
    $scope.forms.companyName = data;
  });

  BusinessFactory.get_ip($rootScope.user.business, function(data){
    $scope.tables.ip_addresses = data;
    for (var i=0; i< $scope.tables.ip_addresses.length; i++){
      $scope.tables.ip_addresses[i].edit = false;
    }
  })

  LocationFactory.all_locations(function(data){
    $scope.tables.locations = data;
    for (var i=0; i< $scope.tables.locations.length; i++){
      $scope.tables.locations[i].edit = false;
    }
  })    

  $scope.functions = {
    setPage : function(page){
      $scope.variables.page = page;
      $scope.variables.msg = null;
    }, isMatch :  function(){
      $scope.forms.user.isMatch = ($scope.forms.user.password === $scope.forms.user.confirm);
      $scope.forms.userForm.confirm.$setValidity('match', ($scope.forms.user.isMatch == false ? false : true ));
    }, logout : function(){
      LoginFactory.logout();
    }, submitForm : function(isValid, form){
      if (isValid){
        switch (form){
          case 'user' : EmployeeFactory.update_admin($scope.forms.user, function(data){ $scope.variables.msg = data; }); break;
          case 'name' : BusinessFactory.update_name($scope.forms.companyName, function(data){ $scope.variables.msg = data.msg; }); break;
          case 'ip' : 
            BusinessFactory.add_ip($scope.forms.addInput, function(data){ 
              $scope.variables.msg = data.msg; 
              $scope.tables.ip_addresses[$scope.tables.ip_addresses.length] = {
                address : $scope.forms.addInput.ip
                , id : data.id
                , edit : false
              }
              $scope.forms.addInput.ip = '';
            }); 
          break;
          case 'location' : 
            LocationFactory.insert_location($scope.forms.addInput, function(data){
              $scope.variables.msg = data.msg
              $scope.tables.locations[$scope.tables.locations.length] = {
                    id : data.id
                , name : $scope.forms.addInput.location
                , edit : false
              }
              $scope.forms.addInput.location = '';
            }); 
          break;
        }
      }
    }, updateRow : function(id, info, index){
      switch($scope.variables.page){
        case 'ip' : 
          BusinessFactory.update_ip(id, info, function(data, success){
            $scope.variables.msg = data;
            (success === true 
              ? $scope.tables.ip_addresses[index].edit = false
              : $scope.tables.ip_addresses.splice(index, 1)
            )
          });
        break;
        case 'location' : 
          LocationFactory.update_location(id, info, function(data, status){
            $scope.variables.msg = data.msg;            
            ( status === 'update'
              ? $scope.tables.locations[index].edit = false
              : ( status === 'delete'
                ? $scope.tables.locations.splice(index, 1)
                : $scope.tables.locations[index].name = data.name
              )
            );
          });
        break;
      }
    }
  }
});