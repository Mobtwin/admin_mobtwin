import express, { Express } from "express";
import cors from "cors";
import mongoose from 'mongoose';

import { environment } from "./utils/loadEnvironment";
import path from "path";

// initial the express server
const app: Express = express();
app.get("/", (req, res) => {
  res.send("welcome to the api");
});


// middleware to handle CORS
app.use(cors());

// dns validation(
app.get(
  "/.well-known/pki-validation/74739833A0683FFBA3D01A236B75261F.txt",
  (req, res) => {
    res.send(`A7477EB2F23F83415DA4E13CCB56E9B260ED6B334FBA65F89419DD3D6019B2E2
        comodoca.com
        96990964f4fda24`);
  }
);
//TODO: Create those middlewares
// // middleware to validate the input data
// app.use(validateRequest);

// // middleware to log incoming requests
// app.use(logRequest);
//END TODO

// middleware to parse incoming JSON requests
app.use(express.json());







//not found route
app.all('*',(req,res) => {
    res.status(404);
    if (req.accepts('html')) {
      res.sendFile(path.join(__dirname,'views','404.html'));
    }else if(req.accepts('json')){
      res.json({message : '404 Not Found'});
    }else{
      res.type('txt').send('404 Not Found');
    }
  })

//db connection
mongoose.connect(environment.MONGODB_URI as string).then((_value:mongoose.Mongoose)=>{
    console.log('🎉 connection established successfully with mongo db');
    app.listen(environment.PORT, () => {
        console.log(`🚀 Server is running on port: ${environment.PORT}`);
    });

}).catch((err)=>{
    console.log(err);
    console.log('🚨 error while establishing connection with mongo db');
});