"use strict";
function DBX(dbname,schema){
	/*
	window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
	window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
	window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
	*/
	//	sanity checking
	this.db = {};
	if (typeof schema === 'object') {
		if ("version" in schema) {
			this.version(schema.version);
		}
		this.schema(schema);
	}
	if (typeof dbname === 'string') {
	this.db.name = dbname;
	} else {
		throw new Error('wrong db name type');
	}
	return this;
};

DBX.prototype.version = function(version) {
	if (typeof version === 'number' && Math.floor(version) === version && version > 0 ) {
		this.db.version = version;
		return this;
	} else {
		throw new Error('version number must be a simple unsigned integer greater than 0');
	}
};
DBX.prototype.schema = function(schema) {
	if (schema.constructor.name === 'Object') {
		if ( ("version" in schema) && !("version" in this.db) ) {
			this.version(schema.version);
		}
		this.db.schema = schema;
		return this;
	} else {
		throw new Error('Wrong type for schema');
	}
};
DBX.prototype.open = function(stores,mode) {
	var dbx = this;
	var myIDBRequest = window.indexedDB.open( dbx.db.name, dbx.db.version );
	return new Promise(function(resolve, reject){
		
		var cool = function(ev) {
			var db = ev.target.result;
			dbx.db.instance = db;
			var trans = db.transaction(stores,mode);
			resolve(trans);
			/*
			trans.oncomplete = function(ev) {
				resolve( ev.target );
			}
			*/
		}
		var shitty = function(ev) {
			console.log(ev);
			reject(event.target.errorCode);
		};			
		var upgrade = function(ev) {
			return new Promise(function(resolve,reject){
				var db = ev.target.result;
				var num_stores = Object.keys(dbx.db.schema.stores).length;
				for (var storename in dbx.db.schema.stores ) {
					dbx.db.schema.stores[storename].primaryKey = dbx.db.schema.stores[storename].primaryKey || {};
					if ( db.objectStoreNames.contains(storename) ) {
						db.deleteObjectStore(storename);
					}
					var this_store = db.createObjectStore( storename, dbx.db.schema.stores[storename].primaryKey );
					if ("indexes" in dbx.db.schema.stores[storename]) {
						for (var keyname in dbx.db.schema.stores[storename].indexes) {
							this_store.createIndex(keyname,keyname,dbx.db.schema.stores[storename].indexes[keyname]);
						}
					}
				}				
				this_store.transaction.oncomplete = function(ev){
					resolve(ev.target.result);
				};
				this_store.transaction.onerror = function(ev){
					reject(ev);
				};
			});
		};
		myIDBRequest.onsuccess 		= cool;
		myIDBRequest.onerror 		= shitty;
		myIDBRequest.onblocked 		= shitty;
		myIDBRequest.onupgradeneeded= upgrade;
	});
};
DBX.prototype.startTransaction = function(stores, mode){
	return this.db.instance.transaction( stores, mode );
};
