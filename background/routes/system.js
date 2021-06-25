const express = require('express');
const serverDataController = require('../controllers/system');

const serverDataRouter = express.Router();

serverDataRouter.get('/static', async (req, res, next) => {
    try {
        res.send(await serverDataController.getStaticSystemInformations());
    } catch (err) {
        next(err);
    }
});

serverDataRouter.get('/dynamic', async (req, res, next) => {
    try {
        res.send(await serverDataController.getDynamicSystemInformations());
    } catch (err) {
        next(err);
    }
});

module.exports = serverDataRouter;
