const mongoose = require("mongoose");

const pricingSchema = new mongoose.Schema({
  storeId: {
    type: String,
    required: true,
  },
  sku: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    default: "",
  },
  price: {
    type: Number,
    default: 0,
  },
  date: {
    type: String,
    default: () => new Date().toISOString().split("T")[0],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

mongoose.model("Price", pricingSchema);
