const request = require("supertest");
const app = require("../server");

describe("Books API", () => {
  test("GET /api/books returns all books", async () => {
    const res = await request(app).get("/api/books");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("GET /api/books/:id returns a book when id is valid", async () => {
    const res = await request(app).get("/api/books/1");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id", 1);
  });

  test("GET /api/books/:id returns 404 when id is invalid", async () => {
    const res = await request(app).get("/api/books/999999");
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error");
  });

  test("POST /api/books creates a new book", async () => {
    const res = await request(app)
      .post("/api/books")
      .send({ title: "Children of Dune", author: "Frank Herbert", year: 1976, available: true });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.title).toBe("Children of Dune");
  });

  test("POST /api/books returns 400 if title/author missing", async () => {
    const res = await request(app).post("/api/books").send({ title: "No Author" });
    expect(res.statusCode).toBe(400);
  });

  test("PUT /api/books/:id updates an existing book", async () => {
    // Create a book first so we always have a valid ID
    const created = await request(app)
      .post("/api/books")
      .send({ title: "Temp", author: "Temp Author", available: true });

    const id = created.body.id;

    const res = await request(app)
      .put(`/api/books/${id}`)
      .send({ available: false });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id", id);
    expect(res.body.available).toBe(false);
  });

  test("PUT /api/books/:id returns 404 if book not found", async () => {
    const res = await request(app)
      .put("/api/books/999999")
      .send({ title: "Doesn't matter" });

    expect(res.statusCode).toBe(404);
  });

  test("DELETE /api/books/:id deletes an existing book", async () => {
    const created = await request(app)
      .post("/api/books")
      .send({ title: "Delete Me", author: "Author" });

    const id = created.body.id;

    const res = await request(app).delete(`/api/books/${id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id", id);

    const check = await request(app).get(`/api/books/${id}`);
    expect(check.statusCode).toBe(404);
  });

  test("DELETE /api/books/:id returns 404 if book not found", async () => {
    const res = await request(app).delete("/api/books/999999");
    expect(res.statusCode).toBe(404);
  });
});
