function validateRegister(body) {
  const errors = [];

  if (!body.fullName || typeof body.fullName !== "string" || body.fullName.trim().length < 2)
    errors.push("Full name must be at least 2 characters");
  if (!body.email || typeof body.email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email))
    errors.push("Invalid email address");
  if (!body.password || typeof body.password !== "string" || body.password.length < 6)
    errors.push("Password must be at least 6 characters");

  if (errors.length) throw errors;

  return {
    body: {
      fullName: body.fullName.trim(),
      email: body.email.trim().toLowerCase(),
      password: body.password,
      role: body.role === "admin" ? "admin" : undefined,
      adminSecret: body.adminSecret,
    },
  };
}

function validateLogin(body) {
  const errors = [];

  if (!body.email || typeof body.email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email))
    errors.push("Invalid email address");
  if (!body.password || typeof body.password !== "string" || body.password.length < 1)
    errors.push("Password is required");

  if (errors.length) throw errors;

  return {
    body: {
      email: body.email.trim().toLowerCase(),
      password: body.password,
    },
  };
}

function validateChangePassword(body) {
  const errors = [];

  if (!body.oldPassword || typeof body.oldPassword !== "string" || body.oldPassword.length < 1)
    errors.push("Old password is required");
  if (!body.newPassword || typeof body.newPassword !== "string" || body.newPassword.length < 6)
    errors.push("New password must be at least 6 characters");

  if (errors.length) throw errors;

  return { body: { oldPassword: body.oldPassword, newPassword: body.newPassword } };
}

export { validateRegister, validateLogin, validateChangePassword };
