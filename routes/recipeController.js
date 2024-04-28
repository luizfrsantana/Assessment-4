import express from 'express';
import authenticateToken from '../middlewares/authenticateToken.js';
import Recipe from '../models/Recipe.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const recipes = await Recipe.find();
        console.log("Recipes retrieved successfully")
        res.json({ message: "Recipes retrieved successfully", recipes: recipes });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

router.post('/', authenticateToken, async (req, res) => {
    let { title, ingredients, instructions, category } = req.body;

    const recipeData = {
        title: title,
        ingredients: ingredients,
        instructions: instructions,
        category: category,
        creator: req.user.userId
    };
    try {
        const newRecipe = new Recipe(recipeData);
        await newRecipe.save();
        console.log("Recipe saved successfully")
        res.json({ message: "Recipe saved successfully", recipe: newRecipe });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: "Validation error", errors: error.errors });
        }
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

router.put('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { title, ingredients, instructions, category } = req.body;
    try {
        const recipe = await Recipe.findById(id);
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        if (recipe.creator.toString() !== req.user.userId) {
            return res.status(403).json({ message: "User not authorized to update this recipe because he is not the owner" });
        }

        const updatedRecipe = await Recipe.findByIdAndUpdate(id, {
            title,
            ingredients,
            instructions,
            category
        }, { new: true, runValidators: true });

        console.log("Recipe updated successfully");
        res.json({ message: "Recipe updated successfully", recipe });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: "Validation error", errors: error.errors });
        }
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        const recipe = await Recipe.findById(id);
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        if (recipe.creator.toString() !== req.user.userId) {
            return res.status(403).json({
                message: "User not authorized to delete this recipe because he is not the owner"
            });
        }

        await Recipe.findByIdAndDelete(id);
        console.log("Recipe deleted successfully");
        res.json({ message: "Recipe deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

export default router;