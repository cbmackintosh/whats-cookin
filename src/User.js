// const Ingredient = require('../src/Ingredient.js');

class User {
  constructor(userData, ingredientsArray) {
    this.name = userData.name
    this.id = userData.id
    this.pantry = userData.pantry.map(pantryItem => new Ingredient(pantryItem.ingredient, pantryItem.amount, ingredientsArray))
    this.favoriteRecipes = localStorage.getItem(`${this.id}-favorites`) ? JSON.parse(localStorage.getItem(`${this.id}-favorites`)).map(storedID => recipeRepository.recipes.find(recipe => recipe.id === storedID.id)) : [];
    this.recipesToCook = localStorage.getItem(`${this.id}-recipes-to-cook`) ? JSON.parse(localStorage.getItem(`${this.id}-recipes-to-cook`)).map(storedID => recipeRepository.recipes.find(recipe => recipe.id === storedID.id)) : [];
  }
  
  addRecipeToFavs(recipe) {
    if (!this.checkForRecipe(recipe, this.favoriteRecipes)) {
      this.favoriteRecipes.push(recipe)
      localStorage.setItem(`${this.id}-favorites`, JSON.stringify(this.favoriteRecipes))
    }
  }

  removeRecipeFromFavs(recipe) {
    this.favoriteRecipes.splice(this.favoriteRecipes.indexOf(this.favoriteRecipes.find(savedRecipe => savedRecipe.id === recipe.id)), 1)
    localStorage.setItem(`${this.id}-favorites`, JSON.stringify(this.favoriteRecipes))
  }

  addRecipeToCook(recipe) {
    if (!this.checkForRecipe(recipe, this.recipesToCook)) {
      this.recipesToCook.push(recipe)
      localStorage.setItem(`${this.id}-recipes-to-cook`, JSON.stringify(this.recipesToCook))
    }
  }

  checkForRecipe(recipe, recipeArray) {
    return recipeArray.map(recipe => recipe.id).includes(recipe.id);
  }

}

if (typeof module !== 'undefined') {
  module.exports = User;
}