var mysql = require('mysql'),
	Client = require('mysql').Client,
	client = mysql.createClient({
    //Set user, and password for database
		user: 'root',
		password: ''
	}),
	exec = require('child_process').exec,
	server = require('http').createServer().listen(8000),
	nowjs = require("now"),
	everyone = nowjs.initialize(server);

//Set to the db wich contains the ci_sessions table
client.useDatabase('database');

everyone.now.distributeMessage = function(message,session_cookie) {
    //Call the script that decrypts the session id
    //NOTE:the path to index.php must be relative to this script
	exec('php index.php user_session decrypt ' + encodeURIComponent(session_cookie), function (error, stdout, stderr) {
		var parts = stdout.split(';');
		var session_id = parts[1].split(':')[2];
		var ip_address = parts[3].split(':')[2];
		var query = 'select user_data from ci_sessions where session_id=' + session_id +
			' and ip_address=' + ip_address;
		client.query(query, function (err, results, fields) {
			if (results) {
                //If anything is returned log the userdata and call the clientside function
				console.log(results[0].user_data);
				everyone.now.receiveMessage(message);
			}
		});
	});
};

//Alternative to getting session id from request headers

/*
var cookies = (function (str) {
    var result = {};
    str.split(/;\s+/).forEach(function (e) {
        var parts = e.split(/=/, 2);
        result[parts[0]] = parts[1] || '';
    });
    return result;
})(request.headers.cookie),
    sessionCookieName = 'ci_session',
    sessionId = cookies[sessionCookieName] || '';
*/
