const { Expo } = require('expo-server-sdk');

const pushNotification = async (message) => {
  let expo = new Expo();
/*
  let { to: pushToken } = message;

  if (!Expo.isExpoPushToken(pushToken)) {
    console.error(`Push token ${pushToken} is not a valid Expo push token`);
    return null;
  }

  const res = await expo.sendPushNotificationsAsync(chunk);
*/
  let messages = Array.isArray(message)
    ? message
    : [message];

  const chunks = expo.chunkPushNotifications(messages);

  let tickets = [];
  for (let chunk of chunks) {
    try {
      let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    } catch (error) {
      console.log(error);
    }
  }

  let receiptIds = [];
  for (let ticket of tickets) {
    if (ticket.id) {
      receiptIds.push(ticket.id);
    }
  }

  let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);

  for (let chunk of receiptIdChunks) {
    try {
      let receipts = await expo.getPushNotificationReceiptsAsync(chunk);

      for (let receipt in receipts) {
        if (receipt.status === 'ok') {
          continue;
        } else if (receipt.status === 'error') {
          console.log(`There was an error sending a notification: ${receipt.message}`);
          if (receipt.details && receipt.details.error) {
            console.log(`The error code is ${receipt.details.error}`);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = pushNotification;