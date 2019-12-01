const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors')

const indexRouter = require('./server/routes/index');
const usersRouter = require('./server/routes/api/users')
const projectsRouter = require('./server/routes/api/projects');
const projectBackersRouter = require('./server/routes/api/projectBackers');
const secondaryBackersRouter = require('./server/routes/api/secondaryBackers');


// Set up the express app
const app = express();

app.use(cors())

// Log requests to the console.
app.use(logger('dev'));



// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads/', express.static('uploads'))
app.use('/api/users', usersRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/projectBackers', projectBackersRouter);
app.use('/api/secondaryBackers', secondaryBackersRouter);

// Setup a default catch-all route that sends back a welcome message in JSON format.
app.get('*', (req, res) => res.status(200).send({
  message: 'Welcome to the beginning of nothingness.',
}));

module.exports = app;
