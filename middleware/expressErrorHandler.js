const CustomError = require('../utils/customError');

const expressErrorHandler = (err, req, res, next) => {
    if (err) {
        console.error(err);
        if (err instanceof CustomError) {
            return res.status(err.status).send({
                code: err.code,
                message: err.message,
            });
        }
        return res.status(500).send({
            code: 'error',
            status: 500,
            message: err.message,
        });
    }
    next();
};

module.exports = expressErrorHandler;
