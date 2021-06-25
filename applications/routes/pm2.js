const express = require('express');
const serverDataController = require('../controllers/pm2');

const serverPm2Router = express.Router();

serverPm2Router.get('/hello', async (req, res, next) => {
    try {
        res.send(await serverDataController.getPm2Hello());
    } catch (err) {
        next(err);
    }
});

serverPm2Router.get('/version', async (req, res, next) => {
    try {
        res.send(await serverDataController.getPm2Version());
    } catch (err) {
        next(err);
    }
});

serverPm2Router.get('/jlist', async (req, res, next) => {
    try {
        res.send(await serverDataController.getJlistData());
    } catch (err) {
        next(err);
    }
});

serverPm2Router.post('/actions', async (req, res, next) => {
    try {
        res.send(await serverDataController.postActionsPm2(req));
    } catch (err) {
        next(err);
    }
});

module.exports = serverPm2Router;
