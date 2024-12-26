/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import { MongoClient } from "mongodb";

Route.get("/test-db", async ({ response }) => {
  try {
    const client = new MongoClient(
      process.env.MONGODB_URL || "mongodb://localhost:27017"
    );
    await client.connect();
    const db = client.db(process.env.MONGODB_DATABASE);
    const collections = await db.listCollections().toArray();
    response.json({
      status: "success",
      message: "Database connected!",
      collections,
    });
  } catch (error) {
    response.status(500).json({
      status: "error",
      message: "Failed to connect to the database",
      error: error.message,
    });
  }
});
