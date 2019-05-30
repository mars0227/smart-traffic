const fs = require('fs');

const alertSwitchModel = require('../models/alertSwitch');
const userModel = require('../models/user');
const pushNotification = require('../utils/expoPushNotification');
const webSocketService = require('../webSocketService');
const { parseRes, isEmptyArray } = require('../utils/utils');

const modifyFileName = async (file, newName) => {
  try {

    await fs.renameSync(file.path, `uploads/${newName}`);
  } catch (err) {
    console.log('rename picture fail', err);
  }
};

const removeOldImage = async () => {
  try {
    const imageList = await fs.readdirSync('uploads');
    const oldFile = imageList.filter(imageName => imageName.includes('image-'))[0];
    await fs.unlinkSync(`uploads/${oldFile}`);
  } catch (err) {
    console.log('delete old camera image failed', err);
  }
};

const uploadImage = async (data) => {
  const {
    carNumber,
    file,
    alert
  } = data;

  if (carNumber === undefined) {
    console.log('debug missing carNumber', data);
    return { ok: false, result: 'missing parameter [carNumber]' };
  }

  if (file === undefined) {
    console.log('debug missing file', data);
    return { ok: false, result: 'missing image' };
  }

  try {
    const time = Date.now();
    await removeOldImage();

    const newImageName = `image-${carNumber}-${time}.jpg`;

    await modifyFileName(file, newImageName);

    if (alert === 'true') {
      const activeUsers = await alertSwitchModel.getActiveUsers();
      const userIds = parseRes.findAll(activeUsers).map(activeUser => activeUser.userId);
      const users = await userModel.getUsers({userIds});

      const expoPushTokens = parseRes.findAll(users)
        .map(user => user.expoPushToken)
        .filter(i => i);

      if (!isEmptyArray(expoPushTokens)) {
        try {
          const title = 'Traffic Congestion';
          const body = `${carNumber} cars in the construction site`;

          const messages = expoPushTokens.map(
            token => ({
              to: token,
              title,
              body,
              data: {
                type: 'alertTrafficCongestion',
                title,
                body
              }
            })
          );

          await pushNotification(messages);
          for (let userId of userIds) {
            await alertSwitchModel.updateAlertSwitchState({ userId, state: false });
          }
        } catch (err) {
          console.log(err);
        }
      }
    }

    const payload = {
      carNumber,
      image: newImageName
    };

    const webSocketPaylaod = webSocketService.actions.updateMonitorViewAction(payload);
    webSocketService.broadcast(webSocketPaylaod);

    return { ok: true };
  } catch (err) {
    // TODO: delete file if exist
    return { ok: false };
  }
}

const getCarNumberFromImageName = fileName => fileName.split('-')[1];
const filterState = data => data[0].active === 1 ? true : false;

const getImage = async (data) => {
  const { userId } = data;

  try {
    const imageList = await fs.readdirSync('uploads');

    const fileName = imageList.filter(imageName => imageName.includes('image-'))[0];
    const carNumber = getCarNumberFromImageName(fileName);

    const result = await alertSwitchModel.getAlertSwitchState({ userId });

    const alertSwitchState = filterState(result);

    return {
      ok: true,
      data: {
        carNumber,
        image: fileName,
        alertSwitchState
      }
    };
  } catch (err) {
    // TODO: delete file if exist
    return { ok: false };
  }
}


const updateAlertState = async (data) => {
  const { alertSwitchState, userId } = data;
  const payload = {
    userId,
    state: alertSwitchState
  };
  try {
    const result = await alertSwitchModel.updateAlertSwitchState(payload);
    if (!parseRes.isSuccess(result)) return { ok: false, errMsg: 'db update failed' };
    return { ok: true };
  } catch (err) {
    // TODO: delete file if exist
    return { ok: false };
  }
}

const cameraHandler = {
  uploadImage,
  getImage,
  updateAlertState
};

module.exports = cameraHandler;