const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const helper = require("../utils/helper");
const User = mongoose.model("User");
const constants = require("../utils/constants");
const router = express.Router();

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const { errorPayload, successPayload } = constants;

  const respCode = 422;
  if (!email || !password) {
    return res
      .status(respCode)
      .send(
        helper.errorhelper(respCode, "Invalid password or email", errorPayload)
      );
  }
  try {
    const respCode = 404;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(respCode)
        .send(
          helper.errorhelper(
            respCode,
            "Invalid password or email",
            errorPayload
          )
        );
    }
    try {
      await user.comparePassword(password);
      const token = jwt.sign({ id: user._id }, process.env.SECRET, {
        expiresIn: parseInt(process.env.AGE),
      });
      const respCode = 200;
      return res
        .status(respCode)
        .send(
          helper.successhelper(
            respCode,
            { token, userId: user._id },
            successPayload
          )
        );
    } catch (err) {
      const respCode = 422;
      return res
        .status(respCode)
        .send(
          helper.errorhelper(
            respCode,
            "Invalid password or email",
            errorPayload
          )
        );
    }
  } catch (err) {
    const respCode = 422;
    return res
      .status(respCode)
      .send(
        helper.errorhelper(respCode, "Invalid password or email", errorPayload)
      );
  }
});

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const { errorPayload, successPayload } = constants;

  const respCode = 422;
  if (!email || !password) {
    return res
      .status(respCode)
      .send(
        helper.errorhelper(respCode, "Invalid password or email", errorPayload)
      );
  }
  try {
    const user = new User({ email, password });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.SECRET, {
      expiresIn: parseInt(process.env.AGE),
    });
    const respCode = 200;
    return res
      .status(respCode)
      .send(
        helper.successhelper(
          respCode,
          { token, userId: user._id },
          successPayload
        )
      );
  } catch (err) {
    const respCode = 422;
    return res
      .status(respCode)
      .send(
        helper.errorhelper(respCode, "Invalid password or email", errorPayload)
      );
  }
});

module.exports = router;
