import 'zone.js/dist/zone-node';
import 'reflect-metadata';

import { renderModuleFactory } from '@angular/platform-server';
import { enableProdMode } from '@angular/core';

import * as compression from 'compression';
import * as express from 'express';
import { join } from 'path';
import { readFileSync } from 'fs';

import * as session from 'express-session';
import * as bodyParser from 'body-parser';
import * as mongo from 'connect-mongo';
import * as mongoose from 'mongoose';
import * as expressValidator from 'express-validator';
import * as bluebird from 'bluebird';
import config from './api/config/config';
// Import Router
import router from './api/routes';

const MongoStore = mongo(session);

enableProdMode();

const app = express();

// Connect to MongoDB
const mongoUrl = config.MONGODB_URI_LOCAL;
(<any>mongoose).Promise = bluebird;
mongoose.connect(mongoUrl, {useMongoClient: true}).then(
  () => {
    /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
    console.log('Connected to Database');
  },
).catch(err => {
  console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err);
  // process.exit();
});


const PORT = process.env.PORT || 4200;
const DIST_FOLDER = join(process.cwd(), 'dist');

const template = readFileSync(join(DIST_FOLDER, 'browser', 'index.html')).toString();

const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('./dist/server/main');

// Import module map for lazy loading
const { provideModuleMap } = require('@nguniversal/module-map-ngfactory-loader');

app.engine('html', (_, options, callback) => {
  renderModuleFactory(AppServerModuleNgFactory, {
    document: template,
    url: options.req.url,
    // DI so that we can get lazy-loading to work differently (since we need it to just instantly render it)
    extraProviders: [
      provideModuleMap(LAZY_MODULE_MAP)
    ]
  }).then(html => {
    callback(null, html);
  });
});

/**
 * Primary app routes.
 */
app.use('/api/v1/', router);

app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, 'browser'));

app.use(compression());

app.get('*.*', express.static(join(DIST_FOLDER, 'browser')));

app.get('*', (req, res) => {
  res.render(join(DIST_FOLDER, 'browser', 'index.html'), { req });
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Define Error Handlers
app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);

function logErrors(err, req, res, next) {
  console.error(err.stack);
}

function clientErrorHandler (err, req, res, next) {
  if (req.xhr) {
    res.status(500).send({ error: 'Something failed!' });
  } else {
    next(err);
  }
}

function errorHandler (err, req, res, next) {
  res.status(500).json({ error: err });
}

app.use(expressValidator());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: config.SESSION_SECRET,
  store: new MongoStore({
    url: mongoUrl,
    autoReconnect: true
  })
}));

app.listen(PORT, () => {
  console.log(`Node server listening on http://localhost:${PORT}`);
});
