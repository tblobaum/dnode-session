
var connect = require('connect')
  , utils = connect.utils

module.exports = function (options) {
  var options = options || {}
    , key = options.key || 'connect.sid'
    , store = options.store || {}
    , interval = options.interval || 120 * 1000

  return function (client, conn) {
    var self = this

    this.init = function (request) {
      try {
        var cookies = utils.parseCookie(request.headers.cookie)
        
      } catch (e) {
        console.log(e)
        
      } finally {
        if (!cookies) return
        
        conn.sessionId = cookies[key]
        conn.session = {}
        conn.cookies = cookies
        conn.emit('sessionId')
        
      }
      self.sessionCheck()
              
    }

    this.sessionCheck = function () {
      try {
        store.get(conn.sessionId, function(e, session){
          if (e) {
            console.log(e)
            
            conn.end(e.message)
            
          } else {
            conn.session = session
            
            conn.emit('sessionCheck', true)
            
          }
        })
        
      } catch (e) {
        console.log(e)
        
        conn.end(e.message)
        return
        
      }
      
    }
    
    this.cookies = function (callback) { 
      callback(conn.cookies)
      return
    }
    
    this.sessionId = function (callback) { 
      callback(conn.sessionId)
      return
    }
    
    this.session = function (callback) { 
      callback(conn.session)
      return
    }

    conn.on('ready', function(derp) {
      var id = conn.stream.socketio.id
        , conns = conn.stream.socketio.manager.handshaken
        
      self.init(conns[id])
      
      self.check = setInterval(function(){
        self.sessionCheck()
        return
      }, interval)
      
    })
    
    conn.on('end', function (c) {
      clearInterval(self.check)
    })

  }
}

