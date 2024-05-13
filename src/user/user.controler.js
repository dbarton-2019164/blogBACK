
import User from './user.model.js';
import ErrorResponse from '../utils/errorResponse.js';

export const signup = async (req, res, next) => {
    const { email } = req.body;
    const existe = await User.findOne({ email });
    if (existe) {
        return next(new ErrorResponse("El correo ya esta registrado", 400));
    }
    try {
        const user = await User.create(req.body);
        res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        next(error);
    }
}


export const signin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email) {
            return next(new ErrorResponse("Ingrese un correo", 403));
        }
        if (!password) {
            return next(new ErrorResponse("Ingrese la contraseña", 403));
        }

        const user = await User.findOne({ email });
        if (!user) {
            return next(new ErrorResponse("Correo no registrado", 400));
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
    const options = { maxAge: 60 * 60 * 1000 } // Una hora
    console.log(token)
    res
        .status(codeStatus)
        .cookie('token', token, options)
        .json({
            success: true,
            id: user._id,
            role: user.role
        })

}

export const logout = (req, res, next) => {
    res.clearCookie('token');
    res.status(200).json({
        success: true,
        message: "Sesión cerrada"
    })
}


export const userProfile = async (req, res, next) => {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json({
        success: true,
        user
    })
}