import { CorsOptions } from "cors";

export const allowedOrigins = [
    'https://mobtwin.com',
    'https://dashboard.mobtwin.com',
    'https://api.mobtwin.com',
    'https://user.mobtwin.com',
    'https://100.42.182.147',
    'https://admin.mobtwin.com',
    "https://aso.mobtwin.com"
];


export const corsOptions:CorsOptions = {
    origin: (origin,callback) => {
        if(!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null,true);
        }else{
            // callback(new Error('Not Allowed By CORS'));
            callback(null,true);
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
}
