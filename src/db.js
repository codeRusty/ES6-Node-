import mongoose from  'mongoose' 

var dbURI = 'mongodb://localhost:27017/testing'; 

// Create the database connection 
mongoose.connect(dbURI); 

// CONNECTION EVENTS
mongoose.connection.on('connected',  () =>{  
  console.log('Mongoose default connection open to ' + dbURI);
}); 

mongoose.connection.on('error', (err) => {  
  console.log('Mongoose default connection error: ' + err);
}); 

mongoose.connection.on('disconnected',  () =>{  
  console.log('Mongoose default connection disconnected'); 
});

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', () => {  
  mongoose.connection.close( () => { 
    console.log('Mongoose default connection disconnected through app termination'); 
    process.exit(0); 
  });
}); 

// BRING IN YOUR SCHEMAS & MODELS // For example 
//require('./models/userSchema');  