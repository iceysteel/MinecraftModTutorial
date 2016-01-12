var fs = require("fs")
var http = require('http');
var path = require('path');

var async = require('async');
var socketio = require('socket.io');
var express = require('express');

//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);

router.use(express.static(path.resolve(__dirname, 'frontend')));
var messages = [];
var sockets = [];

io.on('connection', function (socket) {
    //user's unique id
    sockets.push(socket);
    
    console.log(socket.id);
    
    
    socket.on('code submit', function(code) {
        console.log("got code");
        //do something with the code
        console.log("Going to create directory "+ __dirname + "/tmp/" + socket.id);
        
        fs.mkdir(__dirname + '/tmp/' + socket.id ,function(err){
           if (err) {
               return console.error(err);
           }
           console.log("Directory created successfully!");
        });
    });
    
    socket.on('disconnect', function () {
      sockets.splice(sockets.indexOf(socket), 1);
    });
    
    //old code, will be discarded
    /*
    messages.forEach(function (data) {
      socket.emit('message', data);
    });

    sockets.push(socket);

    socket.on('disconnect', function () {
      sockets.splice(sockets.indexOf(socket), 1);
      updateRoster();
    });

    socket.on('message', function (msg) {
      var text = String(msg || '');

      if (!text)
        return;

      socket.get('name', function (err, name) {
        var data = {
          name: name,
          text: text
        };

        broadcast('message', data);
        messages.push(data);
      });
    });

    socket.on('identify', function (name) {
      socket.set('name', String(name || 'Anonymous'), function (err) {
        updateRoster();
      });
    });
    */
    
  });




function updateRoster() {
  async.map(
    sockets,
    function (socket, callback) {
      socket.get('name', callback);
    },
    function (err, names) {
      broadcast('roster', names);
    }
  );
}

function broadcast(event, data) {
  sockets.forEach(function (socket) {
    socket.emit(event, data);
  });
}

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});
