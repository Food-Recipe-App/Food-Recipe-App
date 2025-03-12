const Dish = require('../models/Dish');
const Recipe = require('../models/Recipe');
const Ingredient = require('../models/Ingredient');
const Review = require('../models/Review');
const User = require('../models/User');

// Lấy danh sách món ăn (RecipeList)
exports.getAllDishes = async (req, res) => {
    try {
        const dishes = await Dish.find().populate({
            path: 'recipe',
            populate: { path: 'ingredient' }
        });

        const recipeList = dishes.map(dish => ({
            id: dish._id,
            name: dish.name,
            image: dish.image,
            description: dish.description,
            category: dish.category,
            difficulty: dish.recipe.difficulty,
            time: `${dish.recipe.cookTimeMinutes} phút`,
            calories: dish.recipe.calories
        }));

        res.status(200).json(recipeList);
    } catch (error) {
        console.error('❌ Lỗi lấy danh sách món ăn:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy danh sách món ăn' });
    }
};
exports.getDishById = async (req, res) => {
    try {
        const dish = await Dish.findById(req.params.id)
            .populate({
                path: 'recipe',
                populate: { path: 'ingredient' }
            })
            .lean();

        if (!dish) {
            return res.status(404).json({ message: 'Không tìm thấy món ăn với ID đã cho' });
        }

        // Lấy danh sách đánh giá liên quan đến món ăn
        const reviews = await Review.find({ dish: req.params.id })
            .populate('user', 'username avatar') // Lấy thông tin user
            .lean();

        const recipeDetail = {
            id: dish._id,
            name: dish.name,
            image: dish.image,
            description: dish.description,
            category: dish.category,
            difficulty: dish.recipe.difficulty,
            time: `${dish.recipe.cookTimeMinutes} phút`,
            calories: dish.recipe.calories,
            ingredients: dish.recipe.ingredient.map(ing => ing.name),
            instructions: dish.recipe.instructions,
            reviews: reviews.map(review => ({
                id: review._id,
                username: review.user.username,
                avatar: review.user.avatar,
                rating: review.rating,
                comment: review.review
            }))
        };

        res.status(200).json(recipeDetail);
    } catch (error) {
        console.error('❌ Lỗi khi lấy thông tin món ăn:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy thông tin món ăn' });
    }
};
//Lấy chi tiết món ăn (RecipeDetail)
// exports.getDishById = async (req, res) => {
//     try {
//         const dish = await Dish.findById(req.params.id).populate({
//             path: 'recipe',
//             populate: { path: 'ingredient' }
//         });
        

//         if (!dish) {
//             return res.status(404).json({ message: 'Không tìm thấy món ăn với ID đã cho' });
//         }

//         const recipeDetail = {
//             id: dish._id,
//             name: dish.name,
//             image: dish.image,
//             description: dish.description,
//             category: dish.category,
//             difficulty: dish.recipe.difficulty,
//             time: `${dish.recipe.cookTimeMinutes} phút`,
//             calories: dish.recipe.calories,
//             ingredients: dish.recipe.ingredient.map(ing => ing.name),
//             instructions: dish.recipe.instructions
//         };

//         res.status(200).json(recipeDetail);
//     } catch (error) {
//         console.error('❌ Lỗi khi lấy thông tin món ăn:', error);
//         res.status(500).json({ message: 'Lỗi server khi lấy thông tin món ăn' });
//     }
// };