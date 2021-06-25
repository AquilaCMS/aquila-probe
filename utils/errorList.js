const CustomError = require('./customError');

module.exports = class CustomErrors {
    static makeErrorAlias(err, code, message) {
        return new CustomError(err.status, code, message);
    }

    static get NotFound() {
        return new CustomError(404, 'NotFound');
    }
    static get InputFileNotFound() {
        return this.makeErrorAlias(this.NotFound, 'NotFound', "input file doesn't exists");
    }
};
