var pg = require('pg');
var conString = require('./db_config.js');

module.exports = {

  get_list_locations : function(req, res) {

    var biz_id = req.session.user.business;

    var qry = 
        "SELECT locations.id"
        + ", locations.name"
      + " FROM locations"
      + " LEFT JOIN businesses ON locations.business_id = businesses.id"
      + " WHERE businesses.id = $1"
      + " ORDER BY id";

    var client = new pg.Client(conString);

    client.connect(function(err) {
      if(err) { return console.error('could not connect to postgres', err); }
      client.query(qry, [biz_id], function(err, data) {
        if(err) { return console.error('error running query', err); }
        res.json(data.rows);
        client.end();
      });
    });

  }, get_list_locations_used : function(req, res) {

    var biz_id = req.session.user.business;

    var qry = 
        "SELECT DISTINCT locations.name"
      + " FROM members"
      + " LEFT JOIN locations ON members.location_id = locations.id"
      + " WHERE members.business_id = $1"
      + " AND members.type = 'employee'";

    var client = new pg.Client(conString);

    client.connect(function(err) {
      if(err) { return console.error('could not connect to postgres', err); }
      client.query(qry, [biz_id], function(err, data) {
        if(err) { return console.error('error running query', err); }
        res.json(data.rows);
        client.end();
      });
    });
  }, insert_location : function(req, res){
  	var name = req.body.location;
    var biz_id = req.session.user.business;
    var qry = 
      "INSERT INTO locations ("
      + "  business_id"
      + ", name"
      + ", created_at"
      + " ) VALUES ($1, $2, NOW())"
      + " RETURNING id";

    var client = new pg.Client(conString);
  
    client.connect(function(err) {
      if(err) { return console.error('could not connect to postgres', err); }
      client.query(qry, [biz_id, name], function(err, data) {
        if(err) { return console.error('error running query', err); }
        res.json({id: data.rows[0].id, msg: 'Address successfully added.'});
        client.end();
      });
    });

  }, update_location : function(req, res) {
  	var id = req.params.id;
  	var name = req.body.location;
		var qry = 
              "UPDATE locations"
            + " SET name=$1"
            + " , updated_at=NOW()"
            + " WHERE id=$2";

    var client = new pg.Client(conString);

    client.connect(function(err) {
      if(err) { return console.error('could not connect to postgres', err); }
      client.query(qry, [name, id], function(err, data) {
        if(err) { return console.error('error running query', err); }
        res.json({id: data.rows[0], msg: 'Location updated successfully.'});
        client.end();
      });
    });

  }, delete_location : function(req, res){
  	var id = req.params.id;
  	var qry1 = "SELECT COUNT(members) FROM members WHERE location_id = $1";
  	var qry2 = "DELETE FROM locations WHERE id = $1";
    var qry3 = "SELECT name FROM locations WHERE id = $1";
    var client = new pg.Client(conString);
    client.connect();

    var rollback = function(client) {
      client.query('ROLLBACK', function() {
  			res.status(400).json('Employees are still set at this location.').end();
        client.end();
      });
    };

        client.query('BEGIN', function(err, result) {
          if(err) return rollback(client);
          client.query(qry1, [id], function(err, data) {
            if(err) return rollback(client);
            if (data.rows[0].count != 0) {
              var count = data.rows[0].count;
              client.query(qry3, [id], function(err, data) {
                if(err) return rollback(client);
                res.status(400).json({name: data.rows[0].name, msg: 'Location still has ' + count + ' employees set to it.'}).end();
                client.query('COMMIT', client.end.bind(client));
              });
            } else {
	            client.query(qry2, [id], function(err, data) {
	              if(err) return rollback(client);
	    					res.json({msg: 'Location has successfully been deleted.'}).end();
                client.query('COMMIT', client.end.bind(client));
	            });
            }
          });
        });

  }

}