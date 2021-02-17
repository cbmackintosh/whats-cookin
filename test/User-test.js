const chai = require('chai');
const expect = chai.expect;
const data = require('../data/helper-data.js');

const Ingredient = require('../src/Ingredient.js');
const RecipeRepository = require('../src/RecipeRepository');
const User = require('../src/User.js');
const Recipe = require("../src/Recipe");


describe('User', () => {

  it('should accept userData and an Ingredients array to instantiate a new User object', () => {
    let user = new User(data.usersData[0], data.ingredientsData)
    expect(user).to.be.an.instanceof(User)
    expect(user.pantry[0]).to.be.an.instanceof(Ingredient);
  })

  it('should have an empty array of favorites if arument is null, undefined, or not present in the constructor method', () => {
    let user = new User(data.usersData[0], data.ingredientsData)
    expect(user.favoriteRecipes).to.deep.equal([])
    expect(user.recipesToCook).to.deep.equal([])

    let user2 = new User(data.usersData[0], data.ingredientsData, null, null)
    expect(user2.favoriteRecipes).to.deep.equal([])
    expect(user2.recipesToCook).to.deep.equal([])

  })

  it('should be able to add recipes to its array of favorites', () => {
    let user = new User(data.usersData[0], data.ingredientsData)
    let recipeRepository = new RecipeRepository(data.recipeData, data.ingredientsData)

    user.addRecipeToFavs(recipeRepository.recipes[0])
    expect(user.favoriteRecipes).to.deep.equal([recipeRepository.recipes[0]])
    user.addRecipeToFavs(recipeRepository.recipes[1])
    expect(user.favoriteRecipes).to.deep.equal([recipeRepository.recipes[0], recipeRepository.recipes[1]])

  })

  it('should not be able to add duplicate recipes to its list of favorites', () => {
    let user = new User(data.usersData[0], data.ingredientsData)
    let recipeRepository = new RecipeRepository(data.recipeData, data.ingredientsData)

    user.addRecipeToFavs(recipeRepository.recipes[0])
    user.addRecipeToFavs(recipeRepository.recipes[0])
    user.addRecipeToFavs(recipeRepository.recipes[0])

    expect(user.favoriteRecipes).to.deep.equal([recipeRepository.recipes[0]])
    expect(user.favoriteRecipes.length).to.deep.equal(1)
  })

  it('should be able to remove recipes from its array of favorites', () => {
    let user = new User(data.usersData[0], data.ingredientsData)
    let recipeRepository = new RecipeRepository(data.recipeData, data.ingredientsData)
    
    user.addRecipeToFavs(recipeRepository.recipes[0])
    user.removeRecipeFromFavs(recipeRepository.recipes[0])

    expect(user.favoriteRecipes).to.deep.equal([]);
  })

  it('should be able to add recipes to its list of recipes to cook', () => {
    let user = new User(data.usersData[0], data.ingredientsData)
    let recipeRepository = new RecipeRepository(data.recipeData, data.ingredientsData)

    user.addRecipeToCook(recipeRepository.recipes[0])
    expect(user.recipesToCook).to.deep.equal([recipeRepository.recipes[0]])
    user.addRecipeToCook(recipeRepository.recipes[1])
    expect(user.recipesToCook).to.deep.equal([recipeRepository.recipes[0], recipeRepository.recipes[1]])

  })

  it('should not be able to add duplicate recipes to its list of recipes to cook', () => {
    let user = new User(data.usersData[0], data.ingredientsData)
    let recipeRepository = new RecipeRepository(data.recipeData, data.ingredientsData)

    user.addRecipeToCook(recipeRepository.recipes[0])
    user.addRecipeToCook(recipeRepository.recipes[0])
    user.addRecipeToCook(recipeRepository.recipes[0])

    expect(user.recipesToCook).to.deep.equal([recipeRepository.recipes[0]])
    expect(user.recipesToCook.length).to.deep.equal(1)
  })

  it('should be able to remove a recipe from its todo list once it has been cooked', () => {
    let user = new User(data.usersData[0], data.ingredientsData)
    let recipeRepository = new RecipeRepository(data.recipeData, data.ingredientsData)

    user.addRecipeToCook(recipeRepository.recipes[0])
    user.removeRecipeToCook(recipeRepository.recipes[0])

    expect(user.favoriteRecipes).to.deep.equal([]);

  })


  it('should be able to determine if its pantry contains enough ingredients for a recipe', () => {
    let user = new User(data.usersData[0], data.ingredientsData);
    let recipe = new Recipe(data.recipeData[0], data.ingredientsData);

    expect(user.hasSufficientIngredientsFor(recipe)).to.deep.equal(false);
  })

  it('should be able to find the amount of a specific ingredient in the pantry', () => {
    let user = new User(data.usersData[0], data.ingredientsData);
    let ingredient = new Ingredient(data.ingredientsData[0].id, 0, data.ingredientsData);

    expect(user.findAmountInPantryOf(ingredient)).to.deep.equal(user.pantry.find(pantryItem => pantryItem.id === ingredient.id).quantity);
    expect(user.findAmountInPantryOf(ingredient)).to.deep.equal(4);
  })

  it('should return 0 if the ingredient is not in the pantry', () => {
    let user = new User(data.usersData[0], data.ingredientsData);
    let ingredient = new Ingredient(data.ingredientsData[3].id, 0, data.ingredientsData);
    expect(user.findAmountInPantryOf(ingredient)).to.deep.equal(0);
  })

  it('should return an array of missing ingredients for a recipe indicating the amount needed', () => {
    let user = new User(data.usersData[0], data.ingredientsData);
    let recipe = new Recipe(data.recipeData[0], data.ingredientsData);

    expect(user.returnMissingIngredientsFor(recipe)).to.be.a('array');
    expect(user.returnMissingIngredientsFor(recipe).length).to.deep.equal(2);

    let missingIngredient = user.returnMissingIngredientsFor(recipe)[0];
    let missingIngredientRecipe = recipe.ingredients.find(ingredient => ingredient.id === missingIngredient.id);
    let missingIngredientPantryAmount = user.findAmountInPantryOf(missingIngredientRecipe);

    expect(missingIngredient.amountNeeded).to.deep.equal(missingIngredientRecipe.quantity.amount - missingIngredientPantryAmount);
  })

  it('should be able to add missing ingredients for a recipe to the grocery list', () => {
    let user = new User(data.usersData[0], data.ingredientsData);
    let recipe = new Recipe(data.recipeData[0], data.ingredientsData);
    let missingIngredients = user.returnMissingIngredientsFor(recipe);

    user.addToGroceryList(missingIngredients, recipe);
    expect(user.groceryList).to.deep.equal(missingIngredients);
  })

  it('should not create duplicate items in the grocery list array but increase the quantity of existing items', () => {
    let user = new User(data.usersData[0], data.ingredientsData);
    let recipe = new Recipe(data.recipeData[0], data.ingredientsData);
    let missingIngredients = user.returnMissingIngredientsFor(recipe);

    user.addToGroceryList(missingIngredients, recipe);
    user.addToGroceryList(missingIngredients, recipe);
    user.addToGroceryList(missingIngredients, recipe);
    
    expect(user.groceryList.length).to.deep.equal(2);
  })

  it('should be able to add grocery Items to the pantry', () => {
    let user = new User(data.usersData[0], data.ingredientsData);
    let recipe = new Recipe(data.recipeData[0], data.ingredientsData);
    let missingIngredients = user.returnMissingIngredientsFor(recipe);
    let groceryItem = missingIngredients[0]
    user.addIngredientToPantry(groceryItem, data.ingredientsData);

    expect(user.pantry[user.pantry.length - 1].name).to.deep.equal(groceryItem.name);
    expect(user.pantry[user.pantry.length - 1].quantity).to.deep.equal(groceryItem.amountNeeded);
  })

  it('should not create duplicate pantry items, but add to the quantity of existing pantry items', () => {
    let user = new User(data.usersData[0], data.ingredientsData);
    let recipe = new Recipe(data.recipeData[0], data.ingredientsData);
    let missingIngredients = user.returnMissingIngredientsFor(recipe);
    let groceryItem = missingIngredients[0];

    user.addIngredientToPantry(groceryItem, data.ingredientsData);
    user.addIngredientToPantry(groceryItem, data.ingredientsData);
    user.addIngredientToPantry(groceryItem, data.ingredientsData);

    expect(user.pantry[user.pantry.length - 1].quantity).to.deep.equal(groceryItem.amountNeeded * 3);
  });

})

