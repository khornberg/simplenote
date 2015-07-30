# SimpleNote

SimpleNote API wrapper using [ES6 features](http://en.wikipedia.org/wiki/ECMAScript)

## Example

```js
import SimpleNote from "./index";
var simplenote = new SimpleNote('user', 'pass');
simplenote.all().then(notes => console.log(notes));
```

*Run the example using babel-node*

## API

### all([n])

Get `n` note indexes from the server. Defaults to 100.  
Returns an ES6 promise which resolves to an [array](matthewmueller/array).  

### get(key)

Get a note's data by key. `key` corresponds to the `key` returned by the index.  
Returns an ES6 promise which resolves to key's JSON.  

### create(note)

Create a new note from a Note object.  
Returns an ES6 promise which resolves to an updated Note object.  

Example Note object:  
```
{
    "tags": [],
    "deleted": 0,
    "systemtags": [],
    "content": "a simple note"
}
```

### update(note)

Updates a note if a key is set. Otherwise creates a new note from a Note object.  
Returns an ES6 promise which resolves to an updated Note object.  

### trash(...args)

Trashes a note (different than delete which permanently deletes the note).  
Arguments can be either a key or a Note object.  
Returns an ES6 promise which resolves to an updated Note object.  

### delete(key)
Deletes a note.
Returns an ES6 promise which resolves to the response.


## TODO

- error handling
- ensure utf-8 strings
- documentation
