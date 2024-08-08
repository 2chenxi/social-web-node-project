import mongoose from "mongoose";
// import imageSchema from "../Imgs/schema.js";

const PostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserModel',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 5000
  },
  images: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ImageModel'
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserModel'
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserModel',
      required: true
    },
    content: {
      type: String,
      required: true,
      maxlength: 1000
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  shareCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
},
{collection : "posts"});



export default PostSchema;