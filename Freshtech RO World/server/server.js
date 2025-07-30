const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log(err);
  console.log(err.name, err.message);
  console.log('Uncaught Exception 💥... Closing server!');
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB, {}).then(() => {
  console.log('connection is successfull.');
}).catch((err) => {
  console.log(err);
});

const app = require('./app');

const port = process.env.PORT || 3000;

// returning server object
const server = app.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('Unhandled Rejection 💥... Closing server!');
  server.close(() => {
    process.exit(1);
  });
});
