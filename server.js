const express = require("express");
const app = express();

app.use(express.json());

// In-memory "database"
let books = [
  { id: 1, title: "Dune", author: "Frank Herbert", year: 1965, available: true },
  { id: 2, title: "Dune Messiah", author: "Frank Herbert", year: 1969, available: false }
];

//  GET /api/books - all books
app.get("/api/books", (req, res) => {
  res.status(200).json(books);
});

//  GET /api/books/:id - one book by id
app.get("/api/books/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const book = books.find((b) => b.id === id);

  if (!book) return res.status(404).json({ error: "Book not found" });

  res.status(200).json(book);
});

// POST /api/books - create new book
app.post("/api/books", (req, res) => {
  const { title, author, year, available } = req.body;

  // Basic validation
  if (!title || !author) {
    return res.status(400).json({ error: "title and author are required" });
  }

  const newId = books.length ? Math.max(...books.map((b) => b.id)) + 1 : 1;

  const newBook = {
    id: newId,
    title,
    author,
    year: year ?? null,
    available: available ?? true
  };

  books.push(newBook);
  res.status(201).json(newBook);
});

//  PUT /api/books/:id - update existing book
app.put("/api/books/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const book = books.find((b) => b.id === id);

  if (!book) return res.status(404).json({ error: "Book not found" });

  const { title, author, year, available } = req.body;

  // Update only what they send
  if (title !== undefined) book.title = title;
  if (author !== undefined) book.author = author;
  if (year !== undefined) book.year = year;
  if (available !== undefined) book.available = available;

  res.status(200).json(book);
});

// DELETE /api/books/:id - delete book
app.delete("/api/books/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = books.findIndex((b) => b.id === id);

  if (index === -1) return res.status(404).json({ error: "Book not found" });

  const removed = books.splice(index, 1)[0];
  res.status(200).json(removed);
});

//  Only start server when running normally (not when Jest imports it)
if (require.main === module) {
  const PORT = 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;










