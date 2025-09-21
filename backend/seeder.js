import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Item from "./models/Item.js";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

// Helpers to resolve path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read JSON file
const products = JSON.parse(
  fs.readFileSync(path.join(__dirname, "./data/products.json"), "utf-8")
);

const importData = async () => {
  try {
    await Item.deleteMany(); // clear DB before inserting
    await Item.insertMany(products); // load products.json into DB
    console.log("Data Imported!");
    process.exit(); // exit successfully
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1); // exit with failure
  }
};

importData();
