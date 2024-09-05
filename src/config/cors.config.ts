import { CorsOptions } from "cors";

export const allowedOrigins = [
    'https://mobtwintest.com',
    'https://dashboard.mobtwintest.com',
    'https://api.mobtwintest.com',
    'https://user.mobtwintest.com',
    'https://100.42.182.147',
    'https://admin.mobtwintest.com'
];


export const corsOptions:CorsOptions = {
    origin: (origin,callback) => {
        if(!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null,true);
        }else{
            callback(new Error('Not Allowed By CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
}
