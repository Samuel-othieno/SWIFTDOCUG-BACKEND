import express from "express";
import checkRequestForToken from "../Utility-Functions/jwt.js";
import {
  userLogin,
  findPatients,
  findUniquePatient,
  updatePatientData,
  deleteAPatient,
  deleteAllPatients,
  createNewPatient,
} from "../Controllers/users.controller.js";
import { validate, userSchema } from "../Utility-Functions/dataValidation.js";


const patientRouter = express.Router();

patientRouter.post('/login', userLogin)
patientRouter.post('/patient/create', validate(userSchema), createNewPatient)
patientRouter.get('/patient/one', findUniquePatient)
patientRouter.get('/patient/all',checkRequestForToken, findPatients)
patientRouter.put('/patient/update', updatePatientData)
patientRouter.delete('/patient/delete', deleteAPatient)
patientRouter.delete('/patient/delete-all', deleteAllPatients)


export default patientRouter;
