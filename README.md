# What's Cookin'?

**By:**
* Steven Mancine (https://github.com/itsnameissteven)
* Cameron Mackintosh (https://github.com/cbmackintosh)

**Abstract:**

Whats Cookin' is a recipe tracking / meal planning application that allows users to view their favorite recipes and plan shopping trips around them, similar to websites like All Recipes or New York Times Cooking. <a href=https://gist.github.com/cbmackintosh/b5e3bc69b09c0c6a9dc5abc8d16556f4>Inspiration for design and functionality</a> was drawn from New York Times Cooking and similar designs found on Dribble.

![Screen Shot 2021-02-17 at 8 56 49 AM](https://user-images.githubusercontent.com/72054706/108230736-4fef0280-70fe-11eb-84e9-554e941c1674.png)


Users are able to view a list of recipes on the app and filter those recipes by a combination of one or more names, ingredients and tags using a single streamlined search bar. Users can also add recipes to their list of favorites and filter that list using the same search bar on the My Recipes tab.

![Screen Shot 2021-02-17 at 9 00 03 AM](https://user-images.githubusercontent.com/72054706/108230995-8e84bd00-70fe-11eb-8b1a-eb2cdbea27a8.png)


Clicking on any recipe will take the user to a more detailed recipe card with a list of ingredients, instructions and additional suggested dishes. From there, the Lets Cook button will indicate whether or not the user has enough ingredients for the selecte recipe, and what ingredients in what quantities are missing. From this menu, a variety of pathways and outcomes are possible as illustrated by the flow chart below:

![Screen Shot 2021-02-17 at 9 04 54 AM](https://user-images.githubusercontent.com/72054706/108231683-3c906700-70ff-11eb-8e2f-d7c658dd819d.png)

![Screen Shot 2021-02-17 at 9 05 44 AM](https://user-images.githubusercontent.com/72054706/108231782-592c9f00-70ff-11eb-9b1a-f08810d9b122.png)

<img width="1386" alt="Screen Shot 2021-02-15 at 5 06 28 PM" src="https://user-images.githubusercontent.com/72054706/108231507-12d74000-70ff-11eb-9cbf-806e2407d8d2.png">

The Grocery List shows the user what items they need to purchase to cook recipes on their Recipes To Cook List. Once these are purchased, the user can add them to their pantry, giving them sufficient ingredients to cook previously locked recipes.

**Installation Instructions:**

- Clone this repository `git@github.com:cbmackintosh/whats-cookin.git`
- Install the following dependencies: `npm install` and `npm install @glidejs/glide`
- From the root directory, open the application on web browser using `open ./src/index.html`

**Technologies used:**
<br><img src="https://img.shields.io/badge/javascript%20-%23323330.svg?&style=for-the-badge&logo=javascript&logoColor=%23F7DF1E"/><br>
<img src="https://img.shields.io/badge/css3%20-%231572B6.svg?&style=for-the-badge&logo=css3&logoColor=white"/><br>
<img src="https://img.shields.io/badge/html5%20-%23E34F26.svg?&style=for-the-badge&logo=html5&logoColor=white"/>
* Turing School of Software Design - Whats Cookin' starter kit: https://github.com/turingschool-examples/whats-cookin-starter-kit
* Visual Studio Code: 1.21.1 (text editor)
* npm 6.14.8 (package manager)
* Mocha ^6.1.4 (test framework)
* Chai ^4.2.0 (assertion library)
* eslint 7.19.0 (linter)

