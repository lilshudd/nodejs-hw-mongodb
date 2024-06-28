const express = require('express');
const cors = require('cors');
const pino = require('pino-http')();
const contactsRouter = require('./routes/contacts');

const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(pino);

  app.use('/contacts', contactsRouter);

  app.use((req, res) => {
    res.status(404).json({ status: 404, message: 'Not found' });
  });

  app.use((err, req, res) => {
    const statusCode = err.status || 500;
    res.status(statusCode).json({ status: statusCode, message: err.message });
  });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

module.exports = { setupServer };
