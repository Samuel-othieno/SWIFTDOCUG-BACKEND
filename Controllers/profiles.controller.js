import { PrismaClient } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import Joi from "joi";
import "dotenv/config";

const prisma = new PrismaClient();


async function createNewProfile(req, res) {
  const { first_name, last_name, date_of_birth, nationality, address, gender, userId} = req.body;

  try {
    const existingProfile = await prisma.profile.findFirst({
      where: {
        AND: [{ first_name }, { last_name }],
      },
    });

    if (existingProfile) {
        
            const errors = existingProfile.details.map(err=>{
                return {field: err.path[0], message:err.message}
            })

           res.status(StatusCodes.BAD_REQUEST).json({errors})   
    }   

    const user = await prisma.user.findUnique({
        where:{id:userId}
    })

    if(!user){
       return res.status(StatusCodes.BAD_REQUEST).json({error:"User not found"})
    }

    const newProfile = await prisma.profile.create({
        data: {
            first_name,
            last_name,
            date_of_birth: new Date(),
            nationality,
            address,
            gender,
            userId
        },
      });
      return res
        .status(StatusCodes.CREATED)
        .json({ message: "SUCCESS! New Profile added", newProfile });

  } catch (error) {
    console.error(error);
        
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Operation failure! Please try again" });
  }
}

//                                                                 *FIND OPERATIONS*                                                                              //

// FIND ONLY ONE Profile USING first_name AS A UNIQUE ATTRIBUTE. ========================================================================================================
async function findUniqueProfile(req, res) {
  const { last_name, first_name } = req.body;

  // Check if both last_name and first_name are missing and send a BAD_REQUEST response if so
  if (!last_name && !first_name) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message:
        !last_name && !first_name
          ? "last_name or first_name required"
          : !last_name
          ? "last_name is required"
          : "first_name is required",
    });
  }

  try {
    const uniqueProfileExists = await prisma.profile.findFirst({
      where: {
        AND: [{ last_name }, { first_name }],
      },
    });

    return !uniqueProfileExists
      ? res.status(StatusCodes.NOT_FOUND).json({ message: "Profile not found" })
      : res
          .status(StatusCodes.OK)
          .json({ message: "SUCCESS! Profile found", uniqueProfileExists });
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Operation failure! Please try again",
      details: error.message,
    });
  }
}

// Find all Profile at a Time.😊==============================================================================================================================
async function findProfiles(req, res) {
  try {
    const Profile = await prisma.profile.findMany();
    res
      .status(StatusCodes.ACCEPTED)
      .json({ message: "SUCCESS! Profiles found", Profile });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Operation failure! Please try again" });
  }
}

//                                                                 *UPDATE OPERATIONS*                                                                              //
// Update Profile Data ===============================================================================================================================================

async function updateProfileData(req, res) {
  const {
    newfirst_name,
    newlast_name,
    newPassword,
    oldfirst_name,
    oldlast_name,
    oldPassword,
  } = req.body;

  // Check for missing fields
  if (
    !newfirst_name ||
    !newlast_name ||
    !newPassword ||
    !oldfirst_name ||
    !oldlast_name ||
    !oldPassword
  ) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Fill in all the required fields to proceed.",
    });
  }

  try {
    // Check for Old Profile data in the Database (profile table)
    const oldProfileData = await prisma.profile.findUnique({
      where: { first_name: oldfirst_name, last_name: oldlast_name },
    });

    if (!oldProfileData || oldProfileData.password !== oldPassword) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Incorrect old Profile data, please try again.",
      });
    }

    // Check for New Profile Data Conflicts
    const ProfileConflict = await prisma.profile.findFirst({
      where: {
        OR: [{ first_name: newfirst_name }, { last_name: newlast_name }],
        NOT: { id: oldProfileData.id },
      },
    });

    if (ProfileConflict) {
      const conflictError =
        ProfileConflict.first_name === newfirst_name ? "first_name" : "last_name";
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: `${conflictError} already in use!` });
    }

    if (newPassword === oldPassword) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Please, use a password you have not used before!",
      });
    }

    // Update Profile Data
    const updatedProfileData = await prisma.profile.update({
      where: { id: oldProfileData.id },
      data: { first_name: newfirst_name, last_name: newlast_name, password: newPassword },
    });

    return res.status(StatusCodes.OK).json({
      message: "SUCCESS! Profile data updated",
      updatedProfileData,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Operation Failure!",
      details: error.message,
    });
  }
}

async function getUserInfo(req, res) {
    const {id, email, username} = req.body
    
    if (!id && !username && !email){
        return res.status(StatusCodes.BAD_REQUEST).json({error:"Operation Failure!", details: 'Missing unique indentifier: id, username, or email is required.'})
    }
  try {
    const userInfo = await prisma.user.findUnique({
      where: {
        id,
        username,
        email
      },
      include: {
        Profile: true,
      },
    });

    if (!userInfo) {
        return res.status(404).json({error:"User not found"})        
    }
    

    res.status(StatusCodes.OK).json({userInfo})

  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Operation Failure!",
      details: error.message,
    });
  }
}

export {
  findUniqueProfile,
  findProfiles,
  updateProfileData,
  createNewProfile,
  getUserInfo
};
