export const ROLE_HIERARCHY = {
  chemist: 1,
  operator: 2,
  engineer: 3,
  admin: 4,
};

export const hasMinimumRole = (role, minimumRole) => {
  if (!role || !minimumRole) return false;
  const roleLevel = ROLE_HIERARCHY[role];
  const minimumLevel = ROLE_HIERARCHY[minimumRole];
  if (roleLevel === undefined || minimumLevel === undefined) return false;
  return roleLevel >= minimumLevel;
};

export const requireMinimumRole = (minimumRole) => (req, res, next) => {
  if (hasMinimumRole(req.user?.role, minimumRole)) {
    return next();
  }
  return res.status(403).json({ msg: "You do not have permission for this action" });
};
