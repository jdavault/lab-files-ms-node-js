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
 *     User:
 *       type: object
 *       required:
 *         - title
 *         - author
 *       properties:
 *         title:
 *           type: string
 *           description: The user text
 *         author:
 *           type: string
 *           description: Author of user
 *       example:
 *         title: Harry Potter
 *         author: "J. K. Rowling"
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Users API
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
//   res.send("Welcome to bsersDb -- <a href='http://localhost:3003/swagger'>http://localhost:3003/swagger<a>")
// })


/**
 * @swagger
 * /api/users:
 *   get:
 *     tags: [Users] 
 *     summary: Returns all users
 *     description: Returns all users
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
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Server Error
 */

router.get("/api/users", async (req, res) => {
  try {
    //if (req.headers["authorization"] === "123456") {
    const { users } = req.app.db.data;
    res.json(users);
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
 * /api/users/{id}:
 *   get:
 *     summary: Get the users by id
 *     tags: [Users]
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
 *                $ref: '#/components/schemas/User'
 *       404:
 *         description: The user was not found
 *       500:
 *         description: Server Error
 */


router.get("/api/users/:id", async (req, res) => {
  try {
    //if (req.headers["authorization"] === "123456") {
    const { users } = req.app.db.data;
    const filteredbser = users.find(user => user.id === req.params.id)
    if (!filteredbser) {
      res.sendStatus(404)
    }
    res.json(filteredbser)
    //} else {
    //  res.status(401).send("NOT AUTHORIZED")
    //}
  } catch (error) {
    console.log(error)
    res.status("500").send(err.message)
  }
})

/**
 * @swagger
 * /api/users:
 *   post:
 *     tags: [Users]
 *     summary: Create a new user
 *     description: Create a new user
 *     security:
 *       - ApiKeyAuth: [read,write]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: The User was successfully created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/User'
 *       500:
 *         description: Server Error
 */

router.post("/api/users", async (req, res) => {
  try {
    //if (req.headers["authorization"] === "123456") {
    const user = {
      id: nanoid(ideLength),
      ...req.body
    }
    req.app.db.data.users.push(user)
    req.app.db.write()
    res.status(201).json(user)
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
 * /api/users/{id}:
 *   put:
 *     summary: Update user by id
 *     title: Update user by id
 *     tags: [Users]
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
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User Updated
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/User'
 *       404:
 *         description: User Not Found
 *       500:
 *         description: Server Error
*/


router.put("/api/users/:id", async (req, res) => {
  try {
    if (req.headers["authorization"] === "123456") {
      const otherbsers = req.app.db.data.users.filter(user => user.id !== req.params.id)
      const filteredbser = req.app.db.data.users.find(user => user.id === req.params.id)
      if (!filteredbser) {
        res.sendStatus(404)
      }
      const updatedBser = { ...filteredbser, ...req.body }
      const updatedAllBsers = [...otherbsers, updatedBser]
      req.app.db.data.users = updatedAllBsers;
      req.app.db.write()
      res.status(200).json(updatedAllBsers)
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
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
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
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User Not Found
 *       500:
 *         description: Server Error
 */

router.delete("/api/users/:id", async (req, res) => {
  try {
    const filteredbser = req.app.db.data.users.filter(user => user.id === req.params.id)
    if (!filteredbser) {
      res.sendStatus(404)
    }

    const otherbsers = req.app.db.data.users.filter(user => user.id !== req.params.id)
    req.app.db.data.users = otherbsers
    res.status(200).send("Record Deleted: " + filteredbser)
  } catch (error) {
    console.log(error)
    res.status("500").send(error.message)
  }
})

export default router;
