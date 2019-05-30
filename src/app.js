const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const multer = require('multer');

const index = require('./routes/rootRoute');
const users = require('./routes/userRoute');
const login = require('./routes/loginRoute');
const constructions = require('./routes/constructionRoute');
const identities = require('./routes/identityRoute');
const reservations = require('./routes/reservationRoute');
const camera = require('./routes/cameraRoute');
const getPool = require('./models/connectPool');

global.DB = getPool;

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('uploads'));
/*
app.use(function (req, res, next) {
  console.log('debug');
  const { url, method, headers, params, query, body } = req;
  console.log({ url, method, headers, params, query, body });
  next();
});
*/
app.use('/', index);
app.use('/users', users);
app.use('/login', login);
app.use('/constructions', constructions);
app.use('/identities', identities);
app.use('/reservations', upload.array('file'), reservations);
app.use('/camera', upload.single('image'), camera);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.end();
});

module.exports = app;
