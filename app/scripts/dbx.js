;(function(G,undefined){
	"use strict";
	function DBX(dbname){

		this.indexedDB = G.indexedDB || G.mozIndexedDB || G.webkitIndexedDB || G.msIndexedDB;
		this.IDBTransaction = G.IDBTransaction || G.webkitIDBTransaction || G.msIDBTransaction;
		this.IDBKeyRange = G.IDBKeyRange || G.webkitIDBKeyRange || G.msIDBKeyRange;

		this.db = {
			name: dbname
		}
		return this;
	}
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
			this.db.schema = schema;
			return this;
		} else {
			throw new Error('Wrong type for schema');
		}
	};
	DBX.prototype.open = function() {
		var dbx = this;
		return new Promise(function(resolve, reject){
			var request = this.indexedDB.open( dbx.db.name, dbx.db.version );
			var cool = function(ev) {
				resolve(ev.target.result);
			}
			var shitty = function(ev) {
				console.log(ev);
				reject(ev);
				//throw new Error('something super shitty happened');
			};
			var upgrade = function(ev) {
				return new Promise(function(resolve,reject){
					var db = ev.target.result;

				});
			};
			request.onsuccess 		= cool;
			request.onerror 		= shitty;
			request.onblocked 		= shitty;
			request.onupgradeneeded = upgrade;
			};
		});
	};
	DBX.prototype.upgrade


	return DBX;
})(window);
