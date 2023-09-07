const express = require('express');
const app = express();
const port = 3000;
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'db1';
var results;
async function insertJsonIntoCollection(record) {
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    // Connect to the MongoDB server
    await client.connect();

    // Access the desired database and collection
    const db = client.db(dbName);
    const collection = db.collection('dbase'); // Change 'dbase' to your actual collection name

    // Insert the JSON document into the collection
    const result = await collection.insertOne(record);
    console.log(`Inserted document with _id: ${result.insertedId}`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the connection
    client.close();
  }
}
function rewriteMathExpression(inputString) {
    const operators = {
        plus: '+',
        minus: '-',
        into: '*',
        by: '/'
    };
    const parts = inputString.split('/').filter(Boolean);
    const expression = parts.map((part, index) => {
        if (index % 2 === 0) {
            return part;
        } else {
            return operators[part];
        }
    }).join('');
    const jsonResult = {
        question: expression,
        answer: eval(expression)
    };

    return jsonResult;
}
app.get('/:operands*', async (req, res) => {
    
    	console.log(req.originalUrl + "\n");
    	var urlreq = req.originalUrl;
    	const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

	  try {
	    // Connect to the MongoDB server
	    await client.connect();
	    // Access the desired database and collection
	    const db = client.db(dbName);
	    const collection = db.collection('dbase');
	    // Retrieve the last 20 records from the collection
	    const records = await collection.find().sort({ _id: -1 }).limit(20).toArray();

	    // Respond with the records as JSON array
	    results = records;
	  } catch (error) {
	    console.error('Error:', error);
	    res.status(500).json({ error: 'An error occurred' });
	  } finally {
	    // Close the connection
	    client.close();
	  }
	if(req.originalUrl.includes("history"))
	{	
		res.json(results);
	}
	else
	{	
		insertJsonIntoCollection(rewriteMathExpression(req.originalUrl));
		res.json(rewriteMathExpression(req.originalUrl));	
	}  	
});
app.get('/', (req, res) => {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.write("<p> Eg 1 /5/plus/3 JSON {question:&rdquo;5+3&rdquo;,answer: 8} </br> Eg 2 /3/minus/5 JSON {question:&rdquo;3-5&rdquo;, answer: -2} </br>Eg 3 /3/minus/5/plus/8 JSON {question:&rdquo;3-5+8&rdquo;, answer: 6} </br>Eg 4 /3/into/5/plus/8/into/6 JSON {question:&rdquo;3*5+8*6&rdquo;, answer: 63}</p>");
		res.end();   	
});
// Start the server
app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});



