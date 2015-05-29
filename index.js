/* jshint esnext: true */

/**
 * Module Dependencies
 */

import request from "superagent";
import encode from 'base64-encode';
import array from 'array';

class SimpleNote {
  constructor(email, password) {
    this.email = email;
    this.password = password;
    this.notes = [];
    this.api = "https://simple-note.appspot.com/api/";
    this.api2 = "https://simple-note.appspot.com/api2/";
  }

  auth(fn) {
    // base64 encoding of auth params
    var query = encode("email=" + this.email + '&password=' + this.password);

    request
      .post(this.api + 'login')
      .send(query)
      .end(function(err, res) {
        if(res.error) return fn(res.error);
        return fn(null, res.text);
      });
  }

  all(len, fn) {
    if(arguments.length == 1) fn = len;

    // 100 is the highest value you can query
    len = (len && len < 100) ? len : 100;

    var self = this;

    // TODO: loop through if `mark` is set
    // https://github.com/cpbotha/nvpy/blob/master/nvpy/simplenote.py#L211
    this.auth(function(err, token) {
      if(err) return fn(err);

      request
        .get(self.api2 + 'index')
        .type('json')
        .query({ auth : token, email : self.email, length : len })
        .end(function(err, res) {
          if(res.error) return fn(res.error);
          else if(!res.text) return fn(null, []);
          var json = JSON.parse(res.text);
          self.notes = array(json.data).sort('modifydate', 'desc');
          return fn(null, self.notes);
        });
    });
  }

  get(key, fn) {
    if(!key) return this.all(fn);
    var self = this;

    this.auth(function(err, token) {
      if(err) return fn(err);

      request
        .get(self.api2 + 'data/' + key)
        .type('json')
        .query({ auth : token, email : self.email })
        .end(function(err, res) {
          if(res.error) return fn(res.error);
          else if(!res.text) return fn(null, {})
          return fn(null, JSON.parse(res.text));
        });
    })
  }
}

export default SimpleNote;