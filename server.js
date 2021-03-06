var fs = require("fs")
var http = require('http');
var path = require('path');

var async = require('async');
var socketio = require('socket.io');
var express = require('express');

var dl  = require('delivery');

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
    
    
    
    //heh welcome to nested call HELL
    
    socket.on('code submit', function(code) {
        console.log("got code");
        //do something with the code
        console.log("Going to create directory "+ __dirname + "/tmp/" + socket.id);
        
        fs.mkdir(__dirname + '/tmp/' + socket.id ,function(err){
           if (err) {
               console.log(err);
           }
           console.log("Directory created successfully!");
           
           console.log("Going to create and write file for client: " + socket.id );
            //now write the data to the file
            fs.writeFile(__dirname + '/tmp/' + socket.id + '/' + 'main.java', code,  function(err) {
               if (err) {
                   console.log(err);
               }
               console.log("Data written successfully!");
              //ok now lets turn that file into a .jar
              //TODO: add jar creation code here
              
              //for now lets just send a file back to our user
              
              //res.sendfile(__dirname + "/tmp/" + socket.id + '/' + "main.java" );
              
              

                
          
              
              
              // delivery.send({
              //   name: 'banana.java',
              //   path : __dirname + "/tmp/" + socket.id + '/' + "main.java"
              // });
              
           });
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
