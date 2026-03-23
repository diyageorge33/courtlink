const request = require("supertest");
const app = require("../../src/app");

describe("Client API", () => {

  it("should respond for client route", async () => {
    const res = await request(app)
      .get("/api/client");

    expect(res.statusCode).toBeLessThan(500);
  });

});