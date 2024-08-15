import multer from 'multer';
import fs from 'fs';
import { generateRandomCharacters } from '../utils/string.format';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Set the upload directory
        const uploadDir = './uploads';
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Get the file extension based on the mimetype
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
        const fileName = generateRandomCharacters(48)+'.'+extension;
        cb(null, fileName);
    }
});



// Create upload instance
export const multerAvatarUpload = multer({ 
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: function (req, file, cb) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif','image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only JPEG, PNG, WEBP and GIF files are allowed'));
        }
    }
 });

// Create upload instance
export const multerAppsUpload = multer({ 
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: function (req, file, cb) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif','image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only JPEG, PNG, WEBP and GIF files are allowed'));
        }
    }
});
