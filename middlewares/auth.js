import jwt from "jsonwebtoken"

const authenticateToken = (req, res, next) => {  
  const authHeader = req.headers['authorization'] 
  const token = authHeader && authHeader.split(' ')[1] 

  if (token == null) return res.sendStatus(401);
  jwt.verify(token, "process.env.TOKEN_SECRET", (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

const generateAccessToken = (emailId) => {
  return jwt.sign({ data: emailId }, "process.env.TOKEN_SECRET", {
    expiresIn: "24h",
  });
}

export { authenticateToken, generateAccessToken }
