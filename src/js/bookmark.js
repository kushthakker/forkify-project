"use strict";

import * as bookmarks from "./search.js";
// import { modal } from "./search.js";
export const bookmark = async function (e, main) {
  try {
    main.style.gridTemplateColumns = "5fr 2fr 1fr";

    const element = document.querySelector(".bookmark");

    element.innerHTML = "";
    const bookmarkArea = document.createElement("div");
    bookmarkArea.classList.add("bookmarkArea");
    element.appendChild(bookmarkArea);
    if (bookmarks.bookmarks.length === 0) {
      element.innerHTML = `<div class="noBookmarks">There are no bookmark saved here :(. </br> Pls. try saving it from search section or add a new recipe</div>`;
    }
    if (bookmarks.bookmarks.length > 0) {
      bookmarks.bookmarks.forEach(async (bookmark) => {
        const searchedRecipe = await fetch(
          `https://forkify-api.herokuapp.com/api/v2/recipes/${bookmark}?key=e50becf6-02fa-4b7a-b410-9adbeb55cd54`
        );
        if (!searchedRecipe.ok) {
          throw new Error(`${searchedRecipe.status} ${searchedRecipe.message}`);
        }
        const recipeData = await searchedRecipe.json();

        let { recipe } = recipeData.data;
        recipe = {
          id: recipe.id,
          title: recipe.title,
          publisher: recipe.publisher,
          sourceUrl: recipe.source_url,
          img: recipe.image_url,
          serving: recipe.servings,
          cookingTime: recipe.cooking_time,
          ingredients: recipe.ingredients,
        };

        bookmarkArea.insertAdjacentHTML(
          "beforeend",
          `<div class="quick-view-bookmark" id="${recipe.id}">
        <div class="img-sec">
            <img src="${recipe.img}" alt="img">
        </div>
        <div class="details">
            <h2>${
              recipe.title.length <= 20
                ? recipe.title
                : `${recipe.title.slice(0, 20)}...`
            }</h2>
            <h3>${recipe.publisher}</h3> 
        </div>
        </div>`
        );
      });
    }

    document.querySelector(".modal-search").classList.remove("hidden");
    document.querySelector(".modal-bookmark").classList.add("hidden");
    document.querySelector(".modal-addRecipe").classList.remove("hidden");
  } catch (err) {
    alert(err.message);
  }
};

//TODO: show number of items bookmared under the title on hover
