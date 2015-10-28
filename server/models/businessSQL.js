var pg = require('pg');
var conString = require('./db_config.js');
var regex = require('../functions/regex_functions.js');
var form_tools = require('../functions/form_functions.js');

module.exports = {

 get_name : function(req, res){
  
    var biz_id = req.session.user.business;
    var qry = 
        "SELECT businesses.name"
      + " FROM businesses"
      + " WHERE businesses.id = $1";

    var client = new pg.Client(conString);
  
    client.connect(function(err) {
      if(err) { return console.error('could not connect to postgres', err); }
      client.query(qry, [biz_id], function(err, data) {
        if(err) { return console.error('error running query', err); }
        res.json(data.rows[0]);
        client.end();
      });
    });

  }, update_name : function(req, res){

    var biz_id = req.session.user.business;
    var name = req.body.name;
    var qry = 
              "UPDATE businesses"
            + " SET name=$1"
            + " , updated_at=NOW()"
            + " WHERE id=$2";

    var client = new pg.Client(conString);

    client.connect(function(err) {
      if(err) { return console.error('could not connect to postgres', err); }
      client.query(qry, [name, biz_id], function(err, data) {
        if(err) { return console.error('error running query', err); }
        res.json({id: data.rows[0], msg: 'Company name updated successfully.'});
        client.end();
      });
    });

  }, add_ip : function(req, res){

    var biz_id = req.session.user.business;
    var ip = req.body.ip;

    var qry = 
      "INSERT INTO ip_addresses ("
      + "  business_id"
      + ", address"
      + ", created_at"
      + " ) VALUES ($1, $2, NOW())"
      + " RETURNING id";

    var client = new pg.Client(conString);
  
    client.connect(function(err) {
      if(err) { return console.error('could not connect to postgres', err); }
      client.query(qry, [biz_id, ip], function(err, data) {
        if(err) { return console.error('error running query', err); }
        res.json({id: data.rows[0].id, msg: 'Address successfully added.'});
        client.end();
      });
    });

  }, get_ip : function(req, res){
    var biz_id = req.session.user.business;

    var qry = 
        "SELECT ip_addresses.address"
      + " , id"
      + " FROM ip_addresses"
      + " WHERE ip_addresses.business_id = $1"
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

  }, delete_ip : function(req, res){
    var id = req.params.id;
    var qry = "DELETE FROM ip_addresses WHERE id=$1";
    var client = new pg.Client(conString);

    client.connect(function(err) {
      if(err) { return console.error('could not connect to postgres', err); }
      client.query(qry, [id], function(err, data) {
        if(err) { return console.error('error running query', err); }
        res.json('Address has been successfully deleted.');
        client.end();
      });
    });

  }, update_ip : function(req, res){

    var id = req.params.id;
    var address = req.body.ip;
    var qry = 
        "UPDATE ip_addresses"
      + " SET address=$1"
      + " , updated_at=NOW()"
      + " WHERE id=$2";

    var client = new pg.Client(conString);
    client.connect(function(err) {
      if(err) { return console.error('could not connect to postgres', err); }
      client.query(qry, [address, id], function(err, data) {
        if(err) { return console.error('error running query', err); }
        res.json('Address has been saved');
        client.end();
      });
    });


  }, register : function(req, res){

    var form = req.body;

    if(  !form.user.name
      || !form.user.email 
      || !form.user.password
      || !form.user.confirm
      || !form.business.name 
      || !form.location.name
    ) {
      res.status(400).json('The form is missing required information.');
    } else {
      
      var business = [ form.business.name ];
      var location = [ form.location.name ];
      var user = [
        form.user.name
        , form.user.email
        , form.user.password
        , form.user.confirm
      ];

      business = form_tools.sanitizeForm(business);
      location = form_tools.sanitizeForm(location);
      user     = form_tools.sanitizeForm(user);

      if (
           !regex.isString(business[0])
        || !regex.isAlphaNumeric(location[0])
        || !regex.isString(user[0])
        || !regex.isEmail(user[1])
        || !regex.isPassword(user[2])
        || !regex.isPassword(user[3])
      ) {
        res.status(400).json('Information is in an incorrect format.');
      } else if (user[2] !== user[3]) {    //password matches confirm
        res.status(400).json('password does not match confirmation.')
      } else {

        var business_id = null;
        var location_id = null;

        //insert business
        var qry1 = 
             "INSERT INTO businesses ( name, created_at )"
          + " VALUES ($1, NOW())"
          + " RETURNING id";

        //insert location
        var qry2 = 
             "INSERT INTO locations ( business_id, name, created_at )"
          + " VALUES ($1, $2, NOW())"
          + " RETURNING id";

        var qry3 =
            "INSERT INTO members ("
          + "  business_id"
          + ", name"
          + ", email"
          + ", password"
          + ", status"
          + ", type"
          + ", is_logged"
          + ", created_at"
          + " ) VALUES ( $1, $2, $3, $4, 'active', 'owner', 'true', NOW())"
          + " RETURNING id";

        var client = new pg.Client(conString);

        client.connect();

        var rollback = function(client) {
          client.query('ROLLBACK', function() {
            client.end();
          });
        };

        client.query('BEGIN', function(err, result) {
          if(err) return rollback(client);

          client.query(qry1, business, function(err, data) {
            if(err) return rollback(client);

            business_id = data.rows[0].id;
            location.unshift(business_id);

            client.query(qry2, location, function(err, data) {
              if(err) return rollback(client);

              location_id = data.rows[0].id
              user.splice(3,1); //get rid of password confirm
              user.unshift(business_id);
    
              client.query(qry3, user, function(err, data) {
                if(err) return rollback(client);

                req.session.user = {

                  business : business_id
                  ,     id : data.rows[0].id
                  ,  admin : true 
                };

                res.json(req.session.user);

                //disconnect after successful commit
                client.query('COMMIT', client.end.bind(client));
              });
            });
          });
        });
      }
    }
  }
};