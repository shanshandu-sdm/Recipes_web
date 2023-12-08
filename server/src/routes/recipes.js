import express from "express"
import mongoose from "mongoose"
import { RecipesModel } from "../models/Recipes.js"
import { UserModel } from "../models/Users.js"
import { verifyToken } from "./user.js"

const router = express.Router()

router.get("/", async (req, res) => {
  try {
    const result = await RecipesModel.find({})
    res.status(200).json(result)
  } catch (err) {
    res.status(500).json(err)
  }
})

//1 Create a new recipe,  verifyToken if we login in, we can not create recipes
router.post("/", verifyToken, async (req, res) => {
  const recipe = new RecipesModel({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    image: req.body.image,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions,
    imageUrl: req.body.imageUrl,
    cookingTime: req.body.cookingTime,
    userOwner: req.body.userOwner,
  })
  console.log(recipe)

  try {
    const result = await recipe.save()
    res.status(201).json({
      createdRecipe: {
        name: result.name,
        image: result.image,
        ingredients: result.ingredients,
        instructions: result.instructions,
        _id: result._id,
      },
    })
  } catch (err) {
    // console.log(err);
    res.status(500).json(err)
  }
})

//2 Get a recipe by ID
router.get("/:recipeId", async (req, res) => {
  try {
    const result = await RecipesModel.findById(req.params.recipeId)
    res.status(200).json(result)
  } catch (err) {
    res.status(500).json(err)
  }
})

//3. Save a Recipe
router.put("/", async (req, res) => {
  const recipe = await RecipesModel.findById(req.body.recipeID)
  const user = await UserModel.findById(req.body.userID)
  try {
    user.savedRecipes.push(recipe)
    await user.save()
    res.status(201).json({ savedRecipes: user.savedRecipes })
  } catch (err) {
    res.status(500).json(err)
  }
})

//4 Get id of saved recipes
router.get("/savedRecipes/ids/:userId", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId)
    res.status(201).json({ savedRecipes: user?.savedRecipes })
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
})

// 5 Get saved recipes
router.get("/savedRecipes/:userId", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId)
    const savedRecipes = await RecipesModel.find({
      _id: { $in: user.savedRecipes },
    })

    console.log(savedRecipes)
    res.status(201).json({ savedRecipes })
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
})

export { router as recipesRouter }