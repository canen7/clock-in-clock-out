//USED IN CONTROLLER: user_dashboard, admin_dashboard, employee, employeeInfo, history
app.factory('TableFactory', function($http){
  return {

    admin_dashboard : function(callback){

      $http
        .get('/api/table_admin_dash')
        .success(function(data){
          callback(data);
      });

    }, history_table : function(callback){

      $http
        .get('/api/table_hist')
        .success(function(data){
          callback(data);
      });

    }, user_history_table : function(id, info, callback){

      $http
        .post('/api/table_user/' + id, info)
        .success(function(data){
          callback(data);
      });
        
    }, date_range : function(info, callback){
      $http
        .post('/api/date_range/', info)
        .success(function(data){
          callback(data);
      });

    //info for user/show page
    }, general_employee_info : function(callback){
      $http
        .get('/api/main')
        .success(function(data){
          callback(data);
      });
    }
  };
});