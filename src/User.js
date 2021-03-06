// const Ingredient = require('../src/Ingredient.js');

class User {
  constructor(userData, ingredientsArray, storedFavs, storedRecipesToCook, storedGroceryList) {
    this.name = userData.name
    this.id = userData.id
    this.pantry = userData.pantry.map(pantryItem => new Ingredient(pantryItem.ingredient, pantryItem.amount, ingredientsArray))
    this.favoriteRecipes = storedFavs ? storedFavs : [];
    this.recipesToCook = storedRecipesToCook ? storedRecipesToCook : [];
    this.groceryList = storedGroceryList ? storedGroceryList : [];
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
    } else {
      return true
    }
  }

  removeRecipeToCook(recipe) {
    this.recipesToCook.splice(this.recipesToCook.indexOf(this.recipesToCook.find(savedRecipe => savedRecipe.id === recipe.id)), 1)
  }

  hasSufficientIngredientsFor(recipe) {
    if (!this.returnMissingIngredientsFor(recipe).length) {
      return true;
    } else {
      return false;
    }
  }

  compareIngredientsToPantry(recipe) {
    let summary = []
    let requiredIngredients = recipe.ingredients
    requiredIngredients.forEach(ingredient => summary.push({
      id: ingredient.id,
      name: ingredient.name, 
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
    return this.compareIngredientsToPantry(recipe).filter(ingredient => ingredient.difference < 0).map(ingredient => { 
      return {
        id: ingredient.id,
        name: ingredient.name,
        amountNeeded: Math.ceil(Math.abs(ingredient.difference))
      }
    })
  }

  addToGroceryList(array, recipe) {
    if (this.addRecipeToCook(recipe)) {
      return
    }
    array.forEach(item => {
      this.groceryList.forEach( grocery => {
        if(grocery.name === item.name) {
          grocery.amountNeeded += item.amountNeeded
        }
      })
      if(!this.groceryList.some( grocery => grocery.id === item.id)){
        this.groceryList.push(item)
      }
    })
  }

  removeRecipeIngredientAmounts(recipe) {
    recipe.ingredients.map(ingredient => this.pantry.find(pantryItem => pantryItem.id === ingredient.id).quantity -= ingredient.quantity.amount)
  }

  addIngredientToPantry(ingredient, ingredientsArray) {
    this.pantry.forEach(item => {
      if(item.id === ingredient.id){
        item.quantity += ingredient.amountNeeded;
      };
    });
    if (!this.pantry.some(item => item.id === ingredient.id)) {
      this.pantry.push(new Ingredient(ingredient.id, ingredient.amountNeeded, ingredientsArray));
    };
  };
}

if (typeof module !== 'undefined') {
  module.exports = User;
}