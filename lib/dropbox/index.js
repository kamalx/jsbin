'use strict';
var passport = require('passport');
var DropboxOAuth2Strategy = require('passport-dropbox-oauth2').Strategy;
var active = false;
var zmq = require('zmq');
var socket = zmq.socket('push');

module.exports = function (options) {
  return {
    initialize: function () {
      socket.bindSync(options.dropbox.port);
      passport.use(new DropboxOAuth2Strategy({
        clientID: options.dropbox.id,
        clientSecret: options.dropbox.secret,
        callbackURL: options.dropbox.callback
      }, function (accessToken, refreshToken, profile, done) {
        profile.accessToken = accessToken;
        done(null, profile);
      }
    ));
    }
  };
};

module.exports.saveBin = function (file, fileName, user) {
  socket.send(JSON.stringify({
    type:'dropbox',
    file: file,
    fileName: fileName,
    token: user.dropbox_token
  }));
};
