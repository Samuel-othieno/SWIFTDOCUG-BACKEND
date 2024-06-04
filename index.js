import express from 'express';
import 'dotenv/config'; 
import morgan from 'morgan';
import {StatusCodes} from 'http-status-codes';
import helmet from "helmet";
import cors from 'cors';
import patientRouter from './Routers/patients.router.js';

const App = express()
const PORT = process.env.PORT || 4000;

//! Middleware=================================================================================
App.use(morgan('dev'))
App.use(express.json())
App.use(cors())
App.use(helmet())

//! Request Handlers===========================================================================
App.get('/', (req, res)=>{
    res.status(StatusCodes.OK).json({message: "Hello, Welcome to SwiftDocUg"})
})

App.use(patientRouter)


App.listen(PORT,(req, res)=>{
    console.log(`Server is running on http://Localhost:${PORT}`)
})