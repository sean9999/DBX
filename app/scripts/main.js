"use strict";
var schema {

};

var conn = new DBX('db01').version(1).schema(database_schema);

conn.open().then( dbx.startTransaction(['store01'],'readwrite') ).then(function(transaction){
	//	here we do what we want, and return a promise when we want.
	var store = transaction.objectStore('store01'),
		request,
		cool = function(row_id) { console.log(row_id) },
		shitty = function(err) { console.log('Aw SNAP!',err) };

	for (var i=0;i<100;i++) {
		var row = {
			id: i,
			foo: G.performance.now(),
			goo: ( Math.random() * Number.MAX_SAFE_INTEGER ).toString(16);
		};
		request = store.put(row);
		request.onsuccess = cool;
		request.onerror = shitty;
	}

	transaction.oncomplete = function(){};

});