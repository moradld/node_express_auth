import express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRouter from './routers/authRouter.js';
const app = express();
app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
mongoose.connect(process.env.MONGO_URI).then(()=> console.log('Database Connected..!'));
app.use('/api/auth', authRouter);
app.get('/', (req, res)=>{
    res.json({message: "Hello from the server"});
});

app.listen(process.env.PORT,()=>{
    console.log("listening....");
});

