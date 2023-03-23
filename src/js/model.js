import { async } from "regenerator-runtime";
import { API_URL, RES_PER_PAGE } from "./config.js";
import { getJSON } from './helpers';


export const state = {
    recipe: {},
    search: {
        query: '',
        result: [],
        page: 1,
        resultsPerPage: RES_PER_PAGE,
    },
    bookmarks: [],
};


export const loadRecipe = async function (id) {
    try{
        const data = await getJSON(`${API_URL}/${id}`);

        const {recipe} = data.data;
        state.recipe = {
            cookingTime: recipe.cooking_time,
            id: recipe.id,
            title: recipe.title,
            publisher: recipe.publisher,
            sourceUrl: recipe.source_url,
            image: recipe.image_url,
            servings: recipe.servings,
            cookingTime: recipe.cooking_time,
            ingredients: recipe.ingredients,
        };

        if(state.bookmarks.some(bookmark => bookmark.id === id))
            state.recipe.bookmarked = true;
        else state.recipe.bookmarked = false;
        

    }catch (error) {
        console.log(error);
        throw error
    }
};
loadRecipe('5ed6604591c37cdc054bc886')

export const loadSearchReasults = async function(query) {
    try{
        state.search.query = query;
        const data = await getJSON(`${API_URL}?search=${query}`);

        state.search.result = data.data.recipes.map(rec => {
            return {
                id: rec.id,
                title: rec.title,
                publisher: rec.publisher,
                image: rec.image_url,
                creator: 'Alex Voronin',
            };
        });
        state.search.page = 1;
    }catch (error) {
        console.log(error);
        throw error
    };
};

export const getSearchResultsPage = function(page = state.search.page) {
    state.search.page = page;

    const start = (page - 1) * state.search.resultsPerPage;
    const end = page * state.search.resultsPerPage;

    return state.search.result.slice(start, end)
};

export const updateServings = function(newServings) {
    state.recipe.ingredients.forEach(ing => {
        ing.quantity = ing.quantity * newServings / state.recipe.servings;
    });

    state.recipe.servings = newServings;
};

export const addBookmark = function(recipe) {
    // add bookmark to the array
    state.bookmarks.push(recipe);

    // mark current recipe as bookmark
    if(recipe.id === state.recipe.id) state.recipe.bookmarked = true;
};

export const deleteBookmark = function(id) {
    // delete bookmark 

    const index = state.bookmarks.findIndex(el => el.id === id);
    state.bookmarks.splice(index, 1);

    // mark recipe as not bookmarked
    if(id === state.recipe.id) state.recipe.bookmarked = false;
};


