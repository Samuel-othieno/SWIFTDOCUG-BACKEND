import express from "express";
import {
  findPatients,
  findUniquePatient,
  updatePatientData,
  deleteAPatient,
  deleteAllPatients,
  createNewPatient,
} from "../Controllers/users.controller.js";


const patientRouter = express.Router();

patientRouter.post('/patient/create', createNewPatient)
patientRouter.get('/patient/one', findUniquePatient)
patientRouter.get('/patient/all', findPatients)
patientRouter.put('/patient/update', updatePatientData)
patientRouter.delete('/patient/delete', deleteAPatient)
patientRouter.delete('/patient/delete-all', deleteAllPatients)


export default patientRouter;
