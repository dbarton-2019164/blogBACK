
import bcrypt from "bcryptjs"
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        trim: true, //Borra espacios extras a lfinal
        required: [true, 'El nombre es necesario'],
        maxlength: 32,
    },

    email: {
        type: String,
        trim: true,
        required: [true, 'El correo es necesario'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, // para ver ques ea valido y un dominio de 2-3
            'Correo invalido'
        ]
    },
    password: {
        type: String,
        trim: true,
        required: [true, 'La contraseña es necesaria'],
        minlength: [6, 'La contraseña debe tener como minimo 6 caracteres'],
    },

    role: {
        type: String,
        default: 'user'
    }
}, { timestamps: true }) // Para que marque cuando lo cree y cuando actualice


//encriptar
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10)
})


// comparar las contrasenias
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

// token
userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
        expiresIn: 3600 //una hora del token
    });
}


export default mongoose.model('User', userSchema);