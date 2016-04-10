var express = require('express');
const exec = require('child_process').exec;

app = express();
app.use(express.static('www'));

app.set('port', process.env.PORT || 5000);
app.set('local', "http:localhost:" + app.get('port'));

app.listen(app.get('port'), function () {
	console.log('Express server listening on port '  + app.get('port'));
	
	if(process.env.DEVELOPMENT && process.env.DEVELOPMENT === "true"){
	
		setTimeout(function(){
			console.log("Opening Browser.....")
		}, 3000);	

		exec('start chrome ' + app.get('local'), function(error, stdout, stderr){
			if(error !== null){
				console.log("Error: ("+ error +") while opening Browser");
			}
		});
	}
});

