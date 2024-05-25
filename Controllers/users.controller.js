import { PrismaClient } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import "dotenv/config";


const prisma = new PrismaClient();

// User Loginr====================================================================================================================================================
async function userLogin(req, res) {
  const { username, email, password } = req.body;

  if ((!username && !email) || !password) {
    const errorMessage = !username && !email ? "Username or Email" : "Password";
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: `${errorMessage} is missing` });
  }
;
  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (!user) {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "Invalid credentials, Please try again" });
    } 
      
    if (user.password === password) {
        let userData = {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        };
        let token = jwt.sign(userData, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });
        res.status(StatusCodes.OK).json({message:"Success!", token});

      } else {
        res.status(StatusCodes.UNAUTHORIZED).json({
          error: "Password or email is Incorrect",
        });
      }

  }catch(error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Operation failure! Please try again" });
  }
}


//                                                                 *CREATE OPERATIONS*                                                                              //
// Create A new patient ==============================================================================================================================================

async function createNewPatient(req, res) {
  const { email, username, password, role, first_name, last_name, date_of_birth, nationality, address, gender,medication, duration, notes, medical_Conditions, immunizations, family_history, allergies } = req.body;

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      const conflictField = existingUser.email === email ? "Email" : "Username";
      return res
        .status(StatusCodes.CONFLICT)
        .json({ message: `${conflictField} already in use` });
    }

    const newPatient = await prisma.user.create({
      data: {
        email,
        username,
        password,
        role,
        Profile:{
          create:{
            first_name,
            last_name,
            date_of_birth: new Date(),
            nationality,
            address,
            gender,
          }
        },
        Medical_records:{
          create:{
            allergies,
            medical_Conditions,
            immunizations,
            family_history
          }
        },
        Prescriptions:{
          create:{
            medication,
            duration,
            notes,
          }
        },
      },
      include:{
        Medical_records: true,
        Profile: true,
        Prescriptions: true,
      }
    });

    return res
      .status(StatusCodes.CREATED)
      .json({ message: "SUCCESS! New Patient added", newPatient });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Operation failure! Please try again", details: error.message});
  }
}

//                                                                 *FIND OPERATIONS*                                                                              //

// FIND ONLY ONE PATIENT USING EMAIL AS A UNIQUE ATTRIBUTE. ========================================================================================================
async function findUniquePatient(req, res) {
  const { username, email } = req.body;

  // Check if both username and email are missing and send a BAD_REQUEST response if so
  if (!username && !email) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message:
        !username && !email
          ? "Username or Email required"
          : !username
          ? "Username is required"
          : "Email is required",
    });
  }

  try {
    const uniquePatientExists = await prisma.user.findFirst({
      where: {
        AND: [{ username }, { email }],
      },
    });

    return !uniquePatientExists
      ? res.status(StatusCodes.NOT_FOUND).json({ message: "Patient not found" })
      : res
          .status(StatusCodes.OK)
          .json({ message: "SUCCESS! Patient found", uniquePatientExists });
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Operation failure! Please try again",
      details: error.message,
    });
  }
}

// Find all patient at a Time.😊==============================================================================================================================
async function findPatients(req, res) {
  try {
    const Patient = await prisma.user.findMany();
    res
      .status(StatusCodes.ACCEPTED)
      .json({ message: "SUCCESS! Patients found", Patient });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Operation failure! Please try again" });
  }
}

//                                                                 *UPDATE OPERATIONS*                                                                              //
// Update Patient Data ===============================================================================================================================================

async function updatePatientData(req, res) {
  const {
    newEmail,
    newUsername,
    newPassword,
    oldEmail,
    oldUsername,
    oldPassword,
  } = req.body;

  // Check for missing fields
  if (
    !newEmail ||
    !newUsername ||
    !newPassword ||
    !oldEmail ||
    !oldUsername ||
    !oldPassword
  ) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Fill in all the required fields to proceed.",
    });
  }

  try {
    // Check for Old patient data in the Database (user table)
    const oldPatientData = await prisma.user.findUnique({
      where: { email: oldEmail, username: oldUsername },
    });

    if (!oldPatientData || oldPatientData.password !== oldPassword) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Incorrect old patient data, please try again.",
      });
    }

    // Check for New Patient Data Conflicts
    const patientConflict = await prisma.user.findFirst({
      where: {
        OR: [{ email: newEmail }, { username: newUsername }],
        NOT: { id: oldPatientData.id },
      },
    });

    if (patientConflict) {
      const conflictError =
        patientConflict.email === newEmail ? "Email" : "Username";
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: `${conflictError} already in use!` });
    }

    if (newPassword === oldPassword) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Please, use a password you have not used before!",
      });
    }

    // Update Patient Data
    const updatedPatientData = await prisma.user.update({
      where: { id: oldPatientData.id },
      data: { email: newEmail, username: newUsername, password: newPassword },
    });

    return res.status(StatusCodes.OK).json({
      message: "SUCCESS! Patient data updated",
      updatedPatientData,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Operation Failure!",
      details: error.message,
    });
  }
}

//                                                                 *DELETE OPERATIONS*                                                                              //

// Delete a Single User at a time=====================================================================================================================================
async function deleteAPatient(req, res) {
  const { email, username } = req.body;

  if (!email && !username) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Email or Username required, try again!",
    });
  }

  try {
    const patientExists = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (!patientExists) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Patient not found" });
    } else {
      await prisma.user.delete({
        where: {
          id: patientExists.id,
        },
      });
      return res
        .status(StatusCodes.OK)
        .json({ message: "SUCCESS! Patient deleted" });
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Operation failure! Please try again",
      details: error.message,
    });
  }
}

//delete All patients =========================================================================================================================================
async function deleteAllPatients(req, res) {
  try {
    const deletedPatients = await prisma.user.deleteMany();

    res
      .status(StatusCodes.OK)
      .json({ message: "SUCCESS! All patients deleted.", deletedPatients });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Operation failure! Please try again",
      details: error.message,
    });
  }
}

//                                                                 *EXPORTS*                                                                              //
export {
  findUniquePatient,
  findPatients,
  updatePatientData,
  createNewPatient,
  deleteAllPatients,
  deleteAPatient,
  userLogin,
};
