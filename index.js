import express from 'express';
import morgan from 'morgan';
import {StatusCodes} from 'http-status-codes';
import helmet from "helmet";
import cors from 'cors';
import patientRouter from './Routers/patients.router.js';
import { createNewProfile, getUserInfo } from './Controllers/profiles.controller.js';
import { profileSchema, validate } from './Utility-Functions/dataValidation.js';


const App = express()
const PORT = 5000;

//! Middleware=================================================================================
App.use(morgan('dev'))
App.use(express.json())
App.use(cors())
App.use(helmet())


//! Request Handlers===========================================================================
App.get('/', (req, res)=>{
    res.status(StatusCodes.OK).json({message: "Hello, Welcome to SwiftDocUg"})
})
App.post('/profile',validate(profileSchema), createNewProfile)
App.post('/user/info', getUserInfo)

App.use('/swiftdocug', patientRouter)

App.listen(PORT,(req, res)=>{
    console.log(`Server is running on http://Localhost:${PORT}`)
})