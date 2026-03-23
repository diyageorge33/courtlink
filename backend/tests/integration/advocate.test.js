const request = require("supertest");
const app = require("../../src/app");

describe("Advocate API", () => {

  it("should fetch advocate bookings", async () => {
    const res = await request(app)
      .get("/api/bookings/advocate/1");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

});