import { httpStatusCodes } from './http-status-codes.js';
import { httpResponses } from './http-responses.js';
import { httpResponseStatus } from './httpResponseType.js';
import { serverResponseMessage } from '../config/message.js';

export const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
            .catch((err) => {
                const statusCode = err.code || httpStatusCodes.INTERNAL_SERVER_ERROR;
                const message = err.message || serverResponseMessage.RECORD_DOES_NOT_EXIST;

                return res.status(statusCode).json({
                    statusCode: statusCode,
                    status: httpResponses.ERROR,
                    success: false,
                    message: message,
                    type: httpResponseStatus.ERROR,
                });
            });
    };
};
