//USED IN CONTROLLER: user_dashboard, clockout
app.factory('ClockingFactory', function($http, $location, $rootScope){
  return {
    
    clock_in: function(location, callback){

      $http
        .post('/api/clock_in', {location : location})
        .success(function(data){
          callback(data);
        });

    }, clock_out: function(info, callback){

      $http
        .post('/api/clock_out/' + info.session, info)
        .success(function(data){
          callback(data);
      });

    }, last_clocking: function(info, callback){

      $http
        .get('/api/last_clocking/' + info)
        .success(function(data){
          callback(data);
        })
    }
  };
});