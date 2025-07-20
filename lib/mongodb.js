// import { MongoClient } from "mongodb";

// if (!process.env.MONGODB_URI) {
//   throw new Error("Please add your MongoDB URI to .env.local");
// }

// const uri = process.env.MONGODB_URI;
// const options = {};

// let client;
// let clientPromise;

// if (process.env.NODE_ENV === "development") {
//   const globalWithMongo = global;

//   if (!globalWithMongo._mongoClientPromise) {
//     client = new MongoClient(uri, options);
//     globalWithMongo._mongoClientPromise = client.connect();
//   }
//   clientPromise = globalWithMongo._mongoClientPromise;
// } else {
//   client = new MongoClient(uri, options);
//   clientPromise = client.connect();
// }

// export async function getDatabase() {
//   const client = await clientPromise;
//   return client.db("gym_mate_latest");
// }

// export default clientPromise;

/**
 * Compatibility layer - DO NOT use for new code.
 *
 * Some legacy files still import:
 *   import { getDatabase } from "@/lib/mongodb"
 *
 * Instead of the old native-driver implementation we now
 * funnel the call through the existing Mongoose singleton.
 */
import connectDB from "./mongoose.js";

/**
 * Returns the underlying native MongoDB database instance.
 * Always call `await getDatabase()` to ensure the connection is ready.
 */
export async function getDatabase() {
  // `connectDB` connects (or re-uses) the global Mongoose connection
  const mongoose = await connectDB();
  // Expose the native driver’s `db` for code that still expects it
  return mongoose.connection.db;
}

// (optional) maintain a default export for maximum compatibility
export default getDatabase;
