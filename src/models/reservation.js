const SQL = require('sql-template-strings');
const isEmpty = require('../utils/utils').isEmpty;

const stateMapping = {
  Created: 1,
  Accepted: 2,
  Refused: 3,
  Canceled: 4
};

const getReservations = async (payload) => {
  const sql = SQL`
    SELECT *
    FROM reservation
  `;

  if (!isEmpty(payload)) {
    sql.append(SQL` WHERE`);
    const {
      userId: creater_id,
      state
    } = payload;
    creater_id && sql.append(SQL` creater_id = ${creater_id}`);
    state && sql.append(SQL` state = ${stateMapping[state]}`);
  }

  return await DB.query(sql);
};

const createReservation = async (payload) => {
  const {
    createrId,
    constructionId,
    date,
    timeSlot,
    licensePlateNumber,
    material,
    image
  } = payload;

  const sql = SQL`
    INSERT INTO reservation (
      creater_id,
      construction_id,
      date,
      time_slot,
      license_plate_number,
      material,
      image
    ) VALUES (
      ${createrId},
      ${constructionId},
      ${date},
      ${timeSlot},
      ${licensePlateNumber},
      ${material},
      ${image}
    )`;

  return await DB.query(sql);
};

const updateReservation = async (payload) => {
  const { state, reservationId, userId } = payload; 

  const sql = SQL`
    UPDATE reservation
    SET
      state = ${stateMapping[state]},
      reviewer_id = ${userId}
    WHERE
      reservation_id = ${reservationId}
  `;

  return await DB.query(sql);
};

const getReservation = async ({ reservationId }) => {
  const sql = SQL`
    SELECT *
    FROM reservation
    WHERE
      reservation_id = ${reservationId}
  `;

  return await DB.query(sql);
};

const reservation = {
  getReservations,
  createReservation,
  updateReservation,
  getReservation
};

module.exports = reservation;
