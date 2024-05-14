const ErrorResponse = require('../utils/errorResponse');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');



exports.isAuthenticated = async (req, res, next) => {
    try {
        
        const token = req.headers.authorization;

      
        if (!token) {
            throw new Error('Token vacio');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const userId = decoded.id;

        const user = await User.findById(userId);

        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        req.user = user;

        next();
    } catch (error) {
        return next(new ErrorResponse('Debes iniciar sesion', 401));
    }
}
exports.isAdmin = (req, res, next) => {
    if (req.user.role === 'user') {
        return next(new ErrorResponse('Acceso denegado', 401));
    }
    next();
}