const express = require('express');
const serverDockerController = require('../controllers/docker');

const serverDockerRouter = express.Router();

serverDockerRouter.get('/hello', async (req, res, next) => {
    try {
        res.send(await serverDockerController.getDockerHello());
    } catch (err) {
        next(err);
    }
});

serverDockerRouter.get('/version', async (req, res, next) => {
    try {
        res.send(await serverDockerController.getDockerVersion());
    } catch (err) {
        next(err);
    }
});

serverDockerRouter.get('/infos', async (req, res, next) => {
    try {
        res.send(await serverDockerController.getDockerInformations());
    } catch (err) {
        next(err);
    }
});

serverDockerRouter.post('/actions', async (req, res, next) => {
    try {
        res.send(await serverDockerController.postDockerActions(req));
    } catch (err) {
        next(err);
    }
});

module.exports = serverDockerRouter;
