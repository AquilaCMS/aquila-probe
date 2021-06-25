const express = require('express');

const publicRouter = express.Router();

// Background information
const systemRoute = require('./background/routes/system');
const portsRoute = require('./background/routes/ports');
const scriptsRoute = require('./background/routes/scripts');

publicRouter.use('/system', systemRoute);
publicRouter.use('/ports', portsRoute);
publicRouter.use('/scripts', scriptsRoute);

// Applications information
const pm2Route = require('./applications/routes/pm2');
const dockerRoute = require('./applications/routes/docker');

publicRouter.use('/pm2', pm2Route);
publicRouter.use('/docker', dockerRoute);


module.exports = publicRouter;
