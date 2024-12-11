import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    profilePicture: {
      type: String,
      defualt: "",
    },
    role: {
      type: String,
      default: "User",
    },
  },
  {
    collection: "doa-ibu",
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
