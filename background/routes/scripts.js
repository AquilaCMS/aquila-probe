const express = require('express');
const scriptsController = require('../controllers/scripts');

const scriptsRouter = express.Router();

scriptsRouter.get('/', async (req, res, next) => {
    try {
        res.send(await scriptsController.getScriptsList(req));
    } catch (err) {
        next(err);
    }
});

scriptsRouter.post('/script', async (req, res, next) => {
    try {
        res.send(await scriptsController.postScriptAction(req));
    } catch (err) {
        next(err);
    }
});

module.exports = scriptsRouter;
