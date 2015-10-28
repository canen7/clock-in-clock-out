app.factory('LoginFactory', function($http, $location, $rootScope){

  return {
    check_ip : function(){

      $http
        .get('http://ipinfo.io/json')
        .success(function(data){
          $http
            .post('/api/check_ip', {ip : data.ip})
            .success(function(data){
              $rootScope.user = { 
                  id    : null
                , business : data.id
                , admin : false
              }
              $location.path('/main')
          })
            .error(function(){
              $location.path('/')
          });
      });

    }, login : function(form, callback){

      $http
        .post('/api/login', form)
        .success(function(data){
          if (data.id){
            $rootScope.user = {
                id    : data.id
              , business : data.business
              , admin : data.admin
            };
          }
          $location.path((data.admin == true ? '/dashboard' : '/user/' + data.id));
        })
        .error(function(data){
          callback(data);
        });

    }, logout : function(){
    
      $http
        .get('/api/logout')
        .success(function(){
          $rootScope.user = undefined;
          $location.path('/'); 
        });
        
    }, register : function(form, callback){

      $http
        .post('/api/register', form)
        .success(function(data){
          console.log(data);
          $rootScope.user = {
              id : data.id
            , business : data.business
            , admin : true
          }
         $location.path('/add_employee');
        })
        .error(function(data){
          callback(data);
        })
    }
  };
});