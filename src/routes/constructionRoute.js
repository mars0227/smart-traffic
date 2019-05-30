var express = require('express');
const router = express.Router();
const constructionHandler = require('../handlers/constructionHandler');
const {
  responseOk,
  responseBadRequest
} = require('../utils/responseHelper');

const handler = async (req, res, next) => {
  const { ok, ...result } = await constructionHandler.getConstructions();
  if (ok) {
    responseOk(res)(result);
  } else {
    responseBadRequest(res)(result);
  }
};
/* GET users listing. */
router.get('/', handler);

module.exports = router;
