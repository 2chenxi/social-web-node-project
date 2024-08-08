import postModel from "./model.js";
import imageModel from "../Imgs/model.js";
import userModel from "../Users/model.js";

export const addPostToUser = async (userId, postId) => {
  const updatedUser = await userModel.findByIdAndUpdate(
    userId, // User ID
    { $push: { posts: postId } }, // Add postId to the posts array
    { new: true, useFindAndModify: false } // Options
);}

// Function to create a new post
export const createPost = async (post) => {
  const { user, content, images } = post;
  
  // Create and save images, and collect their IDs
  const imageIds = await Promise.all(images.map(async (image) => {
    const imageDoc = new imageModel(image);
    const savedImage = await imageDoc.save();
    return savedImage._id;
  }));
  
  // Create post with references to saved images
  const postDetails = { user, content, images: imageIds };
  const savedPost = await postModel.create(postDetails);
  
  // Update the user's document with the new post ID
  await addPostToUser(user._id, savedPost._id);

  return savedPost;
};

// Function to find all posts with pagination and populated fields
export const findAllPosts = (limit = 10, skip = 0) => 
  postModel.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .populate('user', 'username email firstName lastName profilePicture coverPhoto bio location website followers following posts likes reviews comments')
    .populate('likes', 'username profilePicture')
    .populate('comments.user', 'username profilePicture')
    .populate('images'); // Populate image details

// Function to find a post by ID with populated fields
export const findPostById = (postId) => 
  postModel.findById(postId)
      .populate('user', 'username email firstName lastName profilePicture coverPhoto bio location website followers following posts likes reviews comments')
      .populate('likes', 'username profilePicture')
      .populate('comments.user', 'username profilePicture')
      .populate('images'); // Populate image details

// Function to find posts by user ID with pagination and populated fields
export const findPostsByUser = (userId, limit = 10, skip = 0) => 
  postModel.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .populate('user', 'username email firstName lastName profilePicture coverPhoto bio location website followers following posts likes reviews comments')
    .populate('likes', 'username profilePicture')
    .populate('comments.user', 'username profilePicture')
    .populate('images'); // Populate image details

// Function to update a post by ID
export const updatePost = (postId, post) => 
  postModel.updateOne({ _id: postId }, { $set: post });

// Function to delete a post by ID
export const deletePost = (postId) => 
  postModel.deleteOne({ _id: postId });

// Function to like a post
export const likePost = (postId, userId) => 
  postModel.updateOne(
    { _id: postId },
    { $addToSet: { likes: userId } }
  );

// Function to unlike a post
export const unlikePost = (postId, userId) => 
  postModel.updateOne(
    { _id: postId },
    { $pull: { likes: userId } }
  );

// Function to add a comment to a post
export const addComment = (postId, comment) => 
  postModel.updateOne(
    { _id: postId },
    { $push: { comments: comment } }
  );

// Function to remove a comment from a post
export const removeComment = (postId, commentId) => 
  postModel.updateOne(
    { _id: postId },
    { $pull: { comments: { _id: commentId } } }
  );

// Function to increment the share count of a post
export const incrementShareCount = (postId) => 
  postModel.updateOne(
    { _id: postId },
    { $inc: { shareCount: 1 } }
  );

// Function to find posts by content with case-insensitive search
export const findPostsByContent = (partialContent) => {
  const regex = new RegExp(partialContent, "i"); // 'i' makes it case-insensitive
  return postModel.find({ content: { $regex: regex } })
    .populate('user', 'name profilePicture')
    .populate('likes', 'name')
    .populate('comments.user', 'name profilePicture')
    .populate('images'); // Populate image details
};
