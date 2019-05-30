
const client = [];

const addClient = (id, ref) => {
  const oldClient = client.find(cl => cl.id === id);
  if (oldClient) removeClient(id);
  client.push({ id, ref })
};

const getClient = id => {
  const cli = client.find(cl => cl.id === id);
  if (!cli) return false;
  return cli.ref;
};

const removeClient = id => {
  const index = client.findIndex(cli => cli.id === id);
  if (index !== -1) client.splice(index, 1);
};

const broadcast = message => client.forEach(
  ws => {
    try {
      ws.ref.send(message);
    } catch (err) {
      console.log('send websocket error', err);
    }
  }
);

const genPayload = (type, data) => (JSON.stringify({ type, data }));

const updateMonitorViewAction = payload => genPayload('updateMonitorView', payload);

const newReservationAction = payload => genPayload('newReservation', payload);

const updateReservationAction = payload => genPayload('updateReservation', payload);

const healthCheckResponseAction = () => genPayload('healthCheck', 'alive');

module.exports = {
  addClient,
  removeClient,
  getClient,
  broadcast,
  actions: {
    updateMonitorViewAction,
    newReservationAction,
    updateReservationAction,
    healthCheckResponseAction,
  }
};