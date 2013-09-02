// HW2-2: Write a program that finds the document with the highest recorded temperature for each state, and adds a "month_high" field for that document, setting its value to true. Use the weather dataset that you imported in HW 2.1. 

var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/weather', function(err, db) {
    if(err) throw err;

    var data = db.collection('data');
    // Configure cursor options to sort ascending by State and descending by Temperature.
    // This allows us to do control/break style processing on the list
    // to see the highest temperature doc for each state when the state value
    // changes.
    var options = { 'sort' : [['State', 1], [ 'Temperature', -1 ]] }; // Note that double brackets seem to be required!
    var cursor = data.find({}, {}, options);
    var newState = null;
    var query = {};
    
    cursor.each(function(err, doc) {
        if(err) throw err;
        if(doc === null) {
            return db.close();
        }
        // Are we on a new state?
        if(newState != doc.State) {
            newState = doc.State;
            console.dir(newState + " " + doc._id + ":" + doc.Temperature);
            // Add the new field to this document
            doc.month_high = true;
            query._id = doc._id;
            data.update(query, doc, function(err, updated) {
                if(err) throw err;
            });
        }
	});
});
