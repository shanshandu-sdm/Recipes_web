import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import { userRouter } from "./routes/user.js"
import { recipesRouter } from "./routes/recipes.js"

const app = express()

app.use(express.json())
app.use(cors())

app.use("/auth", userRouter)
app.use("/recipes", recipesRouter)

mongoose.connect(
  "mongodb+srv://shanshandu1234:Woshiduge187@cs458finalproject.5x6wz7d.mongodb.net/CS458FinalProject?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)

app.listen(3001, () => console.log("Server started"))