require("dotenv").config();
require("./model/User");
require("./model/Pricing");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const requireAuth = require("./middleware/requireAuth");
const loginRoutes = require("./routes/loginRoutes");
const pricingRoutes = require("./routes/pricingRoutes");
const constants = require("./utils/constants");
const helper = require("./utils/helper");
const app = express();
const PORT = process.env.PORT || 1300;
app.use(cors());
app.use(express.json());
app.use(loginRoutes);
app.use(pricingRoutes);

mongoose.connect(
  process.env.CONNECTIONURL.replace("{DBNAME}", process.env.DBNAME),
  () => {
    app.listen(PORT, () => {
      console.log(`Server started and listening at port: ${PORT}`);
    });
  }
);
mongoose.connection.on("connected", () => {
  console.log("MongoDB database connection successful");
});
mongoose.connection.on("error", (error) => {
  console.log("MongoDB connection error: ", error.message);
});
mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

app.get("/health", requireAuth, (req, res) => {
  const { successPayload } = constants;
  const respCode = 200;
  return res
    .status(respCode)
    .send(
      helper.successhelper(
        respCode,
        { message: "All good", userId: req.user._id },
        successPayload
      )
    );
});
