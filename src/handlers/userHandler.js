const user = require('../models/user');
const identity = require('../models/identity');

const { comparePassword } = require('../utils/encryption');
const { parseRes } = require('../utils/utils');

const accountNotFound = () => ({ ok: false, errMsg: 'account not found' });
const loginFail = () => ({ ok: false, errMsg: 'password mismatch' });

const login = async (payload) => {
  const { account, password } = payload;

  const result = await user.getUser({ account });

  const loginUser = parseRes.findOne(result);

  if (!loginUser) return accountNotFound();

  const {
    identityId,
    userId,
    password: userPassword,
    active,
    ...others
  } = loginUser;

  if (!comparePassword(password, userPassword)) {
    return loginFail();
  }

  const idResult = await identity.getIdentityName({ identityId });

  // await user.updateActiveState({ userId, active: true });

  return {
    ok: true,
    data: {
      userId,
      identity: idResult[0].identity_name,
      ...others
    }
  };
}

const setExpoPushToken = async (payload) => {
  const { userId, expoPushToken } = payload;

  const result = await user.setExpoPushToken({ userId, expoPushToken });

  if (parseRes.isSuccess(result)){
    return {
      ok: true
    };
  }

  return {
    ok: false
  };
};

const active = async (payload) => {
  const { userId, active } = payload;

  const result = await user.updateActiveState({ userId, active });

  if (parseRes.isSuccess(result)){
    return {
      ok: true
    };
  }

  return {
    ok: false
  };
};

const userHandler = {
  login,
  setExpoPushToken,
  active
};

module.exports = userHandler;