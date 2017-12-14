var users = require('../models/users');

Rooms = {};
exports.init = function (app, io) {
  var passport = app.get('passport');

  app.get('/room',
          checkAuthentication,
          doFindRoom);

  app.post('/signup', function (req, res) {
    users.createUser(req.body, function (created) {
      if (created) {
        console.log('created');
        res.redirect('login.html');
      } else {
        console.log('not created');
        res.redirect('signup.html');
      }
    });
  });

  app.post('/login',
          passport.authenticate('local', {
                                failureRedirect: '/login.html',
                                successRedirect: '/room'
          }));
  app.get('/logout', doLogout);

  io.sockets.on('connection', function (socket) {
    socket.on('join room', function (init_data) {
      socket.emit('room', {});
      socket.emit('clear', {});
      var rooms = io.sockets.adapter.sids[socket.id];
      for (var room in rooms) {
        if (Rooms[room]) {
          Rooms[room].players--;
        }
        socket.leave(room);
      }
      if (init_data.roomname in Rooms) {
        Rooms[init_data.roomname].players++;
        for (draw in Rooms[init_data.roomname].drawing) {
          socket.emit('draw', Rooms[init_data.roomname].drawing[draw]);
        }
        socket.emit('players', { players: Rooms[init_data.roomname].players });
      } else {
        Rooms[init_data.roomname] = {
          players: 1,
          drawing: []
        };
      }
      socket.join(init_data.roomname);
      socket.on('disconnect', function () {
        Rooms[init_data.roomname].players--;

      });
    });
    socket.on('draw', function (data) {
      if (data.roomname && Rooms[data.roomname]) {
        Rooms[data.roomname].drawing.push(data);
        io.to(data.roomname).emit('draw', data);
      }
    });
    socket.on('clear', function (data) {
      if (data.roomname && Rooms[data.roomname]) {
        Rooms[data.roomname].drawing = [];
        io.to(data.roomname).emit('clear', {});
      }
    });
  });
}

function checkAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/login.html");
  }
}

function doLogout(req, res) {
  req.logout();
  res.redirect("/login.html");
}

doFindRoom = function (req, res) {
  if (req.user && req.user.username) {
    res.render('room', { user: req.user.username });
  } else {
    console.log('error');
  }
}
