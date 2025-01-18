import nodemailer from 'nodemailer';
import { environment } from '../utils/loadEnvironment';


export const transporter = nodemailer.createTransport({
    host: 'mail.mobtwin.com',
    port: 587,
    secure: false,
    auth: {
        user: environment.EMAIL_USER,
        pass: environment.EMAIL_PASSWORD
    }
});
