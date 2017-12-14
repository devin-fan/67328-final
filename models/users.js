MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://admin:admin@ds137246.mlab.com:37246/fpbd';

var db;

// Using hash function provided by https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript-jquery
function hashCode(string) {
  var hash = 0, i, chr;
  if (string.length === 0) return hash;
  for (i = 0; i < string.length; i++) {
    chr   = string.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

MongoClient.connect(url, function (err, mdb) {
  if (err) {
    console.log(err);
  }
  db = mdb.db("fpbd");
});

exports.findByUsername = function (username, callback) {
  var col = db.collection('users');

  col.findOne({username: username}, function (err, user) {
    if (user) {
      callback(err, user);
    } else {
      callback(err, null);
    }
  });
}

exports.findById = function (id, callback) {
  var col = db.collection('users');

  col.findOne({id: id}, function (err, user) {
    if (user) {
      callback(err, user);
    } else {
      callback(err, null);
    }
  });
}

exports.createUser = function (user, callback) {
  var col = db.collection('users');

  col.findOne({username: user.username}, function (err, exist) {
    if (exist) {
      callback(false);
    } else {
      col.insertOne({username: user.username, password: user.password, id: hashCode(user.username)}, function (err, r) {
        callback(true);
      });
    }
  });
}
