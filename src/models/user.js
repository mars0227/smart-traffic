const SQL = require('sql-template-strings');
const isEmpty = require('../utils/utils').isEmpty;
const identityHandler = require('./identity');

const getUser = async ({ account }) => {
  const sql = SQL`
    SELECT *
    FROM user
    WHERE
      email = ${account}
    LIMIT 1
  `;

  return await DB.query(sql);
};

const getUsers = async (data) => {
  const {
    identityId,
    userIds
  } = data;

  console.log('payload', data);

  const sql = SQL`
    SELECT *
    FROM user
    WHERE
  `;

  if (identityId) {
    sql.append(SQL` identity_id = ${identityId}`);
  }

  if (userIds) {
    sql.append(SQL` user_id IN (${userIds})`);
  }
  console.log('sql', sql);
  return await DB.query(sql);
};

const createUser = async (data) => {
  const {
    account,
    password,
    active,
    identityId
  } = data;

  const sql = SQL`
    INSERT INTO user (
      password,
      email,
      active,
      identity_id
    ) VALUES (
      ${password},
      ${account},
      ${active},
      ${identityId}
    )`;

  return await DB.query(sql);
};

const getUserName = async ({userIdList}) => {
  const sql = SQL`
    SELECT
      email,
      user_id
    FROM user
    WHERE
      user_id IN (${userIdList})
  `;

  return await DB.query(sql);
};

const setExpoPushToken = async (data) => {
  const {
    userId,
    expoPushToken
  } = data;

  const sql = SQL`
    UPDATE user
    SET
      expo_push_token = ${expoPushToken}
    WHERE
      user_id = ${userId}
  `;

  return await DB.query(sql);
};

const getManagerExpoPushToken = async (payload) => {
  const identities = await identityHandler.getIdentity({ identityName: 'Manager' });
  const identityId = identities[0].identity_id;

  const sql = SQL`
    SELECT
      expo_push_token
    FROM user
    WHERE
      identity_id = ${identityId}
  `;

  if (!isEmpty(payload)) {
    const {
      userId: user_id
    } = payload;
    user_id && sql.append(SQL` AND user_id = ${user_id}`);
  }
  return await DB.query(sql);
}

const getExpoPushToken = async (payload) => {
  const { userId } = payload;
  const sql = SQL`
    SELECT
      expo_push_token
    FROM user
    WHERE
      user_id = ${userId}
  `;

  return await DB.query(sql);
}

const updateActiveState = async (data) => {
  const {
    userId,
    active
  } = data;

  const activeState = active === true ? '1' : '0';

  const sql = SQL`
    UPDATE user
    SET
      active = ${activeState}
    WHERE
      user_id = ${userId}
  `;

  return await DB.query(sql);
};

const getActiveStateOfManager = async (data) => {
  // const { userId } = data;
  const sql = SQL`
    SELECT
      active
    FROM
      user
    WHERE
      identity_id = 1
  `;

  return await DB.query(sql);
};

const getManagerUserId = async (data) => {
  // const { userId } = data;
  const sql = SQL`
    SELECT
      user_id
    FROM
      user
    WHERE
      identity_id = 1
  `;

  return await DB.query(sql);
};

const user = {
  getUser,
  getUsers,
  createUser,
  getUserName,
  setExpoPushToken,
  getManagerExpoPushToken,
  getExpoPushToken,
  updateActiveState,
  getActiveStateOfManager,
  getManagerUserId
};

module.exports = user;
