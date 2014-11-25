var spawn = require('child_process').spawn;
var express = require('express');
var bodyParser = require('body-parser');

var port = process.env.PORT || 8080;
var username = process.env.MINECRAFT_ADMIN_USER;
var password = process.env.MINECRAFT_ADMIN_PASSWORD;

// Express 4.0 no longer has this as middleware
var basicAuth = require('basic-auth');

var auth = function (req, res, next) {
  function unauthorized(res) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.send(401);
  };

  var user = basicAuth(req);

  if (!user || !user.name || !user.pass) {
    return unauthorized(res);
  };

  if (user.name === username && user.pass === password) {
    return next();
  } else {
    return unauthorized(res);
  };
};


// Our Minecraft multiplayer server process
var minecraftServerProcess = spawn('java', [
    '-Xmx2048M',
    '-Xms1024M',
    '-jar',
    'minecraft_server.jar',
    'nogui'
]);

// Log server output to stdout
function log(data) {
    process.stdout.write(data.toString());
}
minecraftServerProcess.stdout.on('data', log);
minecraftServerProcess.stderr.on('data', log);

var app = express();

app.use(express.basicAuth(username, password));

app.post('/api/command', auth, function (req, res) {
  var command = req.param('command');
  console.log("Command: '" + command + "'\n");
  minecraftServerProcess.stdin.write(command+'\n');

  // Buffer output for a bit
  var buffer = [];
  var collector = function(data) {
    data = data.toString();
    buffer.push(data);
  };

  minecraftServerProcess.stdout.on('data', collector);

  // Total hack, not sure when Minecraft is done reporting back
  setTimeout(function() {
    minecraftServerProcess.stdout.removeListener('data', collector);

    res.send(buffer.join(''));

  }, 250);

});

app.listen(port);
 
// Make sure the Minecraft server dies with this process
process.on('exit', function() {
    minecraftServerProcess.kill();
});

