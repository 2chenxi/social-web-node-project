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
    const user = await userModel.findById(userId).select('reviews');
    if (!user) {
      throw new Error('User not found');
    }
    return user.reviews;
  } catch (error) {
    console.error('Error fetching reviewed posts:', error);
    throw new Error('Error fetching reviewed posts');
  }
};

export const addFollowing = async (loggedInUserId, profileUserId) => {
  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      loggedInUserId,
      { $addToSet: { following: profileUserId } },
      { new: true }
    );
    return updatedUser;
  } catch (error) {
    console.error('Error adding following:', error);
    throw new Error('Error adding following');
  }
};

export const addFollower = async (profileUserId, loggedInUserId) => {
  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      profileUserId,
      { $addToSet: { followers: loggedInUserId } },
      { new: true }
    );
    return updatedUser;
  } catch (error) {
    console.error('Error adding follower:', error);
    throw new Error('Error adding follower');
  }
};

export const removeFollowing = async (loggedInUserId, profileUserId) => {
  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      loggedInUserId,
      { $pull: { following: profileUserId } },
      { new: true }
    );
    return updatedUser;
  } catch (error) {
    console.error('Error removing following:', error);
    throw new Error('Error removing following');
  }
};

export const removeFollower = async (profileUserId, loggedInUserId) => {
  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      profileUserId,
      { $pull: { followers: loggedInUserId } },
      { new: true }
    );
    return updatedUser;
  } catch (error) {
    console.error('Error removing follower:', error);
    throw new Error('Error removing follower');
  }
};