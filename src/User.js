// const Ingredient = require('../src/Ingredient.js');


class User {
  constructor(userData, ingredientsArray, storedFavs, storedRecipesToCook) {
    this.name = userData.name
    this.id = userData.id
    this.pantry = userData.pantry.map(pantryItem => new Ingredient(pantryItem.ingredient, pantryItem.amount, ingredientsArray))
    this.favoriteRecipes = storedFavs ? storedFavs : [];
    this.recipesToCook = storedRecipesToCook ? storedRecipesToCook : [];
    this.groceryList = [];
  }
  
  addRecipeToFavs(recipe) {
    if (!this.favoriteRecipes.map(recipe => recipe.id).includes(recipe.id)) {
      this.favoriteRecipes.push(recipe)
    }
  }

  removeRecipeFromFavs(recipe) {
    this.favoriteRecipes.splice(this.favoriteRecipes.indexOf(this.favoriteRecipes.find(savedRecipe => savedRecipe.id === recipe.id)), 1)
  }

  addRecipeToCook(recipe) {
    if (!this.recipesToCook.map(recipe => recipe.id).includes(recipe.id)) {
      this.recipesToCook.push(recipe)
      // localStorage.setItem(`${this.id}-recipes-to-cook`, JSON.stringify(this.recipesToCook))
    }
  }

  removeRecipeToCook(recipe) {
    this.recipesToCook.splice(this.recipesToCook.indexOf(this.recipesToCook.find(savedRecipe => savedRecipe.id === recipe.id)), 1)
  }

  hasSufficientIngredientsFor(recipe) {
    if (this.compareIngredientsToPantry(recipe).find(element => element.difference < 0)) {
      return false;
    } else {
      return true;
    }
  }

  compareIngredientsToPantry(recipe) {
    let summary = []
    let requiredIngredients = recipe.ingredients
    requiredIngredients.forEach(ingredient => summary.push({
      ingredient: ingredient.name, 
      required: ingredient.quantity.amount, 
      pantry: this.findAmountInPantryOf(ingredient), 
      difference: this.findAmountInPantryOf(ingredient) - ingredient.quantity.amount,
      unit: ingredient.quantity.unit,
    }))
    return summary
  }

  findAmountInPantryOf(ingredient) {
    let matchedIngredient = this.pantry.find(pantryItem => pantryItem.id === ingredient.id)
    if (!matchedIngredient) {
      return 0
    } else {
      return matchedIngredient.quantity
    }
  }

  returnMissingIngredientsFor(recipe) {
    return this.compareIngredientsToPantry(recipe).filter(ingredient => ingredient.difference < 0).map(ingredient => ingredient.ingredient)
  }

  addToGroceryList(array) {
    this.groceryList = Array.from(new Set(this.groceryList.concat(array)))
  }

}

if (typeof module !== 'undefined') {
  module.exports = User;
}