import jwt from 'jsonwebtoken';



function checkRequestForToken(req, res, next) {
  if (req.headers.authorization) {
    let authHeader = req.headers.authorization;
    let token = authHeader.split(" ")[1];

    if (token) {
      jwt.verify(token, "password-test", (err, decodedToken) => {
        if (err) {
          res.send("Failed to verify");
        } else {
          req.tokenData= decodedToken
          next()
        }
      });

    } else {
      res.send("Absent");
    }
  } else {
    res.status(400).send("no");
  }
}

export default checkRequestForToken;