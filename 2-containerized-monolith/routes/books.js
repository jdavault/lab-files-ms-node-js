import express from 'express'
import { nanoid } from 'nanoid'

const router = express.Router()

const ideLength = 8;


/**
 * @swagger
 * components:
 *   securitySchemes:
 *     ApiKeyAuth:
 *       type: apiKey
 *       in: header
 *       name: authorization
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - title
 *         - author
 *       properties:
 *         title:
 *           type: string
 *           description: The book text
 *         author:
 *           type: string
 *           description: Author of book
 *       example:
 *         title: Harry Potter
 *         author: "J. K. Rowling"
 */

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Books API
 */

// /**
//  * @swagger
//  * /:
//  *   get:
//  *     tags: [General] 
//  *     summary: This api is used to check if get method is working
//  *     description: This api is used to check if get method is working
//  *     responses:
//  *       200:
//  *         description: Success
//  */

// router.get("/", (req, res) => {
//   res.send("Welcome to booksDb -- <a href='http://localhost:3003/swagger'>http://localhost:3003/swagger<a>")
// })


/**
 * @swagger
 * /api/books:
 *   get:
 *     tags: [Books] 
 *     summary: Returns all books
 *     description: Returns all books
 *     security:
 *       - ApiKeyAuth: [read,write]
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       500:
 *         description: Server Error
 */

router.get("/api/books", async (req, res) => {
  try {
    //if (req.headers["authorization"] === "123456") {
    const { books } = req.app.db.data;
    res.json(books);
    console.log("YEP")
    //} else {
    //  res.status(401).send("NOT AUTHORIZED")
    //}
  } catch (error) {
    console.log(error)
    res.status("500").send(error.message)
  }
});


/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     summary: Get the books by id
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ""
 *     security:
 *       - ApiKeyAuth: [read,write]
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Book'
 *       404:
 *         description: The book was not found
 *       500:
 *         description: Server Error
 */


router.get("/api/books/:id", async (req, res) => {
  try {
    // if (req.headers["authorization"] === "123456") {
    const { books } = req.app.db.data;
    const filteredbook = books.find(book => book.id === req.params.id)
    if (!filteredbook) {
      res.sendStatus(404)
    }
    res.json(filteredbook)
    // } else {
    //   res.status(401).send("NOT AUTHORIZED")
    // }
  } catch (error) {
    console.log(error)
    res.status("500").send(err.message)
  }
})

/**
 * @swagger
 * /api/books:
 *   post:
 *     tags: [Books]
 *     summary: Create a new book
 *     description: Create a new book
 *     security:
 *       - ApiKeyAuth: [read,write]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       201:
 *         description: The Book was successfully created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Book'
 *       500:
 *         description: Server Error
 */

router.post("/api/books", async (req, res) => {
  try {
    //if (req.headers["authorization"] === "123456") {
    const book = {
      id: nanoid(ideLength),
      ...req.body
    }
    req.app.db.data.books.push(book)
    req.app.db.write()
    res.status(201).json(book)
    //} else {
    //  res.status(401).send("NOT AUTHORIZED")
    //}
  } catch (err) {
    console.log(err)
    res.status("500").send(err.message)
  }
})

/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     summary: Update book by id
 *     title: Update book by id
 *     tags: [Books]
 *     security:
 *       - ApiKeyAuth: [read,write]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: string ID required
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: Book Updated
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Book'
 *       404:
 *         description: Book Not Found
 *       500:
 *         description: Server Error
*/


router.put("/api/books/:id", async (req, res) => {
  try {
    if (req.headers["authorization"] === "123456") {
      const otherbooks = req.app.db.data.books.filter(book => book.id !== req.params.id)
      const filteredbook = req.app.db.data.books.find(book => book.id === req.params.id)
      if (!filteredbook) {
        res.sendStatus(404)
      }
      const updatedBook = { ...filteredbook, ...req.body }
      const updatedAllBooks = [...otherbooks, updatedBook]
      req.app.db.data.books = updatedAllBooks;
      req.app.db.write()
      res.status(200).json(updatedAllBooks)
    } else {
      res.status(401).send("NOT AUTHORIZED")
    }
  } catch (error) {
    console.log(error)
    res.status("500").send(error.message)
  }
})


/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     summary: Delete book
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: 
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Book Not Found
 *       500:
 *         description: Server Error
 */

router.delete("/api/books/:id", async (req, res) => {
  try {
    const filteredbook = req.app.db.data.books.filter(book => book.id === req.params.id)
    if (!filteredbook) {
      res.sendStatus(404)
    }

    const otherbooks = req.app.db.data.books.filter(book => book.id !== req.params.id)
    req.app.db.data.books = otherbooks
    res.status(200).send("Record Deleted: " + filteredbook)
  } catch (error) {
    console.log(error)
    res.status("500").send(error.message)
  }
})

export default router;
