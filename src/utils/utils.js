const isEmpty = data => {
  if (!data || Object.keys(data).length === 0) return true;

  return Object.keys(data)
    .filter(item => data[item] ? data[item].length === 0 : true)
    .length > 0
};

const isEmptyArray = data => (!data || data.length === 0) ? true : false;

const upperCaseFirstLetter = word => `${word.slice(0, 1).toUpperCase()}${word.slice(1)}`;

const underLineToCamelCase = string => string.split('_')
  .map((key, index) => index > 0 ? upperCaseFirstLetter(key) : key)
  .join('');

const camelCase = data => Object.entries(data).map(
    ([key, value]) => ([underLineToCamelCase(key), value])
).reduce((pre, [key, value]) => ({...pre, [key]: value}), {});

const noMatch = data => !data || (Array.isArray(data) && data.length === 0);

const findOne = data => noMatch(data)
  ? null
  : camelCase(data[0]);

const findAll = data => noMatch(data)
  ? null
  : data.map( item => camelCase(item));

const isSuccess = res => res.constructor.name === 'OkPacket'
  ? true
  : false;

const getInsertId = res => res.insertId;

const parseRes = {
  findOne,
  findAll,
  noMatch,
  isSuccess,
  getInsertId
};

module.exports = { isEmpty, isEmptyArray, camelCase, parseRes };