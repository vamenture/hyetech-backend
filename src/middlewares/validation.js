import { httpStatusCodes } from '../utils/http-status-codes.js';
import { httpResponses } from '../utils/http-responses.js';
import { httpResponseStatus } from '../utils/httpResponseType.js';
import { getValidationErrorMessage } from '../utils/common.js';

const middleware = (schema) => {
    return (req, res, next) => {
        const reqData = { ...req.params, ...req.query, ...req.body };
        const { error } = schema.validate(reqData);
        const valid = !error;
        if (valid) {
            return next();
        }
        const errorMessage = getValidationErrorMessage(error.details);
        return res.status(httpStatusCodes.SUCCESS).json({
            statusCode: httpStatusCodes.BAD_REQUEST,
            status: httpResponses.BAD_REQUEST,
            success: false,
            message: errorMessage,
            type: httpResponseStatus.FAILURE,
        });
    };
};

export default middleware;
