var socket = io.connect('/');
var room = "";
var nickname = "";
var draw = false;
var prevX = 0, prevY = 0;

$(document).ready(function () {
});

function submit() {
  var roomname = $('#roomname').val();
  room = roomname;
  var playername = $('#playername').val();
  nickname = playername;
  socket.emit('join room', { roomname: roomname, playername: playername });
}

function erase() {
  socket.emit('clear', { roomname: room });
}

socket.on('clear', function (data) {
  var c = document.getElementById('canvas');
  var ctx = c.getContext("2d");
  ctx.clearRect(0,0,c.width, c.height);
});

socket.on('room', function (data) {
  var c = document.getElementById('canvas');
  var ctx = c.getContext("2d");
  function start(event) {
    var X = event.clientX - c.offsetLeft, Y = event.clientY - c.offsetTop;
    socket.emit('draw', { eventName: "start", roomname: room, X: X, Y: Y});
    event.preventDefault();
  }
  function move(event) {
    if (draw) {
      var X = event.clientX - c.offsetLeft , Y = event.clientY - c.offsetTop;
      console.log(X, Y);
      socket.emit('draw', { eventName: "move", roomname: room, X:X, Y:Y});
      event.preventDefault();
    }
  }
  function end(event) {
    if (draw) {
      draw = false;
      socket.emit('draw', { eventName: "end", roomname: room});
    }
  }
  function startTouch(event) {
    var X = event.changedTouches[0].clientX - c.offsetLeft, Y = event.changedTouches[0].clientY - c.offsetTop;
    socket.emit('draw', { eventName: "start", roomname: room, X: X, Y: Y});
    event.preventDefault();
  }
  function moveTouch(event) {
    if (draw) {
      var X = event.changedTouches[0].clientX - c.offsetLeft, Y = event.changedTouches[0].clientY - c.offsetTop;
      socket.emit('draw', { eventName: "move", roomname: room, X:X, Y:Y});
      event.preventDefault();
    }
  }
  c.addEventListener('touchstart', startTouch, { passive: false });
  c.addEventListener('touchmove', moveTouch, { passive: false });
  c.addEventListener('touchend', end, { passive: false });
  c.addEventListener('mousedown', start, { passive: false });
  c.addEventListener('mousemove', move, { passive: false });
  c.addEventListener('mouseup', end, { passive: false });
  c.addEventListener('mouseout', end, { passive: false });
  c.addEventListener('start', function(event) {
    draw = true;
    prevX = event.X; prevY = event.Y;
    event.preventDefault();
  }, { passive: false });
  c.addEventListener('move', function(event) {
    if (draw) {
      var X = event.X, Y = event.Y;
      ctx.beginPath(); ctx.moveTo(prevX, prevY); ctx.strokeStyle = "black";  ctx.lineWidth = 2; ctx.lineTo(X, Y); ctx.stroke(); ctx.closePath();
      prevX = X; prevY = Y;
      event.preventDefault();
    }
  }, { passive: false });
  c.addEventListener('end', function(event) {
    draw = false;
  }, { passive: false });
});

socket.on('draw', function (data) {
  var event = {};
  if (data.eventName == "start") {
    event = new Event('start');
    event.X = data.X; event.Y = data.Y;
  } else if (data.eventName == "move") {
    event = new Event('move');
    event.X = data.X; event.Y = data.Y;
  } else {
    event = new Event('end');
  }
  var c = document.getElementById("canvas");
  c.dispatchEvent(event);
});

socket.on('disconnected', function (data) {
  alert(data.player + " disconnected from the room.");
});
