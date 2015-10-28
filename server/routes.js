var main        = require('../server/controllers/main.js');
var tableSQL    = require('../server/models/tableSQL.js');
var loggingSQL  = require('../server/models/loggingSQL.js');
var businessSQL = require('../server/models/businessSQL.js');
var employeeSQL = require('../server/models/employeeSQL.js');
var locationSQL = require('../server/models/locationSQL.js');

module.exports = function Routes(app) { 
  app.get('/', function (req, res){ main.index(req,res); });

  //Lists
  app.get('/api/list_members',        function (req, res){ employeeSQL.get_list_members(req, res);        });
  app.get('/api/list_supervisors',    function (req, res){ employeeSQL.get_list_supervisors(req, res);    });

  //Locations
  app.get('/api/list_all_locations',  function (req, res){ locationSQL.get_list_locations(req, res);      });
  app.get('/api/list_used_locations', function (req, res){ locationSQL.get_list_locations_used(req, res); });
  app.post('/api/location',           function (req, res){ locationSQL.insert_location(req, res);         });
  app.put('/api/location/:id',        function (req, res){ locationSQL.update_location(req, res);         });
  app.delete('/api/location/:id',     function (req, res){ locationSQL.delete_location(req, res);         });

  //Dashboard
  app.get('/api/table_admin_dash',    function (req, res){ tableSQL.get_table_dashboard(req, res);    });

  //History
  app.post('/api/table_user/:id',     function (req, res){ tableSQL.get_table_user_history(req, res); });
  app.post('/api/date_range',         function (req, res){ tableSQL.get_table_date_range(req, res);   });

  //business/ip login
  app.get('/api/main',                function (req, res){ tableSQL.get_table_main_users(req, res);   });
  app.post('/api/register',           function (req, res){ businessSQL.register(req, res)             });

  //Business Name CRUD
  app.get('/api/business_name',       function (req, res){ businessSQL.get_name(req, res)      });
  app.put('/api/business_name',       function (req, res){ businessSQL.update_name(req, res);  });

  //Business IP CRUD
  app.post('/api/ip',                 function (req, res){ businessSQL.add_ip(req, res);       });
  app.get('/api/ip/:id',              function (req, res){ businessSQL.get_ip(req, res);       });
  app.put('/api/ip/:id',              function (req, res){ businessSQL.update_ip(req,res);     });
  app.delete('/api/ip/:id',           function (req, res){ businessSQL.delete_ip(req,res);     });

  //Employee CRUD
  app.post('/api/employee',           function (req, res){ employeeSQL.create(req, res);       });
  app.get( '/api/employee/:id',       function (req, res){ employeeSQL.show(req, res);         });
  app.put( '/api/employee/:id',       function (req, res){ employeeSQL.update(req, res);       });
  app.put( '/api/admin',              function (req, res){ employeeSQL.update_admin(req, res); });
  //Employee pic file upload
  app.post('/api/upload_file/:id',    function (req, res){ employeeSQL.upload(req, res);       });

  //Clock in / out
  app.post('/api/clock_in',           function (req, res){ employeeSQL.clock_in(req, res);     });
  app.post('/api/clock_out/:session', function (req, res){ employeeSQL.clock_out(req, res);    });
  app.get( '/api/last_clocking/:id',  function (req, res){ employeeSQL.last_clocking(req, res) });

  //log in
  app.post('/api/login',              function (req, res){ loggingSQL.login(req, res);         });
  app.post('/api/check_ip',           function (req, res){ loggingSQL.check_ip(req, res);      });
  app.get( '/api/get_session',        function (req, res){ loggingSQL.get_session(req, res);   });
  app.get( '/api/logout',             function (req, res){ loggingSQL.logout(req, res);        });
}
