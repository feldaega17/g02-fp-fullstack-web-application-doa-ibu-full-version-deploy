import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utility/generateToken.js";

export const register = async (req, res) => {
  try {
    const { fullname, username, password, confirmPassword } = req.body;

    // Check password
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords don't match!" });
    }

    // Check username availability
    const user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ error: "Username already exists." });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Add profile picture
    const nameSplit = fullname.trim().split(" ");
    const firstname = nameSplit[0];
    let lastname = null;
    if (nameSplit.length !== 1) {
      lastname = nameSplit[nameSplit.length - 1];
    }
    const fullProfilePicture = `https://avatar.iran.liara.run/username?username=${firstname}+${lastname}`;
    const partialProfilePicture = `https://avatar.iran.liara.run/username?username=${firstname}`;

    // create new user
    const newUser = new User({
      fullname,
      username,
      password: hashedPassword,
      profilePicture:
        lastname !== null ? fullProfilePicture : partialProfilePicture,
      role: "User",
    });

    // add jwt token to the cookies
    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullname: newUser.fullname,
        username: newUser.username,
        profilePicture: newUser.profilePicture,
        role: newUser.role,
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in register controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const checkPassword = await bcrypt.compare(password, user?.password || "");

    if (!user || !checkPassword) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(201).json({
      _id: user._id,
      fullname: user.fullname,
      username: user.username,
      profilePicture: user.profilePicture,
      role: user.role,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Successfully logged out" });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
