// const User = require("./User");

let recipeRepository;
let currentUser;

const recipeCarousel = document.querySelector('.glide__slides');
const searchBox = document.querySelector('.search-box');
const allRecipesButton = document.querySelector('.all-recipes');
const allRecipesPage = document.querySelector('.all-recipes-page');
const searchPage = document.querySelector('.search-page')
const homePage = document.querySelector('.home-page')
const pageTitle = document.querySelector('.page-title')
const instruction = document.querySelector('.instruction')
const mealSuggestionContainer = document.querySelector(".meal-suggestion-container")
const instructionCardDirections = document.querySelector('.instruction-card-directions')
const navButtons = document.querySelector(".navigation-buttons");
const myRecipesButton = document.querySelector('.my-recipes');
const searchIcon = document.querySelector('.search-icon');
const searchButton = document.querySelector('.search-button');
const navigationBar = document.querySelector(".navigation-bar")
const pantryButton = document.querySelector(".pantry")
const pantryPage = document.querySelector(".pantry-page")
const groceryListPage = document.querySelector('.grocery-list-page')
const pages = document.querySelectorAll(".page")
const groceryListButton = document.querySelector('.grocery-list')
const groceryListForm = document.querySelector(".grocery-list-items")
const addToPantryButton = document.querySelector('.add-to-pantry')


const createKebab = (recipeName) => recipeName.toLowerCase().split(' ').join('-');

const compileRecipeRepository = () => {
  recipeRepository = new RecipeRepository(recipeData, ingredientsData)
}

const capitalizeWords = (phrase) => {
  let words = phrase.split(' ')
  let capitalized = words.map( word => word.charAt(0).toUpperCase() + word.slice(1, word.length))
  return capitalized.join(' ')
};


function loadRandomUser() {
  let randomUser = usersData[1] // userData[Math.floor(Math.random() * userData.length)]
  currentUser = new User(randomUser, 
    ingredientsData, 
    fetchLocalStorageData(`${randomUser.id}-favorites`), 
    fetchLocalStorageData(`${randomUser.id}-recipes-to-cook`),
    JSON.parse(localStorage.getItem(`${randomUser.id}-grocery-list`)));
}

function fetchLocalStorageData(library) {
  if (localStorage.getItem(library)) {
    return JSON.parse(localStorage.getItem(library)).map(storedID => recipeRepository.recipes.find(recipe => recipe.id === storedID.id));
  } else {
    return [];
  }
}

const loadPage = ((pageTo) => {
  pages.forEach( page => page.classList.add('hidden'));
  pageTo.classList.remove('hidden');
  if ((pageTo === homePage) || (pageTo === allRecipesPage)) {
    searchBox.classList.add('search-all-mode')
    searchBox.classList.remove('search-favs-mode')
    searchBox.placeholder = "Search all recipes";
  }
  searchBox.value = "";
});


const printInstructions = (recipe) => {
  return recipe.returnInstructions().reduce((acc, instruction) => {
     return acc += `<p class="instruction-card-steps">${instruction}</p>`}, '');
};

const printIngredients = (recipe) => {
  return recipe.ingredients.reduce((acc, ingredient) => {
    return acc += `
    <tr>
      <td class="instruction-card-ingredient">${capitalizeWords(ingredient.name)}</td>
      <td class="instruction-card-unit">${ingredient.quantity.amount.toFixed(2)} ${ingredient.quantity.unit}</td>
    </tr>`}, '');
};

const returnSelectedRecipe = (event) => {
  const clickedRecipe = event.target.closest('.recipe').className;
  return recipeRepository.recipes.find(recipe => clickedRecipe.includes(createKebab(recipe.name)));
};

const addToMyFavorites = (event) =>  {
  if (!event.target.className.includes('saved')) {
    currentUser.addRecipeToFavs(returnSelectedRecipe(event));
    event.target.classList.add('saved'); 
  } else {
    currentUser.removeRecipeFromFavs(returnSelectedRecipe(event));
    event.target.classList.remove('saved');
  }
  updateLocalStorage()
};

const toggleFavoriteButton = (recipe) => {
  if(currentUser.favoriteRecipes.map(recipe => recipe.id).includes(recipe.id)) {
    return "saved";
  };
};

const loadRecipeCard = (event) => {
  if (event.target.className.includes("recipe-card-button")) {
    addToMyFavorites(event);
  } else if(event.target.closest('.recipe')) {
    loadPage(homePage);
    instruction.classList.remove('hidden');
    const selectedRecipe = returnSelectedRecipe(event)
    instructionCardDirections.innerHTML = `
      <h1 class="instruction-card-recipe-name">${selectedRecipe.name}</h1>
      <h2 class="instruction-card-header">Directions</h2>
      <div class="direction-container">
        ${printInstructions(selectedRecipe)}
      </div>
      <h2 class="instruction-card-header">Ingredients</h2>
      <div class="ingredient-container">
        <table class="instruction-card-ingredient-list">
          ${printIngredients(selectedRecipe)}
        </table>
      </div>
      <button id=${selectedRecipe.id} class="lets-cook-button">Lets Cook</button>
    `
    document.querySelector('.instruction-card-img').src = selectedRecipe.image;
    document.location.href = "#recipeDetailsContainer";
    suggestRecipes();
  }
};


const loadSearchPage = (array) => {
  searchPage.innerHTML = "";
  loadPage(searchPage);
  array.map(recipe => searchPage.innerHTML += `
    <article class="recipe-card recipe ${createKebab(recipe.name)} ">
      <img class="recipe-card-img" src="${recipe.image}">
      <p class="recipe-card-name">${recipe.name}</p>
      <p class="recipe-card-cost">${recipe.getIngredientsCost()}</p>
      <button class="recipe-card-button ${toggleFavoriteButton(recipe)}"></button>
    </article>
  `);
};

const pickRandomRecipes = (amount) => {
  return recipeRepository.recipes.reduce((array, recipe) =>{
    const randomRecipe = recipeRepository.recipes[Math.floor(Math.random() * recipeRepository.recipes.length)];
    if(!array.includes(randomRecipe) && array.length < amount){
      array.push(randomRecipe);
    }
    return array;
  }, []);
};

const populateRecipeCarousel = () => {
  const carousel = pickRandomRecipes(15);
  carousel.forEach(recipe => {
    recipeCarousel.innerHTML += `
    <li class="glide__slide">
      <article class="recipe-card recipe recipe-card-carousel ${createKebab(recipe.name)}" >
        <img class="recipe-card-img" src="${recipe.image}">
        <p class="recipe-card-name">${recipe.name}</p>
        <p class="recipe-card-cost">${recipe.getIngredientsCost()}</p>
        <button class="recipe-card-button ${toggleFavoriteButton(recipe)}"></button>
      </article>
    </li>
    `
  });
};

const searchAllRecipes = (event) => {
  if ((event.key === "Enter" && searchBox.value && searchBox.classList.value.includes("search-all-mode")) || (event.target.className.includes("search-button") && searchBox.value && searchBox.classList.value.includes("search-all-mode") )) {
    event.preventDefault();
    loadSearchPage(recipeRepository.masterSearch(searchBox.value));
  } else if ((event.key === "Enter" && searchBox.value && searchBox.classList.value.includes("search-favs-mode")) || (event.target.className.includes("search-button") && searchBox.value && searchBox.classList.value.includes("search-favs-mode") )) {
    event.preventDefault()
    loadSearchPage(recipeRepository.masterSearch(searchBox.value)
    .filter(recipe => currentUser.favoriteRecipes
    .map(favorite => favorite.id)
    .includes(recipe.id)))
  }
};

const suggestRecipes = () => {
  document.querySelector('.meal-suggestion-container').innerHTML = "";
  const suggestions = pickRandomRecipes(3);
  suggestions.forEach(recipe => {
    document.querySelector('.meal-suggestion-container').innerHTML += `
      <article class="meal-suggestion recipe ${createKebab(recipe.name)}">
        <div class="img-cropper">
          <img class="zoom meal-suggestion-img" src="${recipe.image}">
        </div>
        <p class="meal-suggestion-name">${recipe.name}</p>
      </article>
    `
  });
};



const openDropDownMenu = (event) => {
    if(event.target.className.includes("drop-down")){
      navButtons.classList.add('flex');
    } else {
      navButtons.classList.remove('flex');
    };
};

const autoCloseMenu = () => {
  if(window.innerWidth > 800) {
    navButtons.classList.remove('flex');
    document.querySelector(".search").classList.remove('flex')
    document.querySelector(".search").reset();
    searchIcon.classList.remove('disabled')
  }
}
const loadPantryPage = () => {
  loadPage(pantryPage)
  document.querySelector(".pantry-list").innerHTML = ""
  currentUser.pantry.forEach(item => {
    document.querySelector(".pantry-list").innerHTML += `
    <tr class="pantry-table-row">
      <td class="pantry-list-item">${capitalizeWords(item.name)}</td>
      <td class="pantry-list-quantity">${item.quantity}</td>
    <tr>
    `
  })
}


const loadMobileSearch = (event) => {
  const target = event.target.className
  if (target.includes('search-icon')) {
    document.querySelector(".search").classList.toggle('flex')
    searchIcon.classList.toggle("disabled")
    document.querySelector(".search").reset();
  } else if(target.includes('search-button')){
    document.querySelector(".search").classList.remove('flex')
    searchIcon.classList.toggle("disabled")
  }
  searchAllRecipes(event)
}


// --------------------------------------------------------------------------------------------------

const cookCard = document.querySelector(".cook-recipe-card");
const ingredientsReport = document.querySelector(".ingredients-report");
const cookRecipeMessage = document.querySelector(".cook-recipe-message")
const cookCardInstructions = document.querySelector(".cook-card-instructions")
const ingredientConfirmationList = document.querySelector(".ingredient-confirmation-list")

const cookCardActionButton = document.querySelector(".cook-card-action")
const cookListAddRemoveButton = document.querySelector(".cook-list-action")
const cookCardCancelButton = document.querySelector(".cook-card-cancel")

// LOAD THE CARD
const loadCookCard = (event) => {
  let selectedRecipe = recipeRepository.recipes.find(recipe => recipe.id === parseInt(event.target.id))
  console.log(selectedRecipe)
  if(event.target.className.includes("lets-cook")) {
    cookCard.classList.remove("hidden")
    cookCardLayoutHandler(selectedRecipe)
  }
}

const cookCardLayoutHandler = (recipe) => {
  cookCardActionButton.id = recipe.id;
  if (currentUser.recipesToCook.map(savedRecipe => savedRecipe.id).includes(parseInt(recipe.id))) {
    cookCardSavedRecipeLayout(recipe); // 1 RECIPE IS ALREADY ON THE COOK LIST
  } else {
    cookCardUnsavedRecipeLayout(recipe); // 2 RECIPE IS NOT ON THE COOK LIST
  }
}

// 1 RECIPE IS ALREADY ON THE COOK LIST -----------------------------------------------------------------

const cookCardSavedRecipeLayout = (recipe) => {
  if (currentUser.hasSufficientIngredientsFor(recipe)) {
    readyToCookLayout(recipe); // 1.1 RECIPE IS ON THE COOK LIST AND USER HAS ENOUGH INGREDIENTS
  } else {
    notReadyToCookLayout(recipe); // 1.2 RECIPE IS ON THE COOK LIST BUT USER HAS INSUFFICIENT INGREDIENTS
  }
}

// 1.1)
const readyToCookLayout = (recipe) => {
  cookRecipeMessage.innerText = "You have enough ingredients for this recipe";
  compileIngredientsReport(recipe);
  cookCardInstructions.innerText = "Clicking COOK NOW will remove the needed ingredient amounts from your pantry";
  //ACTION BUTTON:
  cookCardActionButton.innerText = "COOK NOW";
  cookCardActionButton.classList = "cook-card-action cook-now";
  //ADD-REMOVE BUTTON:
  cookListAddRemoveButton.innerText = "REMOVE";
  cookListAddRemoveButton.classList = "cook-list-action remove";
}

// 1.2)
const notReadyToCookLayout = (recipe) => {
  cookRecipeMessage.innerText = "You still do not have enough ingredients for this recipe";
  compileIngredientsReport(recipe);
  cookCardInstructions.innerText = "Click below to add the missing ingredients to your grocery list"
  //ACTION BUTTON:
  cookCardActionButton.innerText = "ADD TO GROCERY"
  cookCardActionButton.classList = "cook-card-action add-to-grocery"

  //ADD-REMOVE BUTTON:
  cookListAddRemoveButton.innerText = "REMOVE";
  cookListAddRemoveButton.classList = "cook-list-action remove";
} 

// 2 RECIPE IS NOT ON THE COOK LIST ----------------------------------------------------------------------

const cookCardUnsavedRecipeLayout = (recipe) => {
  if (currentUser.hasSufficientIngredientsFor(recipe)) {
    sufficientIngredientsLayout(recipe) // 2.1 RECIPE IS NOT ON THE COOK LIST AND THE USER HAS ENOUGH INGREDIENTS
  } else {
    insufficientIngredientsLayout(recipe) // 2.2 RECIPE IS NOT ON THE COOK LIST AND USER HAS INSUFFICIENT INGREDIENTS
  }
}

// 2.1)
const sufficientIngredientsLayout = (recipe) => {
  cookRecipeMessage.innerText = "You have enough ingredients for this recipe";
  compileIngredientsReport(recipe);
  cookCardInstructions.innerText = "Clicking cook now will remove the ingredient amounts from your pantry";
  //ACTION BUTTON:
  cookCardActionButton.innerText = "COOK NOW";
  cookCardActionButton.classList = "cook-card-action cook-now";
  //ADD-REMOVE BUTTON:
  cookListAddRemoveButton.innerText = "ADD TO COOK LIST";
  cookListAddRemoveButton.classList = "cook-list-action add";
}

// 2.2)
const insufficientIngredientsLayout = (recipe) => {
  cookRecipeMessage.innerText = "You do not have enough ingredients for this recipe";
  compileIngredientsReport(recipe);
  cookCardInstructions.innerText = "Adding this recipe to your cook list will add the missing ingredients to your grocery list";
  //ACTION BUTTON:
  cookCardActionButton.classList = "cook-card-action hidden";
  //ADD-REMOVE BUTTON:
  cookListAddRemoveButton.innerText = "ADD TO COOK LIST";
  cookListAddRemoveButton.classList = "cook-list-action add";
  cookListAddRemoveButton.id = recipe.id;
}

// ---------COOK CARD BUTTON RESPONSES---------------------------------------

// cookCardActionButton
const cookCardActionResponse = () => {
  let selectedRecipe = findRecipeWithID(parseInt(cookCardActionButton.id))
  if (cookCardActionButton.classList.value === "cook-card-action cook-now") {
    currentUser.removeRecipeToCook(selectedRecipe);
    currentUser.removeRecipeIngredientAmounts(selectedRecipe);
    ingredientsRemovalConfirmation(selectedRecipe)
  } else if (cookCardActionButton.classList.value === "cook-card-action add-to-grocery") {
    let missingIngredients = currentUser.returnMissingIngredientsFor(selectedRecipe);
    currentUser.addToGroceryList(missingIngredients, selectedRecipe)
    addedToGroceryListConfirmation(selectedRecipe)
  }
}

const ingredientsRemovalConfirmation = (recipe) => {
  cookRecipeMessage.innerText = "Recipe complete! The following ingredient amounts were removed from your pantry";
  cookCardInstructions.innerText = "This recipe was removed from your cook list";
  cookCardActionButton.classList = "cook-card-action hidden";
  cookListAddRemoveButton.classList = "cook-list-action hidden";
  cookCardCancelButton.innerText = "OK";
  ingredientsReport.classList.add("hidden");
  ingredientConfirmationList.classList.remove("hidden");
  currentUser.compareIngredientsToPantry(recipe).forEach(ingredient => {
    ingredientConfirmationList.innerHTML += `
    <li class"enough">${ingredient.name} ${ingredient.required.toFixed(2)} ${ingredient.unit}</li>`;
  })
  updateLocalStorage(); 
}

const addedToGroceryListConfirmation = (recipe) => {
  if (!currentUser.returnMissingIngredientsFor(recipe).length) {
    cookRecipeMessage.innerText = `${recipe.name} was added to your list of recipes to cook`;
    ingredientsReport.classList.add("hidden");
    cookCardInstructions.classList.add("hidden")
    cookListAddRemoveButton.classList.add("hidden")
    cookCardActionButton.classList = "cook-card-action hidden";
    cookCardActionButton.classList = "cook-card-action hidden";
    cookCardCancelButton.innerText = "OK";
  } else {
    cookRecipeMessage.innerText = "The following items were added to your grocery list";
    ingredientsReport.classList.add("hidden");
    cookCardInstructions.classList.add("hidden")
    cookListAddRemoveButton.classList.add("hidden")
    ingredientConfirmationList.classList.remove("hidden");
    cookCardActionButton.classList = "cook-card-action hidden";
    cookCardActionButton.classList = "cook-card-action hidden";
    cookCardCancelButton.innerText = "OK";
    currentUser.returnMissingIngredientsFor(recipe).forEach(ingredient => {
      ingredientConfirmationList.innerHTML += `
        <li class="insufficient">${ingredient.name}</li>`
    })
  }
  updateLocalStorage()
}

const recipeToCookRemovalConfirmation = (recipe) => {
  cookRecipeMessage.innerText = `${recipe.name} was removed from your list of recipes to cook`;
  cookCardActionButton.classList = "cook-card-action hidden";
  cookCardActionButton.classList = "cook-card-action hidden";
  ingredientsReport.classList.add("hidden");
  cookCardInstructions.classList.add("hidden");
  cookListAddRemoveButton.classList.add("hidden");
  cookCardCancelButton.innerText = "OK";
  updateLocalStorage()
}

// cookListActionButton
const cookListAddRemoveHandler = () => {
  let selectedRecipe = findRecipeWithID(parseInt(cookCardActionButton.id))
  if (cookListAddRemoveButton.classList.value === "cook-list-action add") {
    let missingIngredients = currentUser.returnMissingIngredientsFor(selectedRecipe);
    currentUser.addRecipeToCook(selectedRecipe);
    currentUser.addToGroceryList(missingIngredients);
    addedToGroceryListConfirmation(selectedRecipe);
  } else if (cookListAddRemoveButton.classList.value === "cook-list-action remove") {
    currentUser.removeRecipeToCook(selectedRecipe);
    recipeToCookRemovalConfirmation(selectedRecipe);
  }
}
 
// --------------------------------------------------------------------------



//CANCEL OUT OF THE CARD
const cookCardHideAndReset = () => {
  cookCard.classList.add("hidden")
  cookCardCancelButton.innerText = "CANCEL"
  ingredientsReport.classList.remove("hidden")
  cookCardInstructions.classList.remove("hidden")
  resetIngredientsReport()
}

const resetIngredientsReport = () => {
  cookCardCancelButton.innerText = "Cancel"
  ingredientConfirmationList.innerHTML = ""
  ingredientConfirmationList.classList.add("hidden")
  ingredientsReport.innerHTML = `
    <tr>
      <th>Ingredient</th>
      <th>Required</th>
      <th>Pantry</th>
      <th>Enough?</th>
    </tr>`
}


//HELPER FUNCTIONS:

const updateLocalStorage = () => {
  localStorage.setItem(`${currentUser.id}-recipes-to-cook`, JSON.stringify(currentUser.recipesToCook))
  localStorage.setItem(`${currentUser.id}-favorites`, JSON.stringify(currentUser.favoriteRecipes))
  localStorage.setItem(`${currentUser.id}-grocery-list`, JSON.stringify(currentUser.groceryList))
}

const findRecipeWithID = (id) => {
  return recipeRepository.recipes.find(recipe => recipe.id === id);
}

const compileIngredientsReport = (recipe) => {
  currentUser.compareIngredientsToPantry(recipe).forEach(ingredient => {
    ingredientsReport.innerHTML += `
    <tr class="${ingredientsReportClassHandler(ingredient.difference)}">
      <td>${ingredient.name}</td>
      <td>${ingredient.required.toFixed(2)} ${ingredient.unit}</td>
      <td>${ingredient.pantry.toFixed(2)} ${ingredient.unit}</td>
      <td>${returnCheckMark(ingredient)}</td>
    </tr>`
  })
}

function ingredientsReportClassHandler(difference) {
  if (difference >= 0) {
    return 'enough'
  } else {
    return 'insufficient'
  }
}

function returnCheckMark(ingredient) {
  if (ingredient.difference >= 0) {
    return `✓`
  } else {
    return `${ingredient.difference.toFixed(2)} ${ingredient.unit}`
  }
}

const loadGroceryPage = () => {
  loadPage(groceryListPage) ;
  document.querySelector(".grocery-list-items").innerHTML = ""
  currentUser.groceryList.forEach(item => {
    document.querySelector(".grocery-list-items").innerHTML += `
       <input type="checkbox" class="grocery-item" value="${item.name}">   
       <label>${capitalizeWords(item.name)}</label><p class="quantity">${item.amountNeeded}</p><br>
    `
  });
};

const checkValue = () => {
  const items = document.querySelectorAll(".pantry-list-item")
  items.forEach(item => {
    if(item.checked){
      currentUser.groceryList.splice(currentUser.groceryList.indexOf(item.value), 1);
    };
  });
  const updatedGroceryList = currentUser.groceryList;
  localStorage.setItem('2-grocery-list', JSON.stringify(updatedGroceryList));
  loadGroceryPage();
};

// -------------------------------------------------

window.addEventListener('load', compileRecipeRepository);
window.addEventListener('load', loadRandomUser);

window.addEventListener('load', populateRecipeCarousel);
recipeCarousel.addEventListener('click', () => loadRecipeCard(event));
searchPage.addEventListener('click', () => loadRecipeCard(event));
pageTitle.addEventListener('click', () => loadPage(homePage));
mealSuggestionContainer.addEventListener("click", () => loadRecipeCard(event));
document.addEventListener('keydown', searchAllRecipes)

allRecipesButton.addEventListener('click', () => {
  loadSearchPage(recipeRepository.recipes)
  searchBox.classList.add('search-all-mode')
  searchBox.classList.remove('search-favs-mode')
  searchBox.placeholder = "Search all recipes";
});

myRecipesButton.addEventListener("click", () => {
  loadSearchPage(currentUser.favoriteRecipes)
  searchBox.classList.remove('search-all-mode')
  searchBox.classList.add('search-favs-mode')
  searchBox.placeholder = "Search favorite recipes";
})

window.addEventListener('click', () => openDropDownMenu(event))
window.addEventListener("resize", autoCloseMenu);
navigationBar.addEventListener("click", () => loadMobileSearch(event))
instructionCardDirections.addEventListener("click", () => loadCookCard(event))
pantryButton.addEventListener("click", loadPantryPage)


cookCardActionButton.addEventListener('click', cookCardActionResponse)
cookListAddRemoveButton.addEventListener('click', cookListAddRemoveHandler)
cookCardCancelButton.addEventListener('click', cookCardHideAndReset)
groceryListButton.addEventListener('click', loadGroceryPage)
addToPantryButton.addEventListener('click', checkValue)