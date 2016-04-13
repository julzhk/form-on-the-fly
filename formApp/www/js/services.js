// todo: add this to the services
function upsert( db, doc ) {
    db.get( doc._id )
        .then (function(_doc) {
            console.log('updating');
            doc._rev = _doc._rev;
            return db.put(doc);
            })
        .catch( function (error) {
            console.log('inserting');
            return db.put(doc);
        })
}


function DataSingleton() {
    // share a global state between controllers
    // http://stackoverflow.com/questions/21919962/share-data-between-angularjs-controllers
    return {'user_email': 'anon'};
}
//THIS IS HOW TO DI TO A SERVICE?VV
function formdataService($q) {
    //store the user created data for later online sync
    var formdata_db;
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
        formdata_db = new PouchDB(POUCH_FORM_DATA_DB_NAME, {adapter: 'websql'});
    }

    function addformdata(formdata) {
          return $q.when(formdata_db.post(formdata));
    }

    function deleteallformdata() {
          console.log('deleteallformdata formdata');
          return $q.when(
            formdata_db.destroy()
          );
    };

    function updateformdata(formdata) {
        return $q.when(formdata_db.put(formdata));
    };

    function deleteformdata(formdata) {
        return $q.when(formdata_db.remove(formdata));
    };

    function findformdatas(formid){
        formdata_db.find({
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
           return $q.when(formdata_db.allDocs({ include_docs: true}))
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
                    formdata_db.changes({ live: true, since: 'now', include_docs: true})
                       .on('change', onDatabaseChange);
                    return _pouchdb_rows;
                });
        } else {
            // Return cached data as a promise
            return $q.when(_pouchdb_rows);
        }
    }

    function destroy(){
      formdata_db.destroy().then(function () {
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

function formschemaService($q,$http) {
//  gets data from REST API if available, falls back to pouchdb if not, throws error if no pouch either
    var formschema_db;
      return {
        initDB: initDB,
        addformschema: addformschema,
        findformschema: findformschema,
        getAllformschema: getAllformschema,
        deleteformschema: deleteformschema,
        deleteallformschema: deleteallformschema
    };

    function initDB() {
        // Creates the database or opens if it already exists
        formschema_db = new PouchDB(POUCH_SCHEMA_DB_NAME, {adapter: 'websql'});
    }

    function addformschema(formschema) {
          return $q.when(formschema_db.post(formschema));
    }
    function remove_custom_fields(fields){
      // there are some extra data for each field, which form.ly chokes on
      // such as 'form name' etc
      // so remove these before rendering
      _.map(fields, function (f) {
            delete f.custom
          });
      return fields;

    }
    function api_success(data, status, headers, config) {
          //get field names
          console.log(data);
          //get the name of the form
          formname = data.meta.formname;
          fields = data.elements;
          fields=remove_custom_fields(fields);
          return fields;
        }
  function pouch_find_success(data) {
            //got from local store, populate
            console.log('fetched schema from local ');
            fields = data.docs[0].elements;
            formname = data.docs[0].meta.formname;
            fields=remove_custom_fields(fields);
            return fields;
        }

    function findformschema(formid){
      $http.get(FORM_SCHEMA_API + formid).success(
        function (data, status, headers, config) {
          api_success(data, status, headers, config)
        }
      ).error(
        function (error, status, headers, config) {
          // API didn't work, so get from local store
          console.log("REST FORM Error occured");
          data = formschema_db.find({selector: { _id: {'$eq': formid} },include_docs: true}
          ).then(
            pouch_find_success(data)
          ).catch(function (err) {
            console.log('error with form schema pouch db');
            return 'err!';
          });
      });
    }
    function getAllformschema(){}
    function deleteformschema(){}
    function deleteallformschema(){}
}
