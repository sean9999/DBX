"use strict";

var db = new Dexie('numops');
db.version(1).stores({
	'people': '++id,name,dob'
});
db.open();
db.people.add({name: "barb", dob: 3243}).then(function(){
	db.people.where("dob").between(100,56767).each(function(row){
		console.log(row);
	});
});