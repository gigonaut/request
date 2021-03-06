var http = require('http')
  , events = require('events')
  , stream = require('stream')
  , assert = require('assert')
  ;

exports.createServer =  function (port) {
  port = port || 6767
  var s = http.createServer(function (req, resp) {
    s.emit(req.url, req, resp);
  })
  s.listen(port)
  s.url = 'http://localhost:'+port
  return s;
}

exports.createPostStream = function (text) {
  var postStream = new stream.Stream();
  postStream.writeable = true;
  postStream.readable = true;
  setTimeout(function () {postStream.emit('data', new Buffer(text)); postStream.emit('end')}, 0);
  return postStream;
}
exports.createPostValidator = function (text) {
  var l = function (req, resp) {
    var r = '';
    req.on('data', function (chunk) {r += chunk})
    req.on('end', function () {
    if (r !== text) console.log(r, text);
    assert.ok(r === text)
    resp.writeHead(200, {'content-type':'text/plain'})
    resp.write('OK')
    resp.end()
    })
  }
  return l;
}
exports.createGetResponse = function (text) {
  var l = function (req, resp) {
    resp.writeHead(200, {'content-type':'text/plain'})
    resp.write(text)
    resp.end()
  }
  return l;
}
