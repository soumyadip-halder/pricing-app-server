const constants = require("../utils/constants");
const helper = require("../utils/helper");

const pagination = (data, filtered = "") => {
  return async (req, res, next) => {
    let { offset = 1, limit = 1000 } = req.query;
    const querystring = {};
    const queryparams = req.query;
    for (key in queryparams) {
      if (key !== "offset" && key !== "limit") {
        if (typeof queryparams[key] === "object") {
          if (key === "price" || key === "date") {
            const value = queryparams[key][queryparams[key].length - 1];
            querystring[key] = { $gte: value };
          } else {
            querystring[key] = queryparams[key][queryparams[key].length - 1];
          }
        } else {
          if (key === "price" || key === "date") {
            querystring[key] = { $gte: queryparams[key] };
          } else {
            querystring[key] = queryparams[key];
          }
        }
      }
    }
    offset = parseInt(offset);
    limit = parseInt(limit);
    const start = (offset - 1) * limit;
    const end = offset * limit;
    const { errorPayload } = constants;
    try {
      let results;
      if (filtered !== "") {
        const { userId } = req.params;
        results = await data
          .find({ userId, ...querystring })
          .limit(limit)
          .skip(start)
          .exec();
      } else {
        results = await data.find(querystring).limit(limit).skip(start).exec();
      }
      const respCode = 200;
      const metadata = { count: results.length, limit, offset };
      res.paginatedData = { respCode, metadata, results };
      next();
    } catch (err) {
      const respCode = 500;
      return res
        .status(respCode)
        .send(
          helper.errorhelper(respCode, "Internal server error", errorPayload)
        );
    }
  };
};

module.exports = pagination;
