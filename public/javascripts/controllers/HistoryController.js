app.controller('HistoryController', function($scope, $location, $rootScope, TableFactory, EmployeeFactory, LocationFactory, BusinessFactory, LoginFactory) {

  $scope.lists = {};
  $scope.tables = {};
  $scope.variables = {
       biz_id : $rootScope.user.business
    , csvHead : ['Date', 'Name', 'Title', 'Team', 'Location', 'Clock IN', 'Clock OUT', 'Personal Time', 'Billed Hours', 'Report']
  }

  LocationFactory.used_locations(function(data){ $scope.lists.locations = data; });
  EmployeeFactory.members( function(data){ $scope.lists.members = data; });
  
  TableFactory.date_range({from: 'all', to : ''}, function(data){
    $scope.tables.history = data;
    $scope.tables.history.order = '-created_at';
  });

  $scope.functions = {
    csvBody : function(){

      ary = [];
      var rows = document.getElementsByTagName('tr');
      
      for (var i=1; i < rows.length; i++){
        var obj = new Object();
        for (var j=0; j < rows[i].childElementCount; j++){
          str = rows[i].cells[j].innerHTML
          obj[j] = str.replace(/(<!--|<img)\s[^>]*?>/g, '').trim(); //check for picture
        }
        ary.push(obj);
      }
      console.log(ary);
      return ary;
    }, dateFilter : function(from, to) {
      TableFactory.date_range({from: from, to : to}, function(data){
        $scope.tables.history = data;
      });
    }, logout : function(){
      LoginFactory.logout();
    }
  }
});