const express = require("express");
const mongoose = require("mongoose");
const requireAuth = require("../middleware/requireAuth");
const pagination = require("../middleware/pagination");
const Price = mongoose.model("Price");
const constants = require("../utils/constants");
const helper = require("../utils/helper");
const router = express.Router();

router.use(requireAuth);

router.get("/prices", pagination(Price), async (req, res) => {
  const { respCode, metadata, results } = res.paginatedData;
  const { getPayload } = constants;
  return res
    .status(respCode)
    .send(
      helper.getSuccessHelper(
        respCode,
        metadata,
        { pricings: results },
        getPayload
      )
    );
});

router.get("/prices/:userId", pagination(Price, "yes"), async (req, res) => {
  const { respCode, metadata, results } = res.paginatedData;
  const { getPayload } = constants;
  return res
    .status(respCode)
    .send(
      helper.getSuccessHelper(
        respCode,
        metadata,
        { pricings: results },
        getPayload
      )
    );
});

router.get("/price/:id", async (req, res) => {
  const { id } = req.params;
  const { errorPayload, successPayload } = constants;
  if (!id || id.trim() === "") {
    const respCode = 422;
    return res
      .status(respCode)
      .send(
        helper.errorhelper(
          respCode,
          "Missing id in the query param",
          errorPayload
        )
      );
  }
  try {
    const price = await Price.findById(id);
    const respCode = 200;
    return res
      .status(respCode)
      .send(
        helper.successhelper(respCode, { pricings: price }, successPayload)
      );
  } catch (err) {
    const respCode = 404;
    return res
      .status(respCode)
      .send(helper.errorhelper(respCode, "Product not found", errorPayload));
  }
});

router.patch("/price/:id", async (req, res) => {
  const { id } = req.params;
  const { storeId, sku, name, price, date } = req.body;
  const { errorPayload, successPayload } = constants;
  if (!id || id.trim() === "") {
    const respCode = 422;
    return res
      .status(respCode)
      .send(
        helper.errorhelper(
          respCode,
          "Missing id in the query param",
          errorPayload
        )
      );
  }
  try {
    const priceUp = await Price.findOneAndUpdate(
      { _id: id },
      { $set: { storeId, sku, name, price, date } },
      { new: true }
    );
    const respCode = 202;
    return res
      .status(respCode)
      .send(
        helper.successhelper(respCode, { results: priceUp }, successPayload)
      );
  } catch (err) {
    const respCode = 404;
    return res
      .status(respCode)
      .send(helper.errorhelper(respCode, "Product not found", errorPayload));
  }
});

router.post("/prices", async (req, res) => {
  let data = req.body;
  const { errorPayload, successPayload } = constants;
  const { _id } = req.user;
  data = data.map((d) => {
    return {
      ...d,
      userId: _id,
    };
  });
  try {
    const prices = await Price.insertMany(data);
    const respCode = 201;
    return res
      .status(respCode)
      .send(
        helper.successhelper(respCode, { results: prices }, successPayload)
      );
  } catch (err) {
    const respCode = 500;
    return res
      .status(respCode)
      .send(
        helper.errorhelper(respCode, "Internal server error", errorPayload)
      );
  }
});

module.exports = router;
