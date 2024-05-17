import express from 'express';
import morgan from 'morgan';
import {StatusCodes} from 'http-status-codes';
import helmet from "helmet";
import cors from 'cors';
import {updatePatientData,findUniquePatient, findPatients, createNewPatient, deleteAllPatients, deleteAPatient} from './Controllers/users.controller.js';

const App = express()
const PORT = 5000;

//! Middleware
App.use(morgan('dev'))
App.use(express.json())
App.use(cors())
App.use(helmet())

App.get('/', (req, res)=>{
    res.status(StatusCodes.OK).json({message: "Hello, Welcome to SwiftDocUg"})
})

App.get('/user', findUniquePatient)
App.get('/all-users', findPatients)
App.post('/create-patient', createNewPatient)
App.put('/update', updatePatientData)
App.delete('/delete', deleteAPatient)
App.delete('/delete-all', deleteAllPatients)

App.listen(PORT,(req, res)=>{
    console.log(`Server is running on http://Localhost:${PORT}`)
})