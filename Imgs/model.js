import mongoose from "mongoose";
import imageSchema from "./schema.js";
const imageModel = mongoose.model("ImageModel", imageSchema);
export default imageModel;