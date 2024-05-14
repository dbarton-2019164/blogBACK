
const User = require('../models/userModel');
const ErrorResponse = require('../utils/errorResponse');

exports.signup = async (req, res, next) => {
    const { email } = req.body;
    const userExist = await User.findOne({ email });
    if (userExist) {
        return next(new ErrorResponse("Correo ya registrado", 400));
    }
    try {
        const user = await User.create(req.body);
        res.status(201).json({
            success: true,
            user
        })
    } catch (error) {
        next(error);
    }
}


exports.signin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        //validation
        if (!email) {
            return next(new ErrorResponse("Ingresa un correo", 403));
        }
        if (!password) {
            return next(new ErrorResponse("Ingresa una contraseña", 403));
        }

   
        const user = await User.findOne({ email });
        if (!user) {
            return next(new ErrorResponse("Cuenta no encontrada", 400));
        }
       
        const isMatched = await user.comparePassword(password);
        if (!isMatched) {
            return next(new ErrorResponse("Contraseña incorrecta", 400));
        }

        sendTokenResponse(user, 200, res);
    } catch (error) {
        next(error);
    }
}

const sendTokenResponse = async (user, codeStatus, res) => {
    const token = await user.getJwtToken();
    const options = { maxAge: 60 * 60 * 1000, httpOnly: true }
    
    res
        .status(codeStatus)
        .cookie('token', token, options)
        .json({
            success: true,
            id: user._id,
            role: user.role,
            token: token 
        });
};


exports.logout = (req, res, next) => {
    res.clearCookie('token');
    res.status(200).json({
        success: true,
        message: "Sesion cerrada"
    })
}


exports.userProfile = async (req, res, next) => {
     const u = await User.findOne({ email: 'admin@gmail.com' });
    
    const user = await User.findById(u.id).select('-password');
    res.status(200).json({
        success: true,
        user
    })
}
