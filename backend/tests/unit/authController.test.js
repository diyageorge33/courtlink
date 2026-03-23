const authController = require("../../src/controllers/auth.controller");
const pool = require("../../src/db");
const bcrypt = require("bcrypt");
const axios = require("axios");

// MOCK DEPENDENCIES
jest.mock("../../src/db");
jest.mock("bcrypt");
jest.mock("axios");

describe("Auth Controller Unit Tests", () => {

  let req, res;

  beforeEach(() => {
    req = {
      body: {
        email: "test@gmail.com",
        password: "123",
        captchaToken: "token"
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // ✅ FIX: mock axios for ALL tests
    axios.post.mockResolvedValue({ data: { success: true } });
  });

  // ======================
  // MISSING FIELDS
  // ======================
  it("should return 400 if fields missing", async () => {
    req.body = {};

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalled();
  });

  // ======================
  // USER NOT FOUND
  // ======================
  it("should return 401 if user not found", async () => {
    pool.query.mockResolvedValue({ rows: [] });

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalled();
  });

  // ======================
  // SUCCESS LOGIN
  // ======================
  it("should return success for valid login", async () => {
    pool.query.mockResolvedValue({
      rows: [{
        password: "hashed",
        is_verified: true,
        account_status: "ACTIVE"
      }]
    });

    bcrypt.compare.mockResolvedValue(true);

    await authController.login(req, res);

    expect(res.json).toHaveBeenCalled();
  });

});