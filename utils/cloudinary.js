const cloudinary = require('cloudinary').v2;
// para que me lo guarde en la nube con mi cuenta
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_KEY_SECRET
});

module.exports = cloudinary;