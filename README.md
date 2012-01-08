dnode-session
=============

DNode session handling and integration with Express session storage

Installation
------------

    npm install dnode-session

or from source

    git clone git://github.com/tblobaum/dnode-session.git 
    cd dnode-session
    npm link

Pass the same session store into dnodeSession as you did with express for integration

```javascript
var dnode = require('dnode')
  , dnodeSession = require('dnode-session')
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

Examples
--------

###Basic usage

```javascript
dnodeSession({
  store: sessionStore
})
````

###Full configuration

```javascript
dnodeSession({
  store: sessionStore // session store object
, key: 'connect.sid'  // (optional) session key
, keepAlive: true     // (optional) keep session alive with dnode connection
, interval: 120000    // (optional) keep alive refresh rate
})
````

###Session manipulation

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

###session(callback)

Return the session storage object, which can be modified

```javascript
session(function(err, sess) {
  // ...
})
````

###cookies(callback)

Return the cookies that would be available from `req.cookies` in express

```javascript
cookies(function(cookies) {
  // ...
})
````

License
-------

(The MIT License)

Copyright (c) 2011-2012 Tom Blobaum <tblobaum@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

