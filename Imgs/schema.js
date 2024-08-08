import mongoose from "mongoose";
const imageSchema = new mongoose.Schema({
  path: {type: String, required: true},
  filename: {type: String, required: true},
},
{collection : "images"});

export default imageSchema;