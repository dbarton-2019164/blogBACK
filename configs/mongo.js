"use strict";

import mongoose from "mongoose";

export const dbConnection = async () => {
  try {
    mongoose.connection.on("open", () => {
      console.log("MongoDB | connected to database");
    });
    await mongoose.connect(process.env.URI_MONGO, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 50,
    });
  } catch (error) {
    console.log("Database connection failed", error);
  }
};