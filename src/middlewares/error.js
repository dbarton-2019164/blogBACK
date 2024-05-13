import ErrorResponse from '../utils/errorResponse';

const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    if (err.name === "CastError") {
        const message = `Error ${err.value}`;
        error = new ErrorResponse(message, 404);
    }


    if (err.code === 11000) {
        const message = "Valor del campo duplicado";
        error = new ErrorResponse(message, 400);
    }

    //Mongoose validation error
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors).map(val => ' ' + val.message);
        error = new ErrorResponse(message, 400);
    }

    res.status(error.codeStatus || 500).json({
        success: false,
        error: error.message || "Error del servidor"
    })

}

module.exports = errorHandler;