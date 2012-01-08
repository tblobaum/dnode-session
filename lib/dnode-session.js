
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
      , sess
      , cookies

    conn.on('ready', function() {
      var id = conn.stream.socketio.id
        , request = conn.stream.socketio.manager.handshaken[id]

      if (!request.headers.cookie) return

      cookies = connect.utils.parseCookie(request.headers.cookie)
      sid = cookies[key]

      store.load(sid, function(err, sess) {
        if (!err) sess = sess
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

    this.cookie = function(fn) {
      if ('function' !== typeof fn) return
      fn(cookies)
    }
  }
}
