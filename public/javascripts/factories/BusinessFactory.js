//USED IN CONTROLLER: business
app.factory('BusinessFactory', function($http, $rootScope){
  return {

    get_name : function(callback) {

      $http
        .get('/api/business_name')
        .success(function(data){
          callback(data);
      });
      
    }, update_name : function(form, callback) {

      $http
        .put('/api/business_name', form)
        .success(function(data){
          callback(data);
      });

    }, add_ip : function(form, callback) {

      $http
        .post('/api/ip', form)
        .success(function(data){
          callback(data);
      });


    }, get_ip : function(id, callback) {

      $http
        .get('/api/ip/' + id)
        .success(function(data){
          callback(data);
      });
    }, update_ip : function(id, ip, callback){
      if (ip == '' ){
        $http
          .delete('/api/ip/'+id)
          .success(function(data){
            callback(data, false);
        })
      } else {
        $http
          .put('/api/ip/' + id, {ip: ip})
          .success(function(data){
            callback(data, true);
        });        
      }
    }
  }
});