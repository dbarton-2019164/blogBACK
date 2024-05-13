import ErrorResponse from '../utils/errorResponse.js';
import jwt from 'jsonwebtoken';
import User from '../user/user.model.js';



export const isAuthenticated = async (req, res, next) => {
    const { token } = req.cookies;
   
    if (!token) {
        return next(new ErrorResponse('Debes iniciar sesion', 401));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next();

    } catch (error) {
        return next(new ErrorResponse('Debes iniciar sesion', 401));
    }
}

export const isAdmin = (req, res, next) => {
    if (req.user.role === 'user') {
        return next(new ErrorResponse('Acceso denegado', 401));
    }
    next();
}