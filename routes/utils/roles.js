export const ROLE_PERMISSIONS = {
  admin: [
    "lab.view",
    "assets.view",
    "issues.view",
    "issues.create",
    "issues.update",
    "issues.delete",
    "users.manage"
  ],
  engineer: [
    "lab.view",
    "assets.view",
    "issues.view",
    "issues.create",
    "issues.update",
    "issues.delete"
  ],
  operator: [
    "assets.view",
    "issues.view",
    "issues.create"
  ],
  chemist: [
    "lab.view"
  ]
};

export const hasPermission = (role, permission) => {
  if (!role || !permission) return false;
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
};

export const requirePermission = (permission) => (req, res, next) => {
  if (hasPermission(req.user?.role, permission)) {
    return next();
  }
  return res.status(403).json({ msg: "You do not have permission for this action" });
};
