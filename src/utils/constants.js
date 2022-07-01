const errorPayload = {
  httpResponseCode: 404,
  errorMessage: "",
};

const successPayload = {
  httpResponseCode: 404,
  message: "",
};

const getPayload = {
  metadata: {
    limit: 10,
    offset: 1,
    count: 10,
    // total: 1000,
    // links: {
    //   next: "",
    //   previous: "",
    // },
  },
};

module.exports = {
  errorPayload,
  getPayload,
  successPayload,
};
