/* jshint esnext: true */

import SimpleNote from '../dist/index';
import chai from "chai";

var assert = chai.assert;

var user = (process.env.email || '');
var pass = (process.env.pass || '');

describe('Username and password', () => it('must be set', () => {
  assert(user, 'must provide a simplenote user/email');
  assert(pass, 'must provide a simplenote password');
}));

var simplenote = new SimpleNote(user, pass);

var update_note = {
    "tags": [],
    "deleted": 0,
    "systemtags": [],
    "content": "an updated note from the es6 api"
};

var new_note = {
    "tags": ['test'],
    "deleted": 0,
    "systemtags": [],
    "content": "new note"
};

var old_note_key = null;

var poorly_formed_note = {
  "content": "new note"
  };

/**
 * Desired Tests
 *
 * authenticate - ensure user, pwd, toke, expires are set
 * create - create a new note
 * get - the newly created note
 * update - the note with new content and tags
 * get - the updated note
 * trash - the updated note
 * get - the trashed note
 * delete - the trashed note
 * get - the deleted note; fail
 * update - the deleted note; fail
 * trash - the deleted note; fail
 * create - a poorly formed note; fail
 * all - get all of the users notes
 */

// Integration test

describe('The note life cycle', () => it('should work', done =>
    simplenote.create(new_note)
    .then(note => {console.log('new', note);
    simplenote.get(note.key)
    .then(note => {console.log('get', note); update_note.key=note.key;
    simplenote.update(update_note)
    .then(note => {console.log('updated', note);
    simplenote.get(note.key)
    .then(note => {console.log('get', note);
    simplenote.trash(note)
    .then(note => {console.log('trashed', note);
    simplenote.get(note.key)
    .then(note => {console.log('get', note);  done();
    simplenote.delete(note.key)
    .then(response => {console.log('delete', response);

  }); }); }); }); }); }); })
));

//sdg
