import { CorsOptions } from "cors";

export const allowedOrigins = [
    'https://mobtwin.com',
    'https://api.mobtwin.com',
    'https://user.mobtwin.com',
    'https://100.42.182.147',
    '160.178.36.145'
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
