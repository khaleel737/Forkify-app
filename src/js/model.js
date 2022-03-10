import { async } from 'regenerator-runtime';
import { API_URL, KEY, RES_PER_PAGE } from './config.js';
import { AJAX } from './helpers.js';


export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        page: 1,
        resultsPerPage: RES_PER_PAGE,
    },
    bookmarks: [],
};

const createRecipeData = function (data) {
    const {recipe} = data.data;

        return {
            id: recipe.id, 
            title: recipe.title,
            publisher: recipe.publisher,
            sourceURL: recipe.source_url,
            image: recipe.image_url,
            servings: recipe.servings,
            cookingTime: recipe.cooking_time,
            ingredients: recipe.ingredients,
            ...(recipe.key && { key: recipe.key }),
            
            
        };
}


export const loadRecipe = async function (id) {
    try {

        const data = await AJAX(`${API_URL}${id}?key=${KEY}`);

        state.recipe = createRecipeData(data);

        if(state.bookmarks.some(bookmark => bookmark.id === id))
        state.recipe.bookmarked = true;
        else
        state.recipe.bookmarked = false;

        
    } catch (err) {
        // Temp error handling
        console.error(`😵 ${err} 😵`);
        throw err;
    }

}

export const loadSearchResults = async function(query) {
try {
    state.search.query = query;

const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`)
console.log(data); 
state.search.results =  data.data.recipes.map(rec => {
    return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
    }
})

state.search.page = 1;
} catch (err) {

    console.error(`😵 ${err} 😵`);
    throw err;
}
}


export const getSearchResultsPage = function (page = state.search.page) {

    state.search.page = page;

    const start = (page - 1) * state.search.resultsPerPage; //0;
    const end = page * state.search.resultsPerPage; //9;

    return state.search.results.slice(start, end);

}

export const updateServings = function (newServings) {
state.recipe.ingredients.forEach(ingredient => {
    ingredient.quantity = (ingredient.quantity * newServings) / state.recipe.servings;

    // newQuantity = oldQuantity * newServings / oldServings;
});

// Update new Servings
state.recipe.servings = newServings;
console.log(state);

}


const persistBookmarks = function () {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks))

}

export const addBookMark = function (recipe) {
    // Add Bookmark
state.bookmarks.push(recipe)

// Mark current recipe as bookmarked
if(recipe.id === state.recipe.id) state.recipe.bookmarked = true;
persistBookmarks();
}


export const removeBookMark = function (id) {
    // delete bookmark
    const index = state.bookmarks.findIndex(el => el.id === id);
    state.bookmarks.splice(index, 1);

    // Mark current recipe as NOT bookmarked
if(id === state.recipe.id) state.recipe.bookmarked = false;
persistBookmarks();
}


const init = function() {

    const storage = localStorage.getItem('bookmarks');

    if(storage) state.bookmarks = JSON.parse(storage)
}

// init();
// console.log(state.bookmarks);

// Debugging Function

const clearBookmarks = function () {

    localStorage.clear('bookmarks');
  }
  clearBookmarks();



  export const uploadRecipe = async function (newRecipe) {
      try {

          const ingredients = Object.entries(newRecipe).filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '').map(ing => {
            //   const ingArr = ing[1].replaceAll(' ', '').split(',');
            const ingArr = ing[1].split(',').map(el => el.trim());

              if(ingArr.length !== 3) throw new Error('Wrong Ingredient Format !!!, Please Use the Correct Format')
              
              const [quantity, unit, description] = ingArr;
              return {quantity: quantity ? +quantity : null, unit, description};
            }) ;
            const recipe = {
                title: newRecipe.title,
                source_url: newRecipe.source_url,
                image_url: newRecipe.image,
                publisher: newRecipe.publisher,
                cooking_time: +newRecipe.cooking_time,
                servings: +newRecipe.servings,
                ingredients,
        
            };

            const data = await AJAX(`${API_URL}?key=${KEY}`, recipe)

            state.recipe = createRecipeData(data);

            addBookMark(state.recipe)
            // console.log(data);

            // console.log(recipe);
            console.log(ingredients);
        } catch (err) {
            throw err;
        }

    // console.log(Object.entries(newRecipe));

  }