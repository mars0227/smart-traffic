const reservationModel = require('../models/reservation');
const constructionModel = require('../models/construction');
const userModel = require('../models/user');
const fs = require('fs');
const pushNotification = require('../utils/expoPushNotification');
const webSocketService = require('../webSocketService');
const { parseRes, isEmptyArray } = require('../utils/utils');

const getCreaterList = reservations =>
  reservations.map(item => item.creater_id).reduce(
    (array, id) => array.includes(id) ?  array : [...array, id], []);

const replaceCreaterIdToCreaterName = ({ reservations, userNameMap }) =>
  reservations.map(item => ({ ...item, creater_name: userNameMap[item.creater_id] }));

const combineArrayToObject = array => array.reduce(
  (object, item) => ({ ...object, [item.user_id]: item.email }), {});

const createImagePath = reservations => reservations.map(
  reservation => {
    const { image, reservation_id, ...others } = reservation;
    let images = [];
    for (let i = 0; i < image; i++) {
      images.push(`${reservation_id}/${i + 1}.jpg`);
    }

    return { ...others, reservation_id, images };
  }
);

const getReservations = async (payload) => {
  const constructions = await constructionModel.getConstructions();
  const constructionsIdArray = constructions.map(item => item.construction_id);
  const result = await reservationModel.getReservations(payload);
  const reservationWithoutInactiveConstrunction = result.filter(
    item => constructionsIdArray.includes(item.construction_id)
  );

  const createrList = getCreaterList(reservationWithoutInactiveConstrunction);

  const userNameList = await userModel.getUserName({ userIdList: createrList });
  const userNameMap = combineArrayToObject(userNameList);

  const reservations = replaceCreaterIdToCreaterName({ reservations: reservationWithoutInactiveConstrunction, userNameMap });

  const data = createImagePath(reservations);

  return {
    ok: true,
    data
  };
}

const moveFile = async (files, reservationId) => {
  try {
    await fs.mkdirSync(`${files[0].destination}${reservationId}`);
    let index = 1;
    for (let file of files) {
      await fs.renameSync(file.path, `${file.destination}${reservationId}/${index}.jpg`);
      index = index + 1;
    };
  } catch (err) {
    console.log('rename picture fail', err);
  }
};

const getManagerPushToken = async () => {
  const managers = await userModel.getManagerExpoPushToken();
  const expoPushTokens = parseRes.findAll(managers);
  return expoPushTokens.map(user => user.expoPushToken).filter(item => item !== null);
}

const getPushToken = async ({userId}) => {
  const result = await userModel.getExpoPushToken({userId});
  const manager = parseRes.findOne(result);
  if (!manager) return null;
  return manager.expoPushToken;
}

const getImage = async (reservationId) => {
  const path = `uploads/${reservationId}`;
  const images = fs.readdirSync(path);

  return images.map(fileName => (`${reservationId}/${fileName}`))
}

const getReservation = async (payload) => {

  const result = await reservationModel.getReservation(payload);

  const { reservationId } = payload;
  const createrList = getCreaterList(result);

  const userNameList = await userModel.getUserName({ userIdList: createrList });

  const userNameMap = combineArrayToObject(userNameList);

  const reservation = replaceCreaterIdToCreaterName({ reservations: result, userNameMap });

  const images = await getImage(reservationId);
  return {
    ok: true,
    data: {
      ...reservation[0],
      images
    }
  };
}

const setReservation = async (data) => {
  const {
    createrId,
    construction,
    date,
    timeSlot,
    licensePlateNumber,
    material,
    files
  } = data;

  try {
    const result = await constructionModel.getConstruction({ constructionName: construction });
    const constructionObj = parseRes.findOne(result);

    const { constructionId } = constructionObj;

    const payload = {
      createrId,
      constructionId,
      date,
      timeSlot,
      licensePlateNumber,
      material,
      image: files.length
    };

    const createResult = await reservationModel.createReservation(payload);

    if (!parseRes.isSuccess(createResult)) return { ok: false };

    const reservationId = parseRes.getInsertId(createResult);

    // save reservation picture with reservation id
    await moveFile(files, reservationId);

    // send notification to manager (need refact)
    const newReservationRes = await getReservation({ reservationId });

    const { ok, data } = newReservationRes;

    if (ok) {
      try {
        const pushTokens = await getManagerPushToken();

        if (!isEmptyArray(pushTokens)) {
          const title = 'New Reservation';
          const body = `${construction}
${date} ${timeSlot}
${data.creater_name} / ${material}`;
      
          const messages = pushTokens.map(token => ({
            to: token,
            title,
            body,
            data: {
              type: 'newReservation',
              title,
              body,
              data
            }
          }));

          await pushNotification(messages);
        }
      } catch (err) {
        console.log(err);
      }
    }

    try {
      const webSocketPaylaod = webSocketService.actions.newReservationAction(data);
      webSocketService.broadcast(webSocketPaylaod);
    } catch (err) {
      console.log('webSocket send error', err);
    }

    return { ok: true };
  } catch (err) {
    // TODO: delete file if exist
    return { ok: false };
  }
}

const updateReservation = async (data) => {
  const {
    reservationId,
    state,
    userId
  } = data;

  const payload = {
    reservationId,
    state,
    userId
  };

  try {
    await reservationModel.updateReservation(payload);

    if (state === 'Accepted' || state === 'Refused') {
      const result = await reservationModel.getReservation({ reservationId });
      const { constructionId, createrId } = parseRes.findOne(result);
      const constructionResult = await constructionModel.getConstructionName({ constructionId });
      const { constructionName } = parseRes.findOne(constructionResult);
      const pushToken = await getPushToken({ userId: createrId });

      if (pushToken) {
        const title = `Reservation ${state}`;
        const body = constructionName;
        const message = {
          to: pushToken,
          title,
          body,
          data: {
            type: 'updateReservation',
            title,
            body,
            data: payload
          }
        }

        await pushNotification(message);
      }
    }

    const webSocketPaylaod = webSocketService.actions.updateReservationAction(payload);
    webSocketService.broadcast(webSocketPaylaod);

    return { ok: true };
  } catch (err) {
    return { ok: false };
  }
}

const reservationHandler = {
  getReservations,
  setReservation,
  updateReservation
};

module.exports = reservationHandler;