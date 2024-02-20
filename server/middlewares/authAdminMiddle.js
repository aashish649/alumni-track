import jwt from "jsonwebtoken";

const authAdmin = (req, res, next) => {
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

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    req.admin = decode;

    next();
  } catch (error) {
    console.error("Error in authAdmin middleware", error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid Token",
    });
  }
};

export { authAdmin };
