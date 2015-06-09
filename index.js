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
    this.token = null;
    this.expires = null; //utc seconds
    this.notes = [];
    this.api = "https://simple-note.appspot.com/api/";
    this.api2 = "https://simple-note.appspot.com/api2/";
  }

  auth() {
    // base64 encoding of auth params
    var query = encode("email=" + this.email + '&password=' + this.password);

    //no token or expired token, get a new one
    if (this.token === null || Date.now() > this.expires) {
      return new Promise(
        (resolve, reject) => {
          request
            .post(this.api + 'login')
            .send(query)
            .end((err, res) => {
              if (res.error) {
                reject(res.error);
              }
              this.token = res.text;
              this.expires = Date.parse(res.headers.expires) + 86400000; // expires 24 hours from now
              resolve(res.text);
            });
        });
    }

    return Promise.resolve(this.token);
  }

  all(len) {
    // 100 is the highest value you can query
    len = (len && len < 100) ? len : 100;

    var auth = this.auth();

    // TODO: loop through if `mark` is set
    // https://github.com/cpbotha/nvpy/blob/master/nvpy/simplenote.py#L211
    return auth.then(token =>
        new Promise(
          (resolve, reject) => {
            request
              .get(self.api2 + 'index')
              .type('json')
              .query({
                auth: token,
                email: this.email,
                length: len
              })
              .end((err, res) => {
                if (res.error) reject(res.error);
                else if (!res.text) reject([]);
                var json = JSON.parse(res.text);
                this.notes = array(json.data).sort('modifydate', 'desc');
                resolve(this.notes);
              });
          })
      )
      .catch(e => console.log(e));
  }

  get(key) {
    if (!key) throw 'error no key';

    var auth = this.auth();

    return auth.then(token =>
        new Promise(
          (resolve, reject) => {
            request
              .get(this.api2 + 'data/' + key)
              .type('json')
              .query({
                auth: token,
                email: this.email
              })
              .end((err, res) => {
                if (res.error) reject(res.error);
                else if (!res.text) reject({});
                resolve(JSON.parse(res.text));
              });
          })
      )
      .catch(e => console.log(e));
  }
}

export default SimpleNote;
