var spawn = require('child_process').spawn;
var express = require('express');
var bodyParser = require('body-parser');

var port = process.env.PORT || 8080;

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

// Create an express web app
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/api/command', function (req, res) {
  var command = req.param('Body');
  minecraftServerProcess.stdin.write(command+'\n');

  // Buffer output for a bit
  var buffer = [];
  var collector = function(data) {
    data = data.toString();
    buffer.push(data);
  };

  minecraftServerProcess.stdout.on('data', collector);

  setTimeout(function() {
    minecraftServerProcess.stdout.removeListener('data', collector);

    response.send(buffer.join(''));

  }, 250);

});

app.listen(port);
 
// Make sure the Minecraft server dies with this process
process.on('exit', function() {
    minecraftServerProcess.kill();
});

