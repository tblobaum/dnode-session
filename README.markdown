dnode-sessions
==============

    npm install dnode-session

1. Pass the same session into dnodeSession as you did with express

    var dnodeSession = require('dnode-session');

````javascript
    Dnode()
        .use(dnodeSession( {store: new MonSession({interval: 120000 })} )) // <-- use the same as your express app
        .use(dnodeAuth) // <-- see the DnodeAuth example below
        .use(exampleApp) // <-- see the example dnode app below that implements dnode-session
        .listen(app);
````;

2. Run some dnode, and have acess to the same session that your client has access to in express
3. Example - this is how you do it with mongoose-auth

Example
-------
Authentication example using dnode-session with mongoose-auth

````javascript
// first setup the auth code to check dnode-session
var dnodeAuth = function (client, conn) {

    conn.on('sessionCheck', function() {
        if (!conn.session) {
            conn.end();
            return;
        } else if (!conn.session.auth || !conn.session.auth.loggedIn) {
            conn.userId = 'anonymous';
            conn.loggedIn = false;
            conn.emit('authentication', false);
            return;
        } else {
            conn.userId = conn.session.auth.userId;
            conn.loggedIn = conn.session.auth.loggedIn;
            conn.emit('authentication', true);
            return;
        }
    });
    
    this.auth = function (callback) {
        callback(conn.auth);
        return;
    };
    
    this.loggedIn = function (callback) {
        callback(conn.loggedIn);
        return;
    };
    
    this.getUserId = function (callback) {
        callback(conn.userId);
        return;
    };

};

// this is your actual app
var exampleApp = function (client, conn) {

    // authReady will emit when you are authed, and it passes in a boolean
    conn.on('authReady', function(auth) {
        if (!conn.loggedIn) {
            console.log(conn.id + ' is not loggedIn.');
        } else {
            console.log(conn.id + ' is loggedIn.');
        }
    });	

    // this is it!
    // a sample dnode function that checks auth
    // you can use !conn.loggedIn to check auth throughout your dnode app
    // you can also use conn.userId to get the same userId as in mongoose-auth
    this.bing = function (num, callback) {
        if (!conn.loggedIn) {
            callback(num * 2);
        } else {
            callback(num * 10);
        }
    };

};
````;

MIT License

