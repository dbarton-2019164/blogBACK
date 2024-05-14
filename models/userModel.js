const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({

    name: {
        type: String,
        trim: true,
        required: [true, 'El nombre es obligatorio'],
        maxlength: 32,
    },

    email: {
        type: String,
        trim: true,
        required: [true, 'El correo es obligatorio'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, // la cosa para que sea valido y el dominio
            'Ingresa un correo valido'
        ]
    },
    password: {
        type: String,
        trim: true,
        required: [true, 'La contraseña es obligatoria'],
        minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
    },

    role: {
        type: String,
        default: 'user'
    }
}, { timestamps: true })


//encrypting 
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10)
})



userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}


userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
        expiresIn: 3600
    });
}


userSchema.statics.createDefaultAdmin = async function () {
    try {
        const existingAdmin = await this.findOne({ email: 'admin@gmail.com' });
        if (!existingAdmin) {
            const admin = new this({
                name: 'admin',
                email: 'admin@gmail.com',
                password: 'administrador',
                role: 'admin'
            });
            await admin.save();
           
        } else {
            
        }
    } catch (error) {
        console.error('Error al crear al usuario administrador', error);
    }
};

userSchema.methods.storeToken = function (token) {
    this.token = token;
};



module.exports = mongoose.model('User', userSchema);