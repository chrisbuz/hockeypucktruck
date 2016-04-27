var express = require('express');
var bodyParser = require("body-parser");
var pg = require('pg');

app = express();

const exec = require('child_process').exec;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//PostGres Configs
pg.defaults.ssl = true;


app.use(express.static('www'));

//Set Local variables
app.set('port', process.env.PORT || 5000);
app.set('local', "http://localhost:" + app.get('port'));

var connectionString = process.env.DATABASE_URL;

//API Calls
app.get('/allusers', function(req, res){

	var results = [];

    // Grab data from http request
    var table_name = 'users';

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500);
        }

        // SQL Query > Select Data
        var query = client.query("select * from " + table_name);

       	query.on('row', function(data){
   			results.push(data);
       	});

        // After all data is dropped, close connection and return results
        query.on('end', function() {
            done();
            return res.json(results);
        });


    });
});

app.post('/adduser', function(req, res){
    // Grab data from http request
    var table_name = 'users';

    var fullname = req.body.name;
    var fullmail = req.body.email;

    var data = {name:fullname, email:fullmail};

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500);
        }

        // SQL Query > Select Data
        var query = client.query("INSERT INTO " + table_name + "(name, email) values($1, $2)", [data.name, data.email]);

        // After all data is dropped, close connection and return results
        query.on('end', function() {
            done();
            return res.json({message: 'Added ' + data.name + ' to table!'});
        });


    });
});

app.put('/updateuser/:id', function(req, res){
    // Grab data from http request
    var table_name = 'users';

    var _id =req.params.id;
    var _name=req.body.name;
    var _email = req.body.email;

    var data = {id: _id, name:_name, email:_email};

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500);
        }

        // SQL Query > Select Data
        var query = client.query("UPDATE " + table_name + " SET name=($2), email=($3)  WHERE id=($1)", [data.id, date.name, date.email]);

        // After all data is dropped, close connection and return results
        query.on('end', function() {
            done();
            return res.json({message: 'Updated user: ' + data.name + ' in table!'});
        });

    });
});

app.delete('/deleteuser/:id', function(req, res){
    // Grab data from http request
    var table_name = 'users';

    var idd =req.params.id;

    var data = {id: idd};

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500);
        }

        // SQL Query > Select Data
        var query = client.query("DELETE FROM " + table_name + " WHERE id=($1)", [data.id]);

        // After all data is dropped, close connection and return results
        query.on('end', function() {
            done();
            return res.json({message: 'Deleted ' + data.id + ' from table!', an:req.body});
        });

    });
});

//Start Server on specified Port

app.listen(app.get('port'), function () {
	console.log('Express server listening on port '  + app.get('port') + '\n');
	
	if(process.env.DEVELOPMENT && process.env.DEVELOPMENT === "true"){
	
		console.log("Opening Browser...")

		setTimeout(function(){
			exec('start ' + app.get('local'), function(error, stdout, stderr){
				if(error !== null){
					console.log("Error: ("+ error +") while opening Browser");
				}
			});
		}, 2000);		
	}
});

