const express = require('express');
const serverPortController = require('../controllers/ports');

const serverPortRouter = express.Router();

serverPortRouter.get('/', async (req, res, next) => {
    try {
        res.send(await serverPortController.getPorts());
    } catch (err) {
        next(err);
    }
});

module.exports = serverPortRouter;
