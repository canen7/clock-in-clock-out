var pg = require('pg');
var conString = require('./db_config.js');
module.exports = {

  get_table_dashboard : function(req, res) {

    var biz_id = req.session.user.business;

    var qry = 
        "SELECT members.id"
      +   ", members.picture"
      +   ", members.name"
      +   ", members.status"
      +   ", members.title"
      +   ", members.team"
      +   ", members2.name AS supervisor"
      +   ", locations2.name AS locations"
      +   ", members.note"
      + " FROM members"
      + " LEFT JOIN locations AS locations2 ON locations2.id = members.location_id"
      + " LEFT JOIN members AS members2 ON members2.id = members.supervisor_id"
      + " WHERE members.business_id = $1"
      + " AND members.type = 'employee'";
    
    var client = new pg.Client(conString);

    client.connect(function(err) {
      if(err) { return console.error('could not connect dude, check stuff!', err); }
      client.query(qry, [biz_id], function(err, data) {
        if(err) { return console.error('error running admin_dash', err); }
        res.json(data.rows);
        client.end();
      });
    });

  }, get_table_date_range : function(req, res){

    var biz_id = req.session.user.business;
    var from = req.body.from;
    var to = req.body.to;

    var qry = 
        "SELECT sessions.created_at"
        + ", members.id"
        + ", members.picture"
        + ", members.name"
        + ", members.title"
        + ", members.team"
        + ", locations.name AS location"
        + ", sessions.clock_in"
        + ", sessions.clock_out"
        + ", sessions.personal_time"
        + ", sessions.report"
        + ", ((Extract(EPOCH FROM(clock_out - clock_in - personal_time * interval '1 hour'))/ 60)::int * interval '1 minute')::text as billed"
      + " FROM sessions"
      + " LEFT JOIN members ON sessions.member_id = members.id"
      + " LEFT JOIN locations ON locations.id = sessions.location_id"
      + " WHERE members.business_id = $1";

      if ( from == 'this_week' || from == 'this_month' || from == 'last_week' || from == 'last_month') {
        var from_sunday = new Date().getDay();
        var day_in_month = new Date().getDate();
        var year = new Date().getFullYear();
        var month = new Date().getMonth()+1;
     
        switch (from){
          case 'this_week'  :
            qry += " AND sessions.clock_in >= CURRENT_DATE - interval '" + from_sunday + " day'";
            break;
          case 'this_month' : 
            qry += " AND sessions.clock_in >= CURRENT_DATE - interval '" + day_in_month + " day'";
            break;
          case 'last_week'  : 
            qry += " AND sessions.clock_in <= CURRENT_DATE - interval '" + from_sunday + " day'";
            qry += " AND sessions.clock_in > CURRENT_DATE - interval '" + (from_sunday+7) + " day'";
            break;
          case 'last_month' : 
            qry += " AND sessions.clock_in <= CURRENT_DATE - interval '" + day_in_month + " day'";
            qry += " AND sessions.clock_in > '"+year+"-"+month+"-01'"
            break;
        }
      } else if( from !== 'all' ) {
        qry += " AND sessions.clock_in >= '" + from + "' AND sessions.clock_in <= '" + to + "'";
      }

    var client = new pg.Client(conString);
    
    client.connect(function(err) {
      if(err) { return console.error('could not connect dude, check stuff!', err); }
      client.query(qry, [biz_id], function(err, data) {
        if(err) { return console.error('error running history_table', err); }
        res.json(data.rows);
        client.end();
      });
    });

  }, get_table_main_users : function(req, res){

    var biz_id = req.session.user.business;
    var qry = "SELECT members.id"
              + ", members.picture"
              + ", members.name"
              + ", members.team"
              + ", locations2.name AS locations"
              + ", members.is_logged"
            + " FROM members"
            + " LEFT JOIN locations AS locations2 ON locations2.id = members.location_id"
            + " WHERE members.business_id = $1"
            + " AND members.type = 'employee'"
            + " AND members.status = 'active'";

    pg.connect(conString, function(err, client, done) {
      if(err) { return console.error('error fetching client from pool', err); }
      client.query(qry, [biz_id], function(err, result) {
        done();
        if(err) { return console.error('error running query', err); }
        res.json(result.rows);
      });
    });
  }, get_table_user_history : function(req, res){

    var id = req.params.id;
    var from = req.body.from;
    var to = req.body.to;

    var qry = 
      "SELECT sessions.created_at"
        + ", locations.name AS location"
        + ", sessions.clock_in"
        + ", sessions.clock_out"
        + ", sessions.personal_time"
        + ", sessions.report"
        + ", ((Extract(EPOCH FROM(clock_out - clock_in - personal_time * interval '1 hour'))/ 60)::int * interval '1 minute')::text as billed"
      + " FROM sessions"
      + " LEFT JOIN members ON sessions.member_id = members.id"
      + " LEFT JOIN locations ON locations.id = sessions.location_id"
      + " WHERE members.id = $1"

      if ( from == 'this_week' || from == 'this_month' || from == 'last_week' || from == 'last_month') {

        var from_sunday = new Date().getDay();
        var day_in_month = new Date().getDate();
        var year = new Date().getFullYear();
        var month = new Date().getMonth()+1;

        switch (from){
          case 'this_week'  :
            qry += " AND sessions.clock_in >= CURRENT_DATE - interval '" + from_sunday + " day'";
            break;
          case 'this_month' : 
            qry += " AND sessions.clock_in >= CURRENT_DATE - interval '" + day_in_month + " day'";
            break;
          case 'last_week'  : 
            qry += " AND sessions.clock_in <= CURRENT_DATE - interval '" + from_sunday + " day'";
            qry += " AND sessions.clock_in > CURRENT_DATE - interval '" + (from_sunday+7) + " day'";
            break;
          case 'last_month' : 
            qry += " AND sessions.clock_in <= CURRENT_DATE - interval '" + day_in_month + " day'";
            qry += " AND sessions.clock_in > '" + year + "-" + month + "-01'"
            break;
        }
      } else if( from !== 'all' ) {
        qry += " AND sessions.clock_in >= '" + from + "' AND sessions.clock_in <= '" + to + "'";
      }
      qry += " ORDER BY clock_in DESC";

    var client = new pg.Client(conString);
    
    client.connect(function(err) {
      if(err) { return console.error('could not connect dude, check stuff!', err); }
      client.query(qry, [id], function(err, data) {
        if(err) { return console.error('error running history_table', err); }

        res.json(data.rows);
        client.end();
      });
    });
  }
}