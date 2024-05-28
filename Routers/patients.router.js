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
import { validate, schema} from "../Utility-Functions/dataValidation.js";


const patientRouter = express.Router();



patientRouter.post('/login', userLogin)
patientRouter.post('/create', validate(schema), createNewPatient)
patientRouter.get('/find-one', findUniquePatient)
patientRouter.get('/find-all',checkRequestForToken, findPatients)
patientRouter.put('/update', updatePatientData)
patientRouter.delete('/delete', deleteAPatient)
patientRouter.delete('/delete-all', deleteAllPatients)


export default patientRouter;
