const mongoose = require('mongoose');
const data=require('./data.js');
const Listing=require('../models/listing.js'); 
const initData=require('./data.js');
const Schema = mongoose.Schema;


const MONGO_URL='mongodb://127.0.0.1:27017/wanderlust';

main().then(()=>{
  console.log("Connected to MongoDB"+mongoose.connection.name);
})
.catch(err=>{
  console.log("Error connecting to MongoDB",err);
});
async function main(){
  const connect= await mongoose.connect(MONGO_URL);
  return connect;

}
const initDB=async()=>{
  await Listing.deleteMany({});
  initData.data=initData.data.map((obj)=>({...obj,owner:"693ab8237ce98a5c6312db7d"}));
  await Listing.insertMany(data.data);
  console.log("Database initialized with sample data.");
  
}
initDB();
