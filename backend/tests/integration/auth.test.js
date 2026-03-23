const request = require("supertest");
const app = require("../../src/app");

describe("Auth API", () => {

  it("should fail login with invalid credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "wrong@gmail.com",
        password: "wrongpass"
      });

    expect(res.statusCode).toBeGreaterThanOrEqual(400);
    expect(res.body).toBeDefined();
  });

});