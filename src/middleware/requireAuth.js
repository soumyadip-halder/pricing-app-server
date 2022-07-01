const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const helper = require("../utils/helper");
const constants = require("../utils/constants");
const User = mongoose.model("User");

const requireAuth = (req, res, next) => {
  const { authorization } = req.headers;
  const { errorPayload } = constants;
  if (!authorization) {
    const respCode = 401;
    return res
      .status(respCode)
      .send(
        helper.errorhelper(respCode, "You must be logged in", errorPayload)
      );
  }
  const token = authorization.replace("Bearer ", "");
  jwt.verify(
    token,
    process.env.SECRET,
    { maxAge: parseInt(process.env.AGE) },
    async function (err, data) {
      if (err) {
        const respCode = 401;
        return res
          .status(respCode)
          .send(
            helper.errorhelper(respCode, "You must be logged in", errorPayload)
          );
      }
      const { id } = data;
      try {
        const user = await User.findById(id);
        if (!user) {
          const respCode = 401;
          return res
            .status(respCode)
            .send(
              helper.errorhelper(
                respCode,
                "User is not signed up in the application",
                errorPayload
              )
            );
        }
        req.user = user;
        next();
      } catch (err) {
        const respCode = 500;
        return res
          .status(respCode)
          .send(
            helper.errorhelper(respCode, "Internal server error", errorPayload)
          );
      }
    }
  );
};

module.exports = requireAuth;
