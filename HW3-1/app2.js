/* Sample from another student */

var MongoClient = require("mongodb").MongoClient;

MongoClient.connect("mongodb://localhost:27017/school", function(err, db){
	var students = db.collection("students");
	var spliced = 0;
	var calls = 0;
	var cursor = students.find({});
	cursor.sort([["_id", 1]]);
	cursor.each(function(err,doc){
	    if(err){throw err;}
	    if(doc===null){
	        console.log("spliced " + spliced + " homeworks");
	        console.log("Recieved " + calls + " callbacks, last one being " + newscore);
	        return db.close();}
	    var hw1 = null;
	    var hw2 = null;
	    var hw1index = null;
	    var hw2index = null;
	    var newscore = doc["scores"];
	    for(i=0;i<doc["scores"].length;i++){

	        if(doc.scores[i].type=="homework"){     //Making sure it's actually a "homework" score im dealing with
	            if(hw1==null){
	                hw1 = doc.scores[i].score;
	                hw1index = i;                       //Storing the score and the index..In homework collection the index is always 2 and 3,
	            }else{                              //this is just in case some document dont follow the pattern.
	                hw2 = doc.scores[i].score;
	                hw2index = i;
	                if(hw1!=null && hw2!=null){     //Making sure there was actually 2 homeworks in each document.In case there was just one, Dont drop it! Again, this wouldn't be needed for example DB, But now it could work on a less tidy collection as well!
	                    if(hw1 == hw2){             
	                                                    //check for lowest score, and splice acordingly, Then save to database.
	                        newscore.splice(hw1index,1);
	                        students.update({_id: doc._id},{"scores": newscore}, function(){
	                            calls++ ;
	                            console.log(newscore);});
	                        spliced++;
	                        console.log("spliced hw1 score of" + hw1+" which was lower than hw2 score of " + hw2);

	                    }else if(hw1>hw2){

	                        newscore.splice(hw2index,1);
	                        students.update({_id: doc._id},{"scores": newscore}, function(){
	                            calls++ ; 
	                            console.log(newscore);});
	                        spliced++;
	                        console.log("spliced hw2 score of" + hw2 + " which was lower than hw1 core of " + hw1);

	                    };
	                };
	            };
	        };
	    };
	});
});


