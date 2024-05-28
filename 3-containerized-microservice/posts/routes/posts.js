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
 *     Notes:
 *       type: object
 *       required:
 *         - title
 *         - author
 *       properties:
 *         title:
 *           type: string
 *           description: The post text
 *         author:
 *           type: string
 *           description: Author of post
 *       example:
 *         title: Harry Potter
 *         author: "J. K. Rowling"
 */

/**
 * @swagger
 * tags:
 *   name: Notess
 *   description: Posts API
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
 * /api/posts:
 *   get:
 *     tags: [Posts] 
 *     summary: Returns all posts
 *     description: Returns all posts
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
 *                 $ref: '#/components/schemas/Notes'
 *       500:
 *         description: Server Error
 */

router.get("/api/posts", async (req, res) => {
  try {
    //if (req.headers["authorization"] === "123456") {
    const { posts } = req.app.db.data;
    res.json(posts);
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
 * /api/posts/{id}:
 *   get:
 *     summary: Get the posts by id
 *     tags: [Posts]
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
 *                $ref: '#/components/schemas/Notes'
 *       404:
 *         description: The post was not found
 *       500:
 *         description: Server Error
 */


router.get("/api/posts/:id", async (req, res) => {
  try {
    // if (req.headers["authorization"] === "123456") {
    const { posts } = req.app.db.data;
    const filteredbook = posts.find(post => post.id === req.params.id)
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
 * /api/posts:
 *   post:
 *     tags: [Posts]
 *     summary: Create a new post
 *     description: Create a new post
 *     security:
 *       - ApiKeyAuth: [read,write]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Notes'
 *     responses:
 *       201:
 *         description: The Notes was successfully created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Notes'
 *       500:
 *         description: Server Error
 */

router.post("/api/posts", async (req, res) => {
  try {
    //if (req.headers["authorization"] === "123456") {
    const post = {
      id: nanoid(ideLength),
      ...req.body
    }
    req.app.db.data.posts.push(post)
    req.app.db.write()
    res.status(201).json(post)
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
 * /api/posts/{id}:
 *   put:
 *     summary: Update post by id
 *     title: Update post by id
 *     tags: [Posts]
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
 *             $ref: '#/components/schemas/Notes'
 *     responses:
 *       200:
 *         description: Notes Updated
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Notes'
 *       404:
 *         description: Notes Not Found
 *       500:
 *         description: Server Error
*/


router.put("/api/posts/:id", async (req, res) => {
  try {
    if (req.headers["authorization"] === "123456") {
      const otherbooks = req.app.db.data.posts.filter(post => post.id !== req.params.id)
      const filteredbook = req.app.db.data.posts.find(post => post.id === req.params.id)
      if (!filteredbook) {
        res.sendStatus(404)
      }
      const updatedBook = { ...filteredbook, ...req.body }
      const updatedAllBooks = [...otherbooks, updatedBook]
      req.app.db.data.posts = updatedAllBooks;
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
 * /api/posts/{id}:
 *   delete:
 *     summary: Delete post
 *     tags: [Posts]
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
 *               $ref: '#/components/schemas/Notes'
 *       404:
 *         description: Notes Not Found
 *       500:
 *         description: Server Error
 */

router.delete("/api/posts/:id", async (req, res) => {
  try {
    const filteredbook = req.app.db.data.posts.filter(post => post.id === req.params.id)
    if (!filteredbook) {
      res.sendStatus(404)
    }

    const otherbooks = req.app.db.data.posts.filter(post => post.id !== req.params.id)
    req.app.db.data.posts = otherbooks
    res.status(200).send("Record Deleted: " + filteredbook)
  } catch (error) {
    console.log(error)
    res.status("500").send(error.message)
  }
})

export default router;
