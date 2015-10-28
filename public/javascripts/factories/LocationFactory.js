//USED IN CONTROLLER: business
app.factory('LocationFactory', function($http, $rootScope){
  return {
    used_locations : function(callback){

      $http
        .get('/api/list_used_locations')
        .success(function(data){
          callback(data);
      });

    }, all_locations : function(callback){

      $http
        .get('/api/list_all_locations')
        .success(function(data){
          callback(data);
      });

    }, update_location : function(id, location, callback){
      if (location == '' ){
        $http
          .delete('/api/location/' + id)
          .success(function(data){
            callback(data, 'delete');
          })
          .error(function(data){
            callback(data, 'error');
        });
      } else {
        $http
          .put('/api/location/' + id, {location: location})
          .success(function(data){
            callback(data, 'update');
        });
      }

    }, insert_location : function(form, callback){

      $http
        .post('/api/location', form)
        .success(function(data){
          callback(data);
      });
    }
  }
});