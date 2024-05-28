import express from "express";
import dotenv from 'dotenv';
import helmet from "helmet";
import cors from "cors";
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import morgan from 'morgan';

import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

import booksRouter from "./routes/books.js"
dotenv.config()
const PORT = process.env.PORT || 3001;

const adapter = new JSONFile("./config/db.json")
const defaultData = { books: [] }
const db = new Low(adapter, defaultData)
await db.read()
const app = express();
app.db = db;

app.use(cors())
app.use(helmet())
app.use(express.json())
app.use(morgan("dev"))

app.use(booksRouter)

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Medicrea API Explorer',
      description: 'Sandbox Instance for Validating Authenitication',
      version: '1.0.1',
    },
    servers: [
      {
        url: 'http://localhost:3001'
      },
    ]
  },
  apis: ['./routes/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions)
app.use("/swagger", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.get("/api", async (req, res) => {
  try {
    const message = { message: "Books API" }
    res.json(message);
  } catch (error) {
    console.log(error)
    res.status("500").send(error.message)
  }
});


app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`)
});