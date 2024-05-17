import { PrismaClient } from "@prisma/client";
import { StatusCodes } from "http-status-codes";

const prisma = new PrismaClient();


// //FIND ONLY ONE PATIENT USING EMAIL AS A UNIQUE ATTRIBUTE. ==================================================================================================================
async function findUniquePatient(req, res) {
  const uniqueUsername = req.body.username;

  try {
    if (!uniqueUsername) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Invalid Username" });
    }

    const uniquePatientExits = await prisma.user.findUnique({
      where: {
        username: uniqueUsername,
      },
    });

    if (!uniquePatientExits) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Patient not found" });
    } else {
      res
        .status(StatusCodes.ACCEPTED)
        .json({ message: "SUCCESS! Patients found", uniquePatientExits });
    }
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Operation failure! Please try again" });
  }
}

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


// Create A new patient ===================================================================================================================
async function createNewPatient(req, res) {
  const email = req.body.email;
  const userName = req.body.username;
  try {
    const PatientEmail = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    const PatientUsername = await prisma.user.findUnique({
      where: {
        username: userName,
      }
    })

    if (PatientUsername != null && PatientUsername.username === userName) {
      res
        .status(StatusCodes.CONFLICT)
        .json({ message: "UserName already in use" });
    }

    if (PatientEmail != null && PatientEmail.email === email) {
      res
        .status(StatusCodes.CONFLICT)
        .json({ message: "Email already in use" });
    } else {
      const newPatient = await prisma.user.create({
        data: req.body,
      });
      res
        .status(StatusCodes.CREATED)
        .json({ message: "SUCCESS! New Patient added", newPatient });
    }
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Operation failure! Please try again" });
  }
}



// delete All patients =========================================================================================================================================
async function deleteAllPatients(req, res) {
  try {
    const deletedPatients = await prisma.user.deleteMany();

    console.log("deletedPatients:",deletedPatients)
    
    res.status(StatusCodes.OK).json({ message: "SUCCESS! All patients deleted.", details: message })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Operation failure! Please try again", details: error.message });
  }
}



// Update Patient Data ========================================================================================================================================
async function updatePatientData(req, res) {
  try {
    const { newEmail, newUsername, newPassword, oldEmail, oldUsername, oldPassword } = req.body

    if (!newEmail || !newUsername || !newPassword || !oldEmail || !oldUsername || !oldPassword) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: "Fill in all the required fields to proceed.", details: error.message })
    }

    if (newEmail === oldEmail) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: "Email already in use!", details: error.message })
    }

    if (newUsername === oldUsername) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: "Username already in use!", details: error.message })
    }

    if (newPassword === oldPassword) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: "Use a password you have not used before!", details: error.message })
    }

    //New patient data========================================
    const newPatientEmailExists = await prisma.user.findUnique({
      where: {
        email: newEmail,
      }
    })

    const newPatientPasswordExists = await prisma.user.findUnique({
      where: {
        password: newPassword,
      }
    })

    const newPatientUsernameExists = await prisma.user.findUnique({
      where: {
        username: newUsername,
      }
    })

    //Old patient data===========================================
    const oldPatientEmailNotFound = await prisma.user.findUnique({
      where: {
        email: oldEmail,
      }
    })

    const oldPatientPasswordNotFound = await prisma.user.findUnique({
      where: {
        password: oldPassword,
      }
    })

    const oldPatientUsernameNotFound = await prisma.user.findUnique({
      where: {
        username: oldUsername,
      }
    })

    if (newPatientEmailExists) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: "Email already taken!", details: error.message })
    }

    if (newPatientUsernameExists) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: "Username already taken!", details: error.message })
    }

    if (newPatientPasswordExists) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: "Please, use a different password!", details: error.message })
    }

    if (!oldPatientEmailNotFound) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: "Patient email not found, please try again.", details: error.message })
    }

    if (!oldPatientUsernameNotFound) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: "Patient username not found, please try again.", details: error.message })

    } else {
      const updateThePatientData = await prisma.user.updateMany({
        where: [
          {
            username: oldUsername,
          },
          {
            password: oldPassword,
          },
          {
            email: oldEmail,
          }
        ],
        data: [
          {
            username: newUsername,
          },
          {
            password: newPassword,
          },
          {
            email: newEmail,
          }
        ]
      })
    }


  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Operation Failure!", details: error.message })
  }
}

// Delete a Single User at a time==========================================================================================
async function deleteAPatient(req, res) {
  const PatientEmail = req.body.email;
  try {
    if (!PatientEmail) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Email required" });
    }

    const PatientExists = await prisma.user.findUnique({
      where: {
        email: PatientEmail,
      },
    });

    if (!PatientExists) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Patient not found" , details:error.message});
    } else {
      await prisma.user.delete({
        where: {
          email: PatientEmail,
        },
      });
      res.status(StatusCodes.OK).json({ message: "SUCCESS! Patient deleted" });
    }
  } catch (error) {

    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Operation failure! Please try again", details:error.message});
  }
 
}

export {
  findUniquePatient,
  findPatients,
  updatePatientData,
  createNewPatient,
  deleteAllPatients,
  deleteAPatient
};