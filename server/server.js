import express, { urlencoded } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const {PORT, MONGO_URL}= process.env;

const app= express();
app.use(cors({
    credentials:true,
    origin: ['http://localhost:5173'],
})
);
app.use(helmet())
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/', async(req, res)=>{
    res.status(200).json({ message: 'Server listening your requests' });
})

app.use("/api/users", userRoutes);

mongoose.connect(MONGO_URL).then(()=> console.log('Mongoose connect to DB')).catch((error)=> console.log('connection error',error));


app.listen(PORT, ()=>{
    console.log(`Server started on PORT ${PORT}`)
});