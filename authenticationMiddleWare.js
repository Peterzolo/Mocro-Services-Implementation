const jwt = require("jsonwebtoken");




export const  isAuthenticated = (req, res, next) =>{

    const token = req.headers["authorization"].split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.json({ message: err });
        } else {
            req.user = user;
            next();
        }
    });

}

export const protectedAuth = (req, res, next) => {
    const authHeader =
  
      req.headers['x-access-token'] ||
      req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) res.status(403).json({ message: 'Token is not valid!' });
        req.user = user;
        next();
      });
    } else {
      return res.status(401).json({ message: 'You are not authenticated!' });
    }
  };
  
  
  export const registeredAndAuthorized = (req, res, next) => {
    protect(req, res, () => {
      if (req.user.id === req.params.id || req.user.isAdmin) {
        next();
      } else {
        res.status(403).json("You are not alowed to do that!");
      }
    });
  };
  
  export const authorizedAndAdmin = (req, res, next) => {
    protect(req, res, () => {
      if (req.user.isAdmin) {
        next();
      } else {
        res.status(403).json({ message:"You are not authorized to perform this task"});
      }
    });
  };


