import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import router from "./routes/index.js";

/**
 * Main entry point for the server application.
 *
 * This file sets up the Express.js server, 
 * configures middleware, and establishes a connection to the MongoDB database.
 *
 * @module server
 */

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());
app.use('/', router);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});