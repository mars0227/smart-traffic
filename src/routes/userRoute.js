var express = require('express');
var router = express.Router();
const {
  responseOk,
  responseBadRequest
} = require('../utils/responseHelper');
const userHandler = require('../handlers/userHandler');

const handler = async (req, res, next) => {
  const { userId } = req.params;
  const { ok, ...result } = await userHandler.setExpoPushToken({ userId, ...req.body });

  if (ok) {
    responseOk(res)(result);
  } else {
    responseBadRequest(res)(result);
  }
};

const activeHandler = async (req, res, next) => {
  const { userId } = req.params;
  const { ok, ...result } = await userHandler.active({ userId, ...req.body });

  if (ok) {
    responseOk(res)(result);
  } else {
    responseBadRequest(res)(result);
  }
};
/* GET users listing. */
router.post('/:userId/expo_push_token', handler);

router.post('/:userId/active', activeHandler);

module.exports = router;
