const grpc = require('@grpc/grpc-js');

const errorHandler = (err, req, res, next) => {
    console.log(`src/middleware/errorHandler.js: errorHandler: called with error: ${JSON.stringify(err)}`);
    console.error(err);

    let statusCode = 500;
    let message = 'Internal Server Error';

    if (err.code) {
        switch (err.code) {
            case grpc.status.INVALID_ARGUMENT:
                statusCode = 400;
                message = err.details || 'Invalid argument';
                break;
            case grpc.status.NOT_FOUND:
                statusCode = 404;
                message = err.details || 'Resource not found';
                break;
            case grpc.status.ALREADY_EXISTS:
                statusCode = 409;
                message = err.details || 'Resource already exists';
                break;
            case grpc.status.FAILED_PRECONDITION:
                statusCode = 412;
                message = err.details || 'Failed precondition';
                break;
            case grpc.status.UNAUTHENTICATED:
                statusCode = 401;
                message = err.details || 'Unauthenticated';
                break;
            case grpc.status.PERMISSION_DENIED:
                statusCode = 403;
                message = err.details || 'Permission denied';
                break;
            default:
                statusCode = 500;
                message = err.details || 'An unknown gRPC error occurred';
                break;
        }
    } else if (err.isJoi) { // Example for Joi validation
        statusCode = 400;
        message = err.details.map(d => d.message).join(', ');
    } else if (err.message) {
        message = err.message;
    }
    console.log(`src/middleware/errorHandler.js: errorHandler: sending response with statusCode: ${statusCode} and message: ${message}`);
    res.status(statusCode).json({ error: message });
};

module.exports = errorHandler;
