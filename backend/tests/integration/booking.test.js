const request = require("supertest");
const app = require("../../src/app");

describe("Booking API", () => {

  it("should fail booking with missing data", async () => {
    const res = await request(app)
      .post("/api/bookings")
      .send({}); // empty request

    expect(res.statusCode).toBeGreaterThanOrEqual(400);
    expect(res.body).toBeDefined();
  });

});