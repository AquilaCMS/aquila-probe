/**
 * Some of the error code specified inside this error class
 * use the WebDav extension define in the RFC4918
 * https://tools.ietf.org/html/rfc4918 who extends the RFC7231
 * defined here : https://tools.ietf.org/html/rfc7231
 */

const inspect = Symbol.for('nodejs.util.inspect.custom');

/**
 * Custom Error class implementation.
 * Do not instantiate directly, create a new entry in CustomErrors instead.
 *
 * @class CustomError
 * @property {number} this.status HTTP status
 * @property {string} [this.code] Error code
 */
module.exports = class CustomError extends Error {
    /**
     * CustomError class to generate custom error to work with HTTP
     *
     * @constructor
     * @param {number} status HTTP status
     * @param {string} code Error code
     * @param {string} [message=undefined] Free form optional error message
     */
    constructor(status, code, message = '') {
        Error.stackTraceLimit = 10;

        super(message);
        this.name = 'CustomError';

        Error.captureStackTrace(this, CustomError);

        Object.defineProperty(this, 'status', {
            value: status,
            writable: false,
            enumerable: false,
        });

        Object.defineProperty(this, 'code', {
            value: code,
            writable: false,
            enumerable: false,
        });

        Object.defineProperty(this, 'message', {
            value: message,
            writable: true,
            enumerable: false,
        });
    }

    details(message) {
        this.message = message;
        return this;
    }

    // override JSON.stringify format to include safe innumerable types
    toJSON() {
        return {
            status: this.status,
            code: this.code,
            message: this.message,
        };
    }

    /**
     * used by console.log to format an instance
     * @see https://nodejs.org/docs/latest-v10.x/api/util.html#util_util_inspect_custom
     */
    [inspect]() {
        let msg = '';
        if (this.message) {
            msg = `: ${this.message}`;
        }

        // remove the first line from the stack to replace it with a custom format
        let stack = '';
        if (this && this.stack) {
            stack = this.stack.substring(this.stack.indexOf('\n') + 1);
        }

        return `${this.name} [HTTP ${this.status}] ${this.code}${msg}\n${stack}`;
    }
};
