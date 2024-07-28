const express = require('express');
const cors = require('cors');
const pino = require('pino-http')();
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const authRouter = require('./routers/auth');
const contactsRouter = require('./routers/contacts');
const { errorHandler } = require('./middlewares/errorHandlers');
const notFoundHandler = require('./middlewares/notFoundHandler');
const authenticate = require('./middlewares/authenticate');

const swaggerDocument = YAML.load('./docs/openapi.yaml');

const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(pino);
  app.use(express.json());
  app.use(cookieParser());

  app.use('/auth', authRouter);
  app.use('/contacts', authenticate, contactsRouter);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.use(notFoundHandler);
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

module.exports = { setupServer };
