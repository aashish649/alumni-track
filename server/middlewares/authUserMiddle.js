const jwt = require("jsonwebtoken");

const authUser = (req, res, next) => {
 
  try {
   
    const tokenFromHeaders =
      req.headers.authorization &&
      req.headers.authorization.replace("Bearer ", "");

    const tokenFromCookies = req.cookies.token;

    const tokenFromBody = req.body.token;

    const token = tokenFromHeaders || tokenFromCookies || tokenFromBody;
  

    if (!token) {
      return res.status(403).json({
        success: false,
        message: "Token is missing",
      });
    }

    // Verify the token
    const decode = jwt.verify(token, process.env.JWT_SECRET);
  
    req.user = decode;
    next();
  } catch (error) {
    console.error("Error in authuser middleware:", error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

module.exports =  { authUser };
