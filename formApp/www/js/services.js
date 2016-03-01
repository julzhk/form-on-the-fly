function formdataService($q) {
    //pouchdb CRUD
    var _db;
    // We'll need this later.
    var _pouchdb_rows;
    return {
        initDB: initDB,
        getAllformdatas: getAllformdatas,
        findformdatas: findformdatas,
        addformdata: addformdata,
        updateformdata: updateformdata,
        deleteformdata: deleteformdata,
        deleteallformdata: deleteallformdata
    };
    function initDB() {
        // Creates the database or opens if it already exists
        _db = new PouchDB(POUCH_DB_NAME, {adapter: 'websql'});
    }

    function addformdata(formdata) {
          return $q.when(_db.post(formdata));
    };

    function deleteallformdata() {
          console.log('deleteallformdata formdata');
          return $q.when(
            _db.destroy()
          );
    };

    function updateformdata(formdata) {
        return $q.when(_db.put(formdata));
    };

    function deleteformdata(formdata) {
        return $q.when(_db.remove(formdata));
    };

    function findformdatas(formid){
        db.find({
          selector: {formid: {$eq: formid}}
        }).then(function (result) {
          // yo, a result
          console.log('finded');
          console.log(result)
          return result.docs
        }).catch(function (err) {
          // ouch, an error
          console.log(err);
        });
    }

    function getAllformdatas() {
        if (!_pouchdb_rows) {
           return $q.when(_db.allDocs({ include_docs: true}))
                .then(function(docs) {
                    // Each row has a .doc object and we just want to send an
                    // array of pouchdb objects back to the calling controller,
                    // so let's map the array to contain just the .doc objects.
                    _pouchdb_rows = docs.rows.map(function(row) {
                        // pre-process (date format etc)
                        // Dates are not automatically converted from a string.
                        // ie: row.doc.Date = new Date(row.doc.Date);
                        return row.doc;
                    });
                    // Listen for changes on the database.
                    _db.changes({ live: true, since: 'now', include_docs: true})
                       .on('change', onDatabaseChange);
                    return _pouchdb_rows;
                });
        } else {
            // Return cached data as a promise
            return $q.when(_pouchdb_rows);
        }
    };

    function destroy(){
      _db.destroy().then(function () {
        // database destroyed
        console.log('destroyed');
      }).catch(function (err) {
        // error occurred
        console.log('destroy err');
      })

    }

    function onDatabaseChange(change) {
        var index = findIndex(_pouchdb_rows, change.id);
        var formdata = _pouchdb_rows[index];
        if (change.deleted) {
            if (formdata) {
                _pouchdb_rows.splice(index, 1); // delete
            }
        } else {
            if (formdata && formdata._id === change.id) {
                _pouchdb_rows[index] = change.doc; // update
            } else {
                _pouchdb_rows.splice(index, 0, change.doc);// insert
            }
        }
    }

    function findIndex(array, id) {
      var low = 0, high = array.length, mid;
      while (low < high) {
        mid = (low + high) >>> 1;
        array[mid]._id < id ? low = mid + 1 : high = mid
      }
      return low;
    }
}
