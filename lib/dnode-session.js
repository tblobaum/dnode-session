
// DNode Session
// =============

var connect = require('connect')

module.exports = function(opt) {
  var key = opt.key || 'connect.sid'
    , store = opt.store
    , keepAlive = opt.keepAlive || true
    , interval = opt.interval || 120000

  return function(client, conn) {
    var self = this
      , iid
      , sid
      , cookies

    conn.on('ready', function() {

      if (!conn.stream.socketio) return

      var id = conn.stream.socketio.id
        , request = conn.stream.socketio.manager.handshaken[id]
        , sess

      if (!request.headers.cookie) return

      cookies = connect.utils.parseCookie(request.headers.cookie)
      sid = cookies[key]
      conn.emit('session')

      store.load(sid, function(err, obj) {
        if (!err) sess = obj
      })

      keepAlive && (iid = setInterval(function() {
        if (!sess) return
        sess.reload(function() {
          sess.touch().save()
        }, interval)
      }))
    })
    
    conn.on('end', function() {
      iid && clearInterval(iid)
    })

    this.session = function(fn) {
      if ('function' !== typeof fn) return
      store.load(sid, fn)
    }

    this.cookies = function(fn) {
      if ('function' !== typeof fn) return
      fn(cookies)
    }
  }
}
