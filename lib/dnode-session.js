var utils = require('connect').utils;

module.exports = function (options) {
    var options = options || {};
    var key = options.key || 'connect.sid';
    var store = options.store || {};
    var interval = options.interval || 120 * 1000;

    return function (client, conn) {
        var self = this;
        try {
            conn.cookies = utils.parseCookie(conn.stream.socketio.request.headers.cookie);
        } catch (e) {
            console.log(e);
        } finally {
            if (!conn.cookies) return;
            conn.sessionID = conn.cookies[key];
            conn.session = {};
            conn.emit('sessionID');
        }

        this.sessionCheck = function () {
            console.log('sessionCheck');
            try {
                store.get(conn.sessionID, function(err, session){
                    if (err) {
                        console.log(err);
                        conn.end(err.message);
                        return;
                    } else {
                        conn.session = session;
                        conn.emit('sessionCheck', true);
                        return;
                    }
                });
            } catch (e) {
                console.log(e);
                conn.end(err.message);
                return;
            }
        };
        
        this.cookies = function (callback) { 
            callback(conn.cookies);
            return;
        };
        
        this.sessionID = function (callback) { 
            callback(conn.sessionID);
            return;
        };
        
        this.session = function (callback) { 
            callback(conn.session);
            return;
        };
    
        conn.on('ready', function() {
            self.sessionCheck();
            self.check = setInterval(function(){
                self.sessionCheck();
                return;
            }, interval);
        });
        
        conn.on('end', function (c) {
            clearInterval(self.check);
        });

    };
};
