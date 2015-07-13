/* jshint esnext: true */

/**
 * Module Dependencies
 */

import request from "superagent";
import encode from 'base64-encode';
import array from 'array';

class SimpleNote {
  constructor(email, password, token=null, expires=null) {
    this.email = email;
    this.password = password;
    this.token = token;
    this.expires = expires; //utc seconds
    this.notes = [];
    this.api = "https://simple-note.appspot.com/api/";
    this.api2 = "https://simple-note.appspot.com/api2/";
    this.NOTE_FETCH_LENGTH = 50;
  }

  /**
   * Authorize user to SimpleNote
   * @return {Promise} Promise of the authoriation token
   */
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

  /**
   * Returns all notes
   * @param  {integer} len Number of notes to return. Defaults to Infinity
   * @return {Promise}     Promise of notes in an array-like object
   */
  all(len = Infinity) {
    var auth = this.auth();

    return auth.then(token =>
        new Promise(
          (resolve, reject) => {
            resolve(this._get(token, len));
          })
      )
      .catch(e => console.log(e));
  }

  /**
   * Helper function for `all` to be called rescursively
   * @param  {string} token   SimpleNote authoriation token
   * @param  {integer} len    Number of notes to return
   * @param  {string} ...mark Bookmark of notes if available
   * @return {object}         Array-like object of notes
   */
  _get(token, len, ...mark) {
    var m = null;
    if (mark.length > 0) {
      m = mark[0];
    }

    let remaining = len - this.notes.length;
    let n = (remaining < this.NOTE_FETCH_LENGTH) ? remaining : this.NOTE_FETCH_LENGTH;
    return this._fetch(token, n, m).then(json => {
      this._add_notes(json.data);

      if(json.mark && this.notes.length < len) {
        return this._get(token, len, json.mark);
      } else {
        this.notes = array(this.notes).sort('modifydate', 'desc');
        return this.notes;
      }
    });
  }

  /**
   * Reduce notes to shared notes array
   * @param {object} notes Returned notes
   */
  _add_notes(notes) {
    this.notes = notes.reduce(function (previous, current) {
      previous.push(current);
      return previous;
    }, this.notes);
  }

  /**
   * Get notes
   * @param  {string} token   SimpleNote authoriation token
   * @param  {integer} len    Number of notes to return
   * @param  {string} ...mark Bookmark of notes if available
   * @return {Promise}        Promise of the response JSON
   */
  _fetch(token, len, ...mark) {
    var query = {
      auth: token,
      email: this.email,
      length: len
    };

    if (mark.length > 0) {
      query.mark = mark[0];
    }
    return new Promise(
        (resolve, reject) => {
          request
            .get(this.api2 + 'index')
            .type('json')
            .query(query)
            .end((err, res) => {
              if (res.error) console.log(res.error);
              if (res.error) reject(res.error);
              else if (!res.text) reject([]);
              var json = JSON.parse(res.text);
              resolve(json);
            });
        });
  }

  /**
   * Get a single note by key
   * @param  {string} key Key of note
   * @return {Promise}    Promise of a Note object
   */
  get(key) {
    if (!key) throw 'error no key';

    var auth = this.auth();

    return auth.then(token =>
        new Promise(
          (resolve, reject) => {
            request
              .get(this.api2 + 'data/' + key)
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

  /**
   * Updates a note if a key is set
   * Otherwise creates a new note
   * @param  {object} note Note object
   * @return {Promise}     Promise of a Note object updated by SimpleNote
   */
  update(note) {
    var auth = this.auth();

    if (note.key !== undefined) {
      return auth.then(token =>
          new Promise(
            (resolve, reject) => {
              request
                .post(this.api2 + 'data/' + note.key)
                .type('json')
                .query({
                  auth: token,
                  email: this.email
                })
                .send(note)
                .end((err, res) => {
                  if (res.error) reject(res.error);
                  else if (!res.text) reject({});
                  resolve(JSON.parse(res.text));
                });
            })
        )
        .catch(e => console.log(e));
    }

    return this.create(note);
  }

  /**
   * Create a new note
   * @param  {object} note Note object
   * @return {Promise}     Promise of a Note object updated by SimpleNote
   */
  create(note) {
    var auth = this.auth();

    return auth.then(token =>
        new Promise(
          (resolve, reject) => {
            request
              .post(this.api2 + 'data')
              .type('json')
              .query({
                auth: token,
                email: this.email
              })
              .send(note)
              .end((err, res) => {
                if (res.error) reject(res.error);
                else if (!res.text) reject({});
                resolve(JSON.parse(res.text));
              });
          })
      )
      .catch(e => console.log(e));
  }

  /**
   * Trash a note
   * @param  {array} args Note key or object
   * @return {Promise}    Promise of a Note object updated by SimpleNote
   */
  trash(...args) {
    if (args.length > 0 && typeof args[0] === 'object' && args[0] !== null) {
      let note = args[0];
      note.deleted = 1;
      return this.update(note);
    }

    var note = {
        "key": args[0],
        "deleted": 1
    };

    if (args.length > 0 && args[0] !== null) {
      return this.update(note);
    }

    return new Promise(function(resolve, reject) {
      reject('Note object or key not passed');
    });
  }

  /**
   * Delete a note
   * @param  {string} key Note key
   * @return {Promise}    Promise of an empty object
   */
  delete(key) {
    if (!key) throw 'error no key';

    // must trash first
    this.trash(key);

    let auth = this.auth();

    return auth.then(token =>
        new Promise(
          (resolve, reject) => {
            request
              .del(this.api2 + 'data/' + key)
              .query({
                auth: token,
                email: this.email
              })
              .end((err, res) => {
                if (res.error) reject(res.error);
                else if (!res.text) reject({});
                resolve(res.text);
              });
          })
      )
      .catch(e => console.log(e));
  }
}

export default SimpleNote;
