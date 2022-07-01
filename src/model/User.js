const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
});

userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const { password } = user;
    const hash = await bcrypt.hash(password, salt);
    user.password = hash;
    next();
  } catch (err) {
    return next(err);
  }
});

userSchema.methods.comparePassword = async function (givenPassword) {
  const { password } = this;
  try {
    const isMatch = await bcrypt.compare(givenPassword, password);
    if (isMatch) return true;
    else throw new Error(false);
  } catch (err) {
    throw new Error(false);
  }
};

mongoose.model("User", userSchema);
