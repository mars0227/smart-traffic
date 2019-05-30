const getPool = require('../src/models/connectPool');
global.DB = getPool;
const userModel = require('../src/models/user');
const identityModel = require('../src/models/identity');
const alertSwitchModel = require('../src/models/alertSwitch');
const { hashedPassword } = require('../src/utils/encryption');
const { parseRes } = require('../src/utils/utils');

const createUser = async (account, password, identity) => {
  const payload = {
    identityName: identity
  };
  try {
    const result = await identityModel.getIdentity(payload);
    const { identityId } = parseRes.findOne(result);

    const payloadForUser = {
      account,
      password: hashedPassword(password),
      identityId,
      active: 1
    };
    const createRes = await userModel.createUser(payloadForUser);

    if (!parseRes.isSuccess(createRes)) {
      console.log('create user fail');
      process.exit(1);
    }

    const userId = parseRes.getInsertId(createRes);
    const alertSwitchCreateResult = await alertSwitchModel.createAlertSwitchState({ userId });
    if (!parseRes.isSuccess(alertSwitchCreateResult)) {
      console.log('create alert switch fail');
      process.exit(1);
    }
    process.exit(0);
  }
  catch (err) {
    console.log(err);
    process.exit(1);
  }
}

const [node, filePath, username, password, identity] = process.argv;

if (username && password && identity) {
  createUser(username, password, identity);
} else console.log('please check your input');
