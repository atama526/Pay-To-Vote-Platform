import express, { json } from "express"
import cors from "cors"
import dotenv from "dotenv"
import routes from "./routes.js"

dotenv.config({ path: "./config.env" })

const port = 8002
const app = express()
app.use(cors())
app.use(json())
app.use(routes)


//starting server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`)
})
