const {
  validateLoginInput,
  validateLoginFields,
  validateBookingInput,
  passwordsMatch,
  isOtpValid,
  canUserLogin
} = require("../../src/utils/validation");

describe("Validation & Auth Logic Unit Tests", () => {

  // ======================
  // LOGIN BASIC
  // ======================
  describe("validateLoginInput", () => {

    it("should return false if email or password missing", () => {
      expect(validateLoginInput("", "")).toBe(false);
      expect(validateLoginInput("test@gmail.com", "")).toBe(false);
    });

    it("should return true for valid input", () => {
      expect(validateLoginInput("test@gmail.com", "123")).toBe(true);
    });

  });

  // ======================
  // LOGIN WITH CAPTCHA
  // ======================
  describe("validateLoginFields", () => {

    it("should fail if any field missing", () => {
      expect(validateLoginFields({})).toBe(false);
    });

    it("should pass if all fields exist", () => {
      expect(validateLoginFields({
        email: "test@gmail.com",
        password: "123",
        captchaToken: "token"
      })).toBe(true);
    });

  });

  // ======================
  // BOOKING
  // ======================
  describe("validateBookingInput", () => {

    it("should fail for empty object", () => {
      expect(validateBookingInput({})).toBe(false);
    });

    it("should pass for valid booking", () => {
      const data = {
        name: "Diya",
        email: "test@gmail.com",
        phone: "1234567890",
        preferred_date: "2026-04-01",
        advocate_id: 1
      };

      expect(validateBookingInput(data)).toBe(true);
    });

  });

  // ======================
  // PASSWORD MATCH
  // ======================
  describe("passwordsMatch", () => {

    it("should return true if passwords match", () => {
      expect(passwordsMatch("123", "123")).toBe(true);
    });

    it("should return false if passwords do not match", () => {
      expect(passwordsMatch("123", "456")).toBe(false);
    });

  });

  // ======================
  // OTP VALIDATION
  // ======================
  describe("isOtpValid", () => {

    it("should pass for correct OTP and future expiry", () => {
      const future = new Date(Date.now() + 10000);
      expect(isOtpValid("123456", "123456", future)).toBe(true);
    });

    it("should fail for wrong OTP", () => {
      const future = new Date(Date.now() + 10000);
      expect(isOtpValid("123456", "000000", future)).toBe(false);
    });

    it("should fail for expired OTP", () => {
      const past = new Date(Date.now() - 10000);
      expect(isOtpValid("123456", "123456", past)).toBe(false);
    });

  });

  // ======================
  // USER STATUS
  // ======================
  describe("canUserLogin", () => {

    it("should allow valid user", () => {
      const user = {
        account_status: "ACTIVE",
        is_verified: true
      };

      expect(canUserLogin(user)).toBe(true);
    });

    it("should block rejected user", () => {
      const user = {
        account_status: "REJECTED",
        is_verified: true
      };

      expect(canUserLogin(user)).toBe(false);
    });

    it("should block unverified user", () => {
      const user = {
        account_status: "ACTIVE",
        is_verified: false
      };

      expect(canUserLogin(user)).toBe(false);
    });

  });

});