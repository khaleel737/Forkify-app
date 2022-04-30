import * as model from './model.js'
import { MODEL_CLOSE_SECONDS } from './config.js';
import recipeView from './views/recipeView.js'
import searchView from './views/searchView.js'
import resultsView from './views/resultsView.js';
import paginationView  from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';




import 'core-js/stable';
import 'regenerator-runtime/runtime'

// djslajdlksajldkjsalkdjalkjdlsjakdjlakjdas
// Parcel Hot Module

// if(module.hot) {
//   module.hot.accept();
// }

// const recipeContainer = document.querySelector('.recipe');



// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
// Spinner Render


const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // 0) Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    // 1) Updating bookmarks view
    bookmarksView.update(model.state.bookmarks);

    // 2) Loading recipe
    await model.loadRecipe(id);

    // 3) Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};


// const controlRecipes = async function () {
//   try {

//     const id = window.location.hash.slice(1);
//     // console.log(id, "im working");
//     // console.log(this.resultsView);
    
//     if(!id) return;

//     // 0) Results View to mark the selected search results

//     resultsView.update(model.getSearchResultsPage());

//     recipeView.renderSpinner();

//     // Loading Recipe
//     await model.loadRecipe(id);

//     // const { recipe } = model.state;
//     // console.log(recipe);


//     // Rendering Recipe
//     recipeView.render(model.state.recipe)


//     // Testing Servings To be called after the API is loaded
//     // controlServings();


//   } catch (err) {
//     // console.error(err);
//     recipeView.renderError(`😵 ${err} 😵`)
//   }

// }

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner()
    const query = searchView.getQuery();
    console.log(query);
    if(!query) return;

    await model.loadSearchResults(query);
    // console.log(model.state.search.results);
    // resultsView.render(model.getSearchResultsPage());
    resultsView.render(model.getSearchResultsPage());

    //  Render the initial Pagination Buttons

    paginationView.render(model.state.search)

  } catch(err) {
    console.error(err);
  }
}
// controlSearchResults()
// controlRecipes()


// We can bundle both functions with forEach


// ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, controlRecipes));

// Button Controller
const pageContoller = function(goToPage) {

  resultsView.render(model.getSearchResultsPage(goToPage));

  //  Render the initial Pagination Buttons

  paginationView.render(model.state.search);
}

// Servings Controller
const controlServings = function (newServings) {
// Update recipe Servings (in state)
model.updateServings(newServings);

// recipeView.render(model.state.recipe);

recipeView.update(model.state.recipe);



// Update the Recipe View
};

const controlAddBookmark = function () {
  // 1) Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookMark(model.state.recipe);
  else model.removeBookMark(model.state.recipe.id);
  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {

  bookmarksView.render(model.state.bookmarks)
}


const controlAddRecipe = async function (newRecipe) {
try {

  // Spinner
  addRecipeView.renderSpinner()
  // Upload the new recipe data
  await model.uploadRecipe(newRecipe)

  console.log(model.state.recipe);

  // Render Uploaded Recipe

  recipeView.render(model.state.recipe);

  // Success Message
  addRecipeView.renderMessage();
  

  // Render Bookmark View
  bookmarksView.render(model.state.bookmarks)

  // Change ID in URL
  window.history.pushState(null, '', `#${model.state.recipe.id}`)

  // Close form window

  setTimeout(function() {
    addRecipeView.toggleWindow()
  }, MODEL_CLOSE_SECONDS * 1000)

} catch (err) {
console.error('!!!!!', err);
addRecipeView.renderError(err.message)
}

  // console.log(newRecipe);

}

// Publisher / Subscriber
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(pageContoller);
  addRecipeView.addHandlerUpload(controlAddRecipe)
  // controlServings(); //Will not work as its being called before the API is called
}
init();

// console.log(`TESTING PARCEL`);

