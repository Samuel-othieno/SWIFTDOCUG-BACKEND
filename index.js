import express from 'express';
import 'dotenv/config'; 
import morgan from 'morgan';
import 'dotenv/config';
import { StatusCodes } from 'http-status-codes';
import helmet from "helmet";
import cors from 'cors';
import patientRouter from './Routers/patients.router.js';

const App = express()

const host_phrase = process.env.HOST_PHRASE;
const PORT = process.env.PORT;
const host = process.env.HOST;


//! Middleware=================================================================================
App.use(morgan('dev'))
App.use(express.json())
App.use(cors())
App.use(helmet())

//! Request Handlers===========================================================================
App.get('/', (req, res) => {
    res.status(StatusCodes.OK).json({ message: "Hello, Welcome to SwiftDocUg" })
})

App.use(patientRouter)


App.listen(PORT, (req, res) => {
    console.log(`${host_phrase}${host}${PORT}`)
})
