var express = require('express');
const router = express.Router();
const reservationHandler = require('../handlers/reservationHandler');
const { responseOk, responseBadRequest } = require('../utils/responseHelper');

const handleGetReservations = async (req, res, next) => {

  const { ok, ...result } = await reservationHandler.getReservations(req.query);
  if (ok) {
    responseOk(res)(result);
  } else {
    responseBadRequest(res)(result);
  }
};

const handleSetReservation = async (req, res, next) => {
  const { body, files } = req;
  const { ok, ...result } = await reservationHandler.setReservation({ ...body, files });
  if (ok) {
    responseOk(res)(result);
  } else {
    responseBadRequest(res)(result);
  }
};

const handleUpdateReservation = async (req, res, next) => {
  const { reservationId } = req.params;

  const payload = { ...req.body, reservationId: parseInt(reservationId) };
  const { ok, ...result } = await reservationHandler.updateReservation(payload);
  if (ok) {
    responseOk(res)(result);
  } else {
    responseBadRequest(res)(result);
  }
};

/* GET users listing. */
router.get('/', handleGetReservations);
router.post('/', handleSetReservation);
router.patch('/:reservationId', handleUpdateReservation);

module.exports = router;
