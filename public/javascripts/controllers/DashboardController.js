app.controller('DashboardController', function($scope, $location, $rootScope, TableFactory, LocationFactory, EmployeeFactory, BusinessFactory, LoginFactory) {

  $scope.lists = {};
  $scope.tables = {};
  $scope.variables = {
    biz_id: $rootScope.user.business
  }
  LocationFactory.used_locations(function(data){ $scope.lists.locations = data; });
  EmployeeFactory.members( function(data){ $scope.lists.members = data; });

  TableFactory.admin_dashboard(function(data){
    $scope.tables.dashboard = data;
    $scope.tables.dashboard.order = 'name';
  });
  $scope.functions = {
    logout : function(){
      LoginFactory.logout();
    }
  }
});