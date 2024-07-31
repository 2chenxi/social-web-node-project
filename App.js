import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import UserRoutes from "./Users/routes.js";
import cors from "cors";
import session from "express-session";

const CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING || "mongodb://127.0.0.1:27017/5610-proj";
mongoose.connect(CONNECTION_STRING);

const app = express();
const corsOptions = {
  credentials: true, // support cookies
  origin: process.env.NETLIFY_URL || "http://localhost:3000", // restrict cross-origin resource
};
app.use(cors(corsOptions)); // Use CORS right after creating the app

const sessionOptions = { // configure server sessions after cors
  secret: process.env.SESSION_SECRET || "5610-proj", // default session options
  resave: false,
  saveUninitialized: false,
};
if (process.env.NODE_ENV !== "development") { // in production
  sessionOptions.proxy = true; // turn on proxy support
  sessionOptions.cookie = { // configure cookies for remote server
    sameSite: "none",
    secure: true,
    domain: process.env.NODE_SERVER_DOMAIN,
  };
}

app.use(
  session(sessionOptions)
);
app.use(express.json());

UserRoutes(app);

app.listen(process.env.PORT || 4000);