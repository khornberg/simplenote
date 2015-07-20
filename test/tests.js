/* jshint esnext: true */

import SimpleNote from '../dist/index';
import chai from "chai";
import chaiAsPromised from "chai-as-promised";

chai.use(chaiAsPromised);
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
 * Test structure
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

// Unit tests

// Authenticate
describe('Authenticate to SimpleNote', () => {
  var auth = simplenote.auth();
  it('should return a token', () => {
    assert.eventually.isString(auth, 'string returned');
  });
  it('should set simplenote token', () => {
    assert.eventually.equal(auth, simplenote.token, 'tokens equal');
    auth.then(() => {
      assert.isNumber(simplenote.expires, 'expires set');
    });
  });
  it('should set simplenote expires', () => {
    auth.then(() => {
      assert.isNumber(simplenote.expires, 'expires set');
    });
  });
});

// simplenote.create(new_note)
// .then(note => {console.log('new', note); simplenote.get(note.key);})
// .then(note => {console.log('get', note); update_note.key=note.key; simplenote.update(update_note);})
// .then(note => {console.log('updated', note); simplenote.get(note.key);})
// .then(note => {console.log('get', note); simplenote.trash(note);})
// .then(note => {console.log('trashed', note); simplenote.get(note.key);})
// .then(note => {console.log('get', note); simplenote.delete(note.key);})
// .then(response => {console.log('delete', response);});
//
// // Failures
// simplenote.create(new_note)
// .then(note => {console.log('created', note); simplenote.trash(note.key);})
// .then(note => {console.log('trashed', note); old_note_key=note.key; simplenote.delete(note.key);})
// .then(response => {console.log('deleted', response); simplenote.get(old_note_key);})
// .then(response => {console.log('get deleted', response); update_note.key=old_note_key; simplenote.update(update_note.key);});
//
// simplenote.create(poorly_formed_note)
// .then(response => {console.log('poorly formed', response);});
//
// // All
// simplenote.all(5)
// .then(notes => {console.log('all 5', notes.length); simplenote.all();})
// .then(notes => {console.log('all', notes.length);});

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
    .then(note => {console.log('get', note); done();
    simplenote.delete(note.key)
    .then(response => {console.log('delete', response);

  }); }); }); }); }); }); })
));

//sdg
