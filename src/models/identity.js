const SQL = require('sql-template-strings');

const getIdentities = async () => {
  const sql = SQL`
    SELECT *
    FROM identity
  `;

  return await DB.query(sql);
};

const getIdentity = async ({ identityName }) => {
  const sql = SQL`
    SELECT *
    FROM identity
    WHERE
      identity_name = ${identityName}
  `;

  return await DB.query(sql);
};

const getIdentityName = async ({identityId}) => {
  const sql = SQL`
    SELECT *
    FROM identity
    WHERE
      identity_id = ${identityId}
  `;

  return await DB.query(sql);
};

const identity = {
  getIdentities,
  getIdentity,
  getIdentityName
};

module.exports = identity;
