const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: [2, "The name must ba at least 2 characters long"],
    trim: true,
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: validator.isEmail,
      message: "Incorrect email",
    },
    unique: [true, "This email is already in use. Please choose another one"],
    trim: true,
  },
  password: {
    type: String,
    required: [true, "User must have a password"],
    minLength: [6, "Password cannot be shorter that 6 characters!"],
    trim: true,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return; // do not hash the password again if the user changed the profile data

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
