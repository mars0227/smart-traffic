const identityModel = require('../models/identity');

const getIdentities = async () => {
  const result = await identityModel.getIdentities();
  return {
    ok: true,
    data: result.map(item => item.identity_name)
  };
}

const identityHandler = {
  getIdentities
};

module.exports = identityHandler;