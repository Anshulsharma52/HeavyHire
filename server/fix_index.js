import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const fix = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await mongoose.connection.collection('users').dropIndex('email_1');
    console.log("Index email_1 dropped successfully");
  } catch(e) { 
    console.log("Error dropping index: ", e.message);
  }
  process.exit();
}
fix();
