const responseOk = res => data => res.send(data);
const responseBadRequest = res => data => res.status(400).send(data);

module.exports = {
  responseOk,
  responseBadRequest
};