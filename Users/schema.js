import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    profilePicture: {
      type: String,
      default: ''
    },
    coverPhoto: {
      type: String,
      default: ''
    },
    bio: {
      type: String,
      default: '',
      trim: true
    },
    location: {
      type: String,
      default: '',
      trim: true
    },
    website: {
      type: String,
      default: '',
      trim: true
    },
    followers: [{
      type: mongoose.Types.ObjectId,
      default: '',
      trim: true
    }],
    following: [{
      type: mongoose.Types.ObjectId,
      default: '',
      trim: true
    }],
    posts: [{
      type: mongoose.Types.ObjectId,
      default: '',
      trim: true
    }],
    likes: [{
      type: mongoose.Types.ObjectId,
      default: '',
      trim: true
    }],
    reviews: [{
      type: mongoose.Types.ObjectId,
      default: '',
      trim: true
    }],
    comments: [{
      type: mongoose.Types.ObjectId,
      default: '',
      trim: true
    }],
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { collection: "users" }
);
export default userSchema;