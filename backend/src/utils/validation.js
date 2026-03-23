// ============================
// LOGIN VALIDATION
// ============================
function validateLoginInput(email, password) {
  return Boolean(email && password);
}

// ============================
// LOGIN WITH CAPTCHA (from controller)
function validateLoginFields({ email, password, captchaToken }) {
  return Boolean(email && password && captchaToken);
}

// ============================
// BOOKING VALIDATION
// ============================
function validateBookingInput(data) {
  if (!data || typeof data !== "object") return false;

  const {
    name,
    email,
    phone,
    preferred_date,
    advocate_id
  } = data;

  return Boolean(
    name &&
    email &&
    phone &&
    preferred_date &&
    advocate_id
  );
}

// ============================
// PASSWORD MATCH (from register)
// ============================
function passwordsMatch(password, confirmPassword) {
  return password === confirmPassword;
}

// ============================
// OTP VALIDATION (from verifyOtp)
// ============================
function isOtpValid(userOtp, inputOtp, expiry) {
  return (
    userOtp === inputOtp &&
    new Date(expiry) >= new Date()
  );
}

// ============================
// ACCOUNT STATUS CHECK (from login)
// ============================
function canUserLogin(user) {
  if (!user) return false;

  if (user.account_status === "REJECTED") return false;
  if (user.account_status === "PENDING") return false;
  if (!user.is_verified) return false;

  return true;
}

module.exports = {
  validateLoginInput,
  validateLoginFields,
  validateBookingInput,
  passwordsMatch,
  isOtpValid,
  canUserLogin
};