import userModel from "./model.js";

export const createUser = (user) => {
  delete user._id
  return userModel.create(user);  
} 
export const findAllUsers = () => userModel.find();
// export const findUserById = (userId) => model.findById(userId);
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