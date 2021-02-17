
// const Ingredient = require('../src/Ingredient.js');

class Recipe {
  constructor(recipe, ingredientsArray) {
    this.id = recipe.id;
    this.image = recipe.image;
    this.ingredients = this.mergeDuplicateIngredients(recipe.ingredients.map(ingredient => new Ingredient(ingredient.id, ingredient.quantity, ingredientsArray)))
    this.name = recipe.name;
    this.instructions = recipe.instructions;
    this.tags = recipe.tags;
  }

  getIngredients() {
    return this.ingredients.map(ingredient => ingredient.name);
  }

  getIngredientsCost() {
    let centsCost = this.ingredients.reduce((totalCost, ingredient) => totalCost += Math.round(ingredient.estimatedCost * ingredient.quantity.amount), 0);
    return `$${(centsCost / 100).toFixed(2)}`
  }

  returnInstructions() {
    let result =[]
    this.instructions.forEach(instruction => result.push(`${instruction.number}.) ${instruction.instruction}`))
    return result;
  }

  mergeDuplicateIngredients(ingredientsArray) {
    let newIngredientsArray = []
    ingredientsArray.forEach(ingredient => {
      if (ingredientsArray.filter(duplicateIngredient => duplicateIngredient.id === ingredient.id).length > 1) {
        let mergedIngredient = {
          id: ingredient.id,
          name: ingredient.name,
          estimatedCost: ingredient.estimatedCost,
          quantity: {
            amount: ingredientsArray.filter(duplicateIngredient => duplicateIngredient.id === ingredient.id).reduce((total, instance) => total += instance.quantity.amount, 0),
            unit: ingredient.unit
          }
        }
        newIngredientsArray.map(ingredient => ingredient.id).includes(mergedIngredient.id) ? null : newIngredientsArray.push(mergedIngredient)
      } else {
        newIngredientsArray.push(ingredient)
      }
    })
    return newIngredientsArray;
  }

}

if (typeof module !== 'undefined') {
  module.exports = Recipe;
}