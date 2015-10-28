//USER 
app.controller('UserController', function($scope, $rootScope, $location, EmployeeFactory, TableFactory, LoginFactory, ClockingFactory ){

  var userID = $location.path().split('/')[$location.path().split('/').length - 1];

  $scope.tables = {};
  $scope.variables = {
    modalShown : false
    , biz_id  : $rootScope.user.business
    , isAdmin : $rootScope.user.admin
    , csvHead : ['Date', 'Location', 'Clock IN', 'Clock OUT', 'Personal Time', 'Billed Hours', 'Report']
    , table   : 'all'
  }

  TableFactory.user_history_table(userID, {from: 'all', to : ''}, function(data){
    $scope.tables.history = data;
    $scope.tables.history.order = '-created_at';
  });

  EmployeeFactory.get_employee(userID, function(data){
    $scope.tables.user = data; 
    if ( $scope.variables.isAdmin === false && $scope.tables.user.is_logged === true){
      ClockingFactory.last_clocking($scope.user.id, function(data){
        $scope.tables.user.session_id = data.id;
      });
    }
  });


  $scope.functions = {
    dateFilter : function(from, to) {
      TableFactory.user_history_table(userID, {from: from, to : to}, function(data){
        $scope.variables.table = from;
        $scope.tables.history = data;
      });
    }, csvBody : function(){
      ary = [];
      var rows = document.getElementsByClassName('data');
      
      for (var i=1; i < rows.length; i++){
        var obj = new Object();
        for (var j=0; j < rows[i].childElementCount; j++){
          obj[j] = rows[i].cells[j].innerHTML;
        }
        ary.push(obj);
      }
      return ary;
    }, clock_in : function() {
      ClockingFactory.clock_in($scope.tables.user.location_id, function(data){
        $scope.tables.user.session_id = data.id;
        $scope.tables.user.is_logged = true;
        var view = $scope.variables.table;
        if (view === 'all' || view === 'this_week' || view === 'this_month'){
          $scope.tables.history.unshift({
                         id: data.id
            ,      clock_in: Date.now()
            ,      location: data.location
          });
        }
      });
    }, clockOut : function(personal, report) {
      var info = {
          session  : $scope.tables.user.session_id
        , personal : (personal == undefined ? 0 : personal)
        , report   : (report == undefined ? '' : report)
      };
      ClockingFactory.clock_out(info, function(data){
        var view = $scope.variables.table;
        if (view === 'all' || view === 'this_week' || view === 'this_month'){
      
          $scope.tables.history[0].billed        = data.billed;
          $scope.tables.history[0].clock_out     = Date.now();
          $scope.tables.history[0].personal_time = info.personal;
          $scope.tables.history[0].report        = info.report;
        }
        $scope.tables.user.is_logged = false;
        $scope.functions.toggleModal();
      });

    }, toggleModal : function() {
      $scope.variables.modalShown = !$scope.variables.modalShown;
    }, logout : function(){
      LoginFactory.logout();
    }
  }
});