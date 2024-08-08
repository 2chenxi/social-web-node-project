import mongoose from "mongoose";
import schema from "./schema.js";
const userModel = mongoose.model("UserModel", schema);
export default userModel;