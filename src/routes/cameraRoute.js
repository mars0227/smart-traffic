var express = require('express');
const router = express.Router();
const cameraHandler = require('../handlers/cameraHandler');
const { responseOk, responseBadRequest } = require('../utils/responseHelper');

const handleUploadImage = async (req, res, next) => {
  const { body, file } = req;
  const { ok, ...result } = await cameraHandler.uploadImage({ ...body, file });
  if (ok) {
    responseOk(res)(result);
  } else {
    responseBadRequest(res)(result);
  }
};

const handleGetMonitorView = async (req, res, next) => {
  const { ok, ...result } = await cameraHandler.getImage(req.query);
  if (ok) {
    responseOk(res)(result);
  } else {
    responseBadRequest(res)(result);
  }
};

const handleUpdateAlertState = async (req, res, next) => {
  const { ok, ...result } = await cameraHandler.updateAlertState(req.body);
  if (ok) {
    responseOk(res)(result);
  } else {
    responseBadRequest(res)(result);
  }
};

/* GET users listing. */
router.post('/', handleUploadImage);
router.get('/', handleGetMonitorView);
router.patch('/alert', handleUpdateAlertState);

module.exports = router;
