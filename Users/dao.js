import userModel from "./model.js";

export const createUser = (user) => {
  delete user._id
  return userModel.create(user);  
} 
export const findAllUsers = () => userModel.find();
export const findUserById = (userId) => userModel.findById(userId);
export const findUserByUsername = (username) =>  userModel.findOne({ username: username });
export const findUserByCredentials = (username, password) =>  userModel.findOne({ username, password });
// export const findUsersByRole = (role) => model.find({ role: role }); // or just model.find({ role })
export const findUsersByPartialName = (partialName) => {
  const regex = new RegExp(partialName, "i"); // 'i' makes it case-insensitive
  return userModel.find({
    $or: [{ firstName: { $regex: regex } }, { lastName: { $regex: regex } }],
  });
};
export const updateUser = (userId, user) =>  userModel.updateOne({ _id: userId }, { $set: user });
export const deleteUser = (userId) => userModel.deleteOne({ _id: userId });
export const findReviewedPostsByUser = async (userId) => {
  try {
    // Fetch user with reviewed posts populated
    const user = await userModel.findById(userId).populate('reviewedPosts').exec();
    if (!user) {
      throw new Error('User not found');
    }
    return user.reviewedPosts;
  } catch (error) {
    console.error('Error fetching reviewed posts from DAO:', error);
    throw new Error('Error fetching reviewed posts');
  }
};