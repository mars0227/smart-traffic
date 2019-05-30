const SQL = require('sql-template-strings');

const getConstructions = async () => {
  const sql = SQL`
    SELECT *
    FROM construction
    WHERE
      active = 1
  `;

  return await DB.query(sql);
};

const getConstruction = async ({constructionName}) => {
  const sql = SQL`
    SELECT *
    FROM construction
    WHERE
      construction_name = ${constructionName}
  `;

  return await DB.query(sql);
};

const getConstructionName = async ({constructionId}) => {
  const sql = SQL`
    SELECT construction_name
    FROM construction
    WHERE
      construction_id = ${constructionId}
  `;

  return await DB.query(sql);
};

const construction = {
  getConstructions,
  getConstruction,
  getConstructionName
};

module.exports = construction;
