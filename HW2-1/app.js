var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/weather', function(err, db) {
    if(err) throw err;

    var data = db.collection('data');
    var query = {'Wind Direction' : {'$gt' : 180, '$lt' : 360}};
    // Configure cursor options to only return the single row with the lowest temperature
    // in the set defined in the query above.
    var options = { 'skip' : 1, 'limit' : 1, 'sort' : [[ 'Temperature', 1 ]] }; // Note that double brackets seem to be required!
    var cursor = data.find(query, {}, options);

    cursor.each(function(err, doc) {
        if(err) throw err;
        if(doc === null) {
            return db.close();
        }
        console.dir(doc);
    });
});
