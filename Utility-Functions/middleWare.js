import { StatusCodes } from "http-status-codes";



function isDOCTOR(req, res, next) {
    if (req.tokenData.userole === "DOCTOR") {
        next();
    } else {
        res.status(StatusCodes.FORBIDDEN).json({error:"Access Denied"})
    }
}

function isPATIENT(req, res, next) {
    if (req.tokenData.role==="PATIENT") {
        next();
    } else {
        res.status(StatusCodes.FORBIDDEN).json({error:"Access Denied"})
    }
}

export{
    isDOCTOR,
    isPATIENT
}