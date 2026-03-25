
module.exports = (req, res, next) => {
  console.log("isAdmin middleware: req.user =", req.user);
  
  if (!req.user) {
    console.error("isAdmin: No user in request");
    return res.status(401).json({ message: "User not authenticated" });
  }
  
  if (req.user.role !== 'ADMIN') {
    console.error("isAdmin: User role is", req.user.role, "expected ADMIN");
    return res.status(403).json({ message: "Access denied. Admin only. Your role: " + req.user.role });
  }
  
  console.log("isAdmin: User is admin, proceeding");
  next();
};