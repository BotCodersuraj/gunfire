export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { city, region, country, ip, battery } = req.body;
    console.log(`Received data: ${city}, ${region}, ${country}, ${ip}, ${battery}`);

    // Database mein store karne ka code yahan jayega
    // For example, using MongoDB
    const MongoClient = require('mongodb').MongoClient;
    const url = 'mongodb:                   
    const dbName = '//localhost:27017';
    const dbName = 'mydatabase';

    MongoClient.connect(url, function(err, client) {
      if (err) {
        console.log(err);
      } else {
        console.log('Connected to database');
        const db = client.db(dbName);
        const collection = db.collection('user_data');
        collection.insertOne({ city, region, country, ip, battery }, function(err, result) {
          if (err) {
            console.log(err);
          } else {
            console.log('Data inserted successfully');
          }
        });
      }
    });

    res.status(200).json({ message: 'Data received successfully' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}