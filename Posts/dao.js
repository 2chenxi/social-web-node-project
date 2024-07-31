import Post from "./model.js";

export const createPost = (post) => {
  delete post._id;
  return Post.create(post);
};

export const findAllPosts = (limit = 10, skip = 0) => 
  Post.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .populate('user', 'name profilePicture')
    .populate('likes', 'name')
    .populate('comments.user', 'name profilePicture');

export const findPostById = (postId) => 
  Post.findById(postId)
    .populate('user', 'name profilePicture')
    .populate('likes', 'name')
    .populate('comments.user', 'name profilePicture');

export const findPostsByUser = (userId, limit = 10, skip = 0) => 
  Post.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .populate('user', 'name profilePicture')
    .populate('likes', 'name')
    .populate('comments.user', 'name profilePicture');

export const updatePost = (postId, post) => 
  Post.updateOne({ _id: postId }, { $set: post });

export const deletePost = (postId) => 
  Post.deleteOne({ _id: postId });

export const likePost = (postId, userId) => 
  Post.updateOne(
    { _id: postId },
    { $addToSet: { likes: userId } }
  );

export const unlikePost = (postId, userId) => 
  Post.updateOne(
    { _id: postId },
    { $pull: { likes: userId } }
  );

export const addComment = (postId, comment) => 
  Post.updateOne(
    { _id: postId },
    { $push: { comments: comment } }
  );

export const removeComment = (postId, commentId) => 
  Post.updateOne(
    { _id: postId },
    { $pull: { comments: { _id: commentId } } }
  );

export const incrementShareCount = (postId) => 
  Post.updateOne(
    { _id: postId },
    { $inc: { shareCount: 1 } }
  );

export const findPostsByContent = (partialContent) => {
  const regex = new RegExp(partialContent, "i"); // 'i' makes it case-insensitive
  return Post.find({ content: { $regex: regex } })
    .populate('user', 'name profilePicture')
    .populate('likes', 'name')
    .populate('comments.user', 'name profilePicture');
};