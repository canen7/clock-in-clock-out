//sever:localhost
//database: cico
//port: 5432
//username: postgres
//password: password

//for developing
var conString = "postgres://postgres:password@localhost/cico";

//for Heroku
//var conString = "postgres://eshqknkxtopmed:S4Z1PsaKF_O5gGcyvi9z70zTD5@ec2-23-23-183-5.compute-1.amazonaws.com:5432/d4th0jqd2a0s30";

module.exports = conString;
