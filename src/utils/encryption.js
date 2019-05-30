const crypto = require('crypto');

const CRYPTO_SETTING = {
  RANDOM_SIZE: 8,
  ITERATIONS: 2048,
  KEYLEN: 16
};

const comparePassword = (password, originalPassword) => {
  const [ salt, originHahedPassword ] = originalPassword.split('$');
  const newHashedPassword = crypto.pbkdf2Sync(password, salt, CRYPTO_SETTING.ITERATIONS, CRYPTO_SETTING.KEYLEN, 'sha512').toString('hex');
  return newHashedPassword === originHahedPassword;
};

const hashedPassword = (password) => {
  const salt = crypto.randomBytes(CRYPTO_SETTING.RANDOM_SIZE).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, CRYPTO_SETTING.ITERATIONS, CRYPTO_SETTING.KEYLEN, 'sha512').toString('hex');
  return [salt, hash].join('$');
};

module.exports = { comparePassword, hashedPassword };