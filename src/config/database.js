import { MongoClient } from "mongodb";

import dotenv from "dotenv";
dotenv.config();

// conexão com o banco de dados
const mongoURL = process.env.MONGO_URL;
const mongoClient = new MongoClient(mongoURL);

try {
  await mongoClient.connect();
  console.log("MongoDB conectado!");
} catch (error) {
  console.log(error.message);
}

export const db = mongoClient.db();