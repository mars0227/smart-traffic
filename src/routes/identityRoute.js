var express = require('express');
const router = express.Router();
const identityHandler = require('../handlers/identityHandler');
const {
  responseOk,
  responseBadRequest
} = require('../utils/responseHelper');

const handler = async (req, res, next) => {
  const { ok, ...result } = await identityHandler.getIdentities();

  if (ok) {
    responseOk(res)(result);
  } else {
    responseBadRequest(res)(result);
  }
};
/* GET users listing. */
router.get('/', handler);

module.exports = router;
