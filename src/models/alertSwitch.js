const SQL = require('sql-template-strings');

const getAlertSwitchState = async (data) => {
  const {
    userIds,
    userId
  } = data;

  const sql = SQL`
    SELECT *
    FROM alert_switch
  `;

  userIds && sql.append(SQL` WHERE user_id IN (${userIds})`);
  userId && sql.append(SQL` WHERE user_id = (${userId})`);

  return await DB.query(sql);
};

const updateAlertSwitchState = async ({userId, state}) => {
  const stateMapping = {
    '1': true,
    '0': false
  };
  const active = Object.entries(stateMapping).filter(([key, value]) => value === state)[0][0];

  const sql = SQL`
  UPDATE alert_switch
  SET
    active = ${active}
  WHERE
    user_id = ${userId}
  `;

  return await DB.query(sql);
};

const getActiveUsers = async () => {
  const sql = SQL`
    SELECT *
    FROM alert_switch
    WHERE
      active = 1
  `;

  return await DB.query(sql);
};

const createAlertSwitchState = async (data) => {
  const { userId } = data;
  const sql = SQL`
  INSERT INTO alert_switch (
    user_id
  ) VALUES (
    ${userId}
  )`;

  return await DB.query(sql);
};

const alertSwitch = {
  getAlertSwitchState,
  createAlertSwitchState,
  updateAlertSwitchState,
  getActiveUsers
};

module.exports = alertSwitch;
