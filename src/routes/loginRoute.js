const express = require('express');
const router = express.Router();
const userHandler = require('../handlers/userHandler');
const {
  responseOk,
  responseBadRequest
} = require('../utils/responseHelper');

const postHandler = async (req, res, next) => {
  const { ok, ...result } = await userHandler.login(req.body);

  if (ok) {
    responseOk(res)(result);
  } else {
    responseBadRequest(res)(result);
  }
};

router.post('/', postHandler);

module.exports = router;
