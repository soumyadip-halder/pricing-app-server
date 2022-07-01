const errorhelper = (respCode, errorMessage, errorPayload = {}) => {
  Object.keys(errorPayload).forEach((p) => delete p);
  errorPayload.httpResponseCode = respCode;
  errorPayload.errorMessage = errorMessage;
  return { ...errorPayload };
};

const successhelper = (respCode, message, successPayload1 = {}) => {
  const successPayload = {};
  successPayload.httpResponseCode = respCode;
  successPayload.message = "Request completed successfully";
  for (keys in message) {
    successPayload[keys] = message[keys];
  }
  return { ...successPayload };
};

const getSuccessHelper = (respCode, metadata, data, getPayload) => {
  Object.keys(getPayload).forEach((p) => delete p);
  getPayload.httpResponseCode = respCode;
  getPayload.message = "Request completed successfully";
  getPayload[Object.keys(data)] = Object.values(data)[0];
  getPayload.metadata = metadata;
  return { ...getPayload };
};

module.exports = {
  errorhelper,
  successhelper,
  getSuccessHelper,
};
