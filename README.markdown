dnode-session
=============

DNode session handling and integration with Express session storage

Installation
------------

    npm install dnode-session

or from source

    git clone git://github.com/tblobaum/dnode-session.git 
    cd request
    npm link

Pass the same session store into dnodeSession as you did with express for integration

```javascript
var dnode = require('dnode')
  , dnodeSession = require('dnode-session')
  , connect = require('connect')
  , express = require('express')
  , redisStore = require('connect-redis')(express)
  , server = express.createServer()
  , sessionStore = new redisStore()

server.use(express.session({ 
  secret: 'agent'
, store: sessionStore
})

dnode()
  .use(dnodeSession({
    store: sessionStore
  }))
  .listen(server)

server.listen()
````

Example
-------

Basic usage

```javascript
dnodeSession({
  store: sessionStore
})
````

Full configuration

```javascript
dnodeSession({
  store: sessionStore // session store object
, key: 'connect.sid'  // (optional) session key
, keepAlive: true     // (optional) keep session alive with dnode connection
, interval: 120000    // (optional) keep alive refresh rate
})
````

Session manipulation

```javascript
dnode.use(function(client, conn) {
  this.session(function(err, sess) {
    sess.foo = 'bar'
    sess.save()
  })
})
````

Methods
-------

Within the client and server, dnode-session supplies the following methods.

session(callback)
-----------------

Return the session storage object, which can be modified


cookies(callback)
-----------------

Return the cookies that would be available from `req.cookies` in express


License
-------

MIT License
