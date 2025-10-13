import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style.css";


const BooksManager = () => {
  const [books, setBooks] = useState([]);
  const [book, setBook] = useState({
    id: "",
    title: "",
    author: "",
    genre: "",
    price: "",
    publishedYear: "",
    stock: ""
  });

  const [idToFetch, setIdToFetch] = useState("");
  const [fetchedBook, setFetchedBook] = useState(null);
  const [message, setMessage] = useState("");
  const [editMode, setEditMode] = useState(false);

  const baseUrl = `${import.meta.env.VITE_API_URL}/bookapi`;

  // fetch all books
  useEffect(() => {
    fetchAllBooks();
  }, []);

  const fetchAllBooks = async () => {
    try {
      const res = await axios.get(`${baseUrl}/all`);
      setBooks(res.data);
    } catch (error) {
      setMessage("Failed to fetch books.");
    }
  };

  const handleChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    for (let key in book) {
      if (!book[key] || book[key].toString().trim() === "") {
        setMessage(`Please fill out the ${key} field.`);
        return false;
      }
    }
    return true;
  };

  // add book
  const addBook = async () => {
    if (!validateForm()) return;
    try {
      await axios.post(`${baseUrl}/add`, book);
      setMessage("Book added successfully.");
      fetchAllBooks();
      resetForm();
    } catch (error) {
      setMessage("Error adding book.");
    }
  };

  // update book
  const updateBook = async () => {
    if (!validateForm()) return;
    try {
      await axios.put(`${baseUrl}/update`, book);
      setMessage("Book updated successfully.");
      fetchAllBooks();
      resetForm();
    } catch (error) {
      setMessage("Error updating book.");
    }
  };

  // delete book
  const deleteBook = async (id) => {
    try {
      const res = await axios.delete(`${baseUrl}/delete/${id}`);
      setMessage(res.data);
      fetchAllBooks();
    } catch (error) {
      setMessage("Error deleting book.");
    }
  };

  // get book by id
  const getBookById = async () => {
    try {
      const res = await axios.get(`${baseUrl}/get/${idToFetch}`);
      setFetchedBook(res.data);
      setMessage("");
    } catch (error) {
      setFetchedBook(null);
      setMessage("Book not found.");
    }
  };

  const handleEdit = (bk) => {
    setBook(bk);
    setEditMode(true);
    setMessage(`Editing book with ID ${bk.id}`);
  };

  const resetForm = () => {
    setBook({
      id: "",
      title: "",
      author: "",
      genre: "",
      price: "",
      publishedYear: "",
      stock: ""
    });
    setEditMode(false);
  };

  return (
    <div className="student-container">
      {message && (
        <div
          className={`message-banner ${
            message.toLowerCase().includes("error") ? "error" : "success"
          }`}
        >
          {message}
        </div>
      )}

      <h2>Book Management System 📚</h2>

      <div>
        <h3>{editMode ? "Edit Book" : "Add Book"}</h3>
        <div className="form-grid">
          <input
            type="number"
            name="id"
            placeholder="ID"
            value={book.id}
            onChange={handleChange}
          />
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={book.title}
            onChange={handleChange}
          />
          <input
            type="text"
            name="author"
            placeholder="Author"
            value={book.author}
            onChange={handleChange}
          />
          <input
            type="text"
            name="genre"
            placeholder="Genre"
            value={book.genre}
            onChange={handleChange}
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={book.price}
            onChange={handleChange}
          />
          <input
            type="number"
            name="publishedYear"
            placeholder="Published Year"
            value={book.publishedYear}
            onChange={handleChange}
          />
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={book.stock}
            onChange={handleChange}
          />
        </div>

        <div className="btn-group">
          {!editMode ? (
            <button className="btn-blue" onClick={addBook}>
              Add Book
            </button>
          ) : (
            <>
              <button className="btn-green" onClick={updateBook}>
                Update Book
              </button>
              <button className="btn-gray" onClick={resetForm}>
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      <div>
        <h3>Get Book By ID</h3>
        <input
          type="number"
          value={idToFetch}
          onChange={(e) => setIdToFetch(e.target.value)}
          placeholder="Enter ID"
        />
        <button className="btn-blue" onClick={getBookById}>
          Fetch
        </button>

        {fetchedBook && (
          <div>
            <h4>Book Found:</h4>
            <pre>{JSON.stringify(fetchedBook, null, 2)}</pre>
          </div>
        )}
      </div>

      <div>
        <h3>All Books</h3>
        {books.length === 0 ? (
          <p>No books found.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  {Object.keys(book).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((bk) => (
                  <tr key={bk.id}>
                    {Object.keys(book).map((key) => (
                      <td key={key}>{bk[key]}</td>
                    ))}
                    <td>
                      <div className="action-buttons">
                        <button className="btn-green" onClick={() => handleEdit(bk)}>
                          Edit
                        </button>
                        <button className="btn-red" onClick={() => deleteBook(bk.id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BooksManager;
