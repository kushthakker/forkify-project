"use strict";
// const searchArea = document.querySelector('.search');
import searchIcon from "url:../img/search.png";
import loadingIcon from "url:../img/loading.svg";
import addIcon from "url:../img/add.png";
import minusIcon from "url:../img/minus.png";
import bookmark from "url:../img/bookmark.png";
let recipeArea;
let i = 0;
let pages = [];
let recipe;
let recipeAdd;
let serv = 0;
let serv2 = 0;
let ingredientsCopy = [];
export let bookmarks = [];
let storage;
const main = document.querySelector(".main");

async function fetchWithTimeout(resource, options) {
  const { timeout = 8000 } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const response = await fetch(resource, {
    ...options,
    signal: controller.signal,
  });
  clearTimeout(id);

  return response;
}

const searchBar = `
    <div class="recipe">
    <div class="input-field">
    <input class = "valueOfInput" type="text" placeholder="search..." focus>
</div>
<div class="recipe--area">
</div>
<img class="loading" src="${loadingIcon}" alt="loading...">
<div class="search-icon">☝️</div>
</div>
    `;

const addMoreBtn = `
    <div class="pageMore">
    <button class="btn-prev pushable ">
  <span class="front">
     Prev Page
  </span>
  </button>
  <button class=" btn-next pushable ">
  <span class="front">
   Next Page
  </span>
  </button>
    </div>
`;

function splitUp(arr, n) {
  var rest = arr.length % n, // how much to divide
    restUsed = rest, // to keep track of the division over the elements
    partLength = Math.floor(arr.length / n),
    result = [];

  for (var i = 0; i < arr.length; i += partLength) {
    var end = partLength + i,
      add = false;

    if (rest !== 0 && restUsed) {
      // should add one element for the division
      end++;
      restUsed--; // we've used one division element now
      add = true;
    }

    result.push(arr.slice(i, end)); // part of the array

    if (add) {
      i++; // also increment i in the case we added an extra element for division
    }
  }

  return result;
}
export const modal = async function (e, place = "quick-view") {
  try {
    main.style.gridTemplateColumns = "1fr 6fr 1fr";
    const id = e.target.closest(`.${place}`).id;
    const searchedRecipe = await fetch(
      `https://forkify-api.herokuapp.com/api/v2/recipes/${id}?key=e50becf6-02fa-4b7a-b410-9adbeb55cd54`
    );
    if (!searchedRecipe.ok) {
      throw new Error(`${searchedRecipe.status} ${searchedRecipe.message}`);
    }
    const recipeData = await searchedRecipe.json();

    recipeAdd = recipeData.data.recipe;
    recipeAdd = {
      id: recipeAdd.id,
      title: recipeAdd.title,
      publisher: recipeAdd.publisher,
      sourceUrl: recipeAdd.source_url,
      img: recipeAdd.image_url,
      serving: recipeAdd.servings,
      cookingTime: recipeAdd.cooking_time,
      ingredients: recipeAdd.ingredients,
    };

    const ingredients = splitUp(recipeAdd.ingredients, 2);
    ingredientsCopy = [...ingredients];

    const addModal = `
<button class="close-modal">&times;</button>
<div class="main-modal">
    <div class="outer">
    <img src="${recipeAdd.img}" alt="img">
    </div>
    <h2>${recipeAdd.title}</h2>
    <div class="info">
        <div class="time">
            <h4 class = "info-heading">${recipeAdd.cookingTime} min</h4>
        </div>
        <div class="bookmarkIcon">
        <label class="bookmarked">
            <input class="selected" type="checkbox"/>
            <div>
            <svg class="background" viewBox="0 0 16 24" stroke="currentColor">
                <path d="M0.5,23.124911 L6.9318135,16.6008331 C6.93933086,16.5932441 6.93933086,16.5932441 6.94691994,16.5857267 C7.53686305,16.0041267 8.48658644,16.01089 9.0681865,16.6008331 L15.5,23.124911 L15.5,2.02869001 C15.5,1.18283629 14.8268205,0.5 14,0.5 L2,0.5 C1.17317953,0.5 0.5,1.18283629 0.5,2.02869001 L0.5,23.124911 Z"></path>
            </svg>
            <svg class="active" viewBox="0 0 16 24" fill="currentColor">
                <path d="M2,0 L14,0 C15.1045695,0 16,0.908275455 16,2.02869001 L16,23.7565572 C16,23.8910069 15.8925483,24 15.76,24 C15.696348,24 15.6353031,23.9743516 15.5902944,23.9286973 L8.71212433,16.9518598 C8.32439096,16.5585644 7.69124204,16.5540555 7.29794663,16.9417889 C7.29456578,16.9451219 7.29120871,16.948479 7.28787567,16.9518598 L0.409705627,23.9286973 C0.315979797,24.0237676 0.164020203,24.0237676 0.0702943725,23.9286973 C0.0252856417,23.8830429 0,23.8211222 0,23.7565572 L0,2.02869001 C0,0.908275455 0.8954305,0 2,0 Z"></path>
            </svg>
            </div>
    </div>
        <div class="serving">
            <h4 class ="info-heading servingInfo">${
              recipeAdd.serving + serv
            } servings</h4>
            <img src="${addIcon}" class="serving-icon__add" alt="img">
            <img src="${minusIcon}" class="serving-icon__minus" alt="img">
</div>
        </div>
    </div>
    <div class="recipe-info">
        <h3 class ="h3"> Recipe Ingredients</h3>
        <div class="recipe_info--items">
            <div class="item-col-1">
            ${ingredients[0].map(
              (ele) =>
                `<h4 class="items_inRow">${ele.quantity ?? ""}${ele.unit} ${
                  ele.description
                }</h4>`
            )}
            </div>
            <span class="border"></span>
            <div class="item-col-2">
            ${ingredients[1].map(
              (ele) =>
                `<h4>${ele.quantity ?? ""}${ele.unit} ${ele.description}</h4>`
            )}
            </div>
        </div>
    </div>
    <div class="instruction">
        <h3 class="h3">How to Cook it</h3>
        <p>This recipe was carefully designed and tested by ${
          recipeAdd.publisher
        }. Please check out directions at their website. </p>
        <button class="button">
            <span class="inner-btn">Directions</span>
            <div class="button__horizontal"></div>
            <div class="button__vertical"></div>
        </button>
    </div>
</div>
`;
    document.querySelector(".modal").innerHTML = addModal;
    history.pushState(null, "", `/${id}`);
    if (bookmarks.includes(recipeAdd.id))
      document.querySelector(".selected").checked = true;
    document.querySelector(".overlay").classList.remove("hidden");
    document.querySelector(".modal").classList.remove("hidden");

    document.querySelector(".recipe-info").innerHTML = document
      .querySelector(".recipe-info")
      .innerHTML.replaceAll(",", "");

    document.querySelector(".button").addEventListener("click", function () {
      window.open(`${recipeAdd.sourceUrl}`, "_blank");
    });
    document
      .querySelector(".serving")
      .addEventListener("click", servingsButton);
    document
      .querySelector(".close-modal")
      .addEventListener("click", closeModal);
    document
      .querySelector(".bookmarked")
      .addEventListener("click", bookmarkFnc);
    document.querySelector(".overlay").addEventListener("click", function (e) {
      closeModal();
    });
    document
      .querySelector(".close-modal")
      .scrollIntoView({ behavior: "smooth" });
  } catch (err) {
    alert(err);
  }
};

export const presistBookmark = function () {
  localStorage.setItem("bookmarksSaved", JSON.stringify(bookmarks));
};

export const takeBookmark = function () {
  storage = localStorage.getItem("bookmarksSaved");

  if (storage) bookmarks = JSON.parse(storage);
};

const bookmarkFnc = function (e) {
  const selected = e.target;
  if (selected.classList.contains("selected")) {
    if (!selected.checked) {
      selected.checked = false;
      const index = bookmarks.indexOf(recipeAdd.id);
      if (index > -1) {
        bookmarks.splice(index, 1);
        [storage].splice(index, 1);
      }
      localStorage.setItem("bookmarksSaved", JSON.stringify(bookmarks));
    } else {
      selected.checked = true;
      bookmarks.push(recipeAdd.id);
      presistBookmark();
    }
  }
};

const closeModal = function () {
  document.querySelector(".modal").classList.add("hidden");
  document.querySelector(".overlay").classList.add("hidden");
  document.querySelector(".modal").innerHTML = "";
  history.pushState(null, "", `/`);
  serv = 0;
  serv2 = 0;
};

const servingsButton = function (e) {
  const selected = e.target;
  if (e.target.classList.contains("serving-icon__add")) {
    serv++;
    serv2 += 0.25;
    document.querySelector(".servingInfo").innerHTML = `${
      recipeAdd.serving + serv
    } servings`;
    document.querySelector(".item-col-1").innerHTML = `
      ${ingredientsCopy[0].map(
        (ele) =>
          `<h4>${ele.quantity === null ? "" : ele.quantity + serv2}${
            ele.unit
          } ${ele.description} </h4>`
      )}`;
    document.querySelector(".item-col-2").innerHTML = `
      ${ingredientsCopy[1].map(
        (ele) =>
          `<h4>${ele.quantity === null ? "" : ele.quantity + serv2}${
            ele.unit
          } ${ele.description} </h4>`
      )}`;
    document.querySelector(".recipe-info").innerHTML = document
      .querySelector(".recipe-info")
      .innerHTML.replaceAll(",", "");
  }
  if (e.target.classList.contains("serving-icon__minus")) {
    if (serv === -3) return;
    serv--;
    serv2 -= 0.25;
    document.querySelector(".servingInfo").innerHTML = `${
      recipeAdd.serving + serv
    } servings`;
    document.querySelector(".item-col-1").innerHTML = `
      ${ingredientsCopy[0].map(
        (ele) =>
          `<h4>${ele.quantity === null ? "" : ele.quantity + serv2}${
            ele.unit
          } ${ele.description} </h4>`
      )}`;
    document.querySelector(".item-col-2").innerHTML = `
      ${ingredientsCopy[1].map(
        (ele) =>
          `<h4>${ele.quantity === null ? "" : ele.quantity + serv2}${
            ele.unit
          } ${ele.description} </h4>`
      )}`;
    document.querySelector(".recipe-info").innerHTML = document
      .querySelector(".recipe-info")
      .innerHTML.replaceAll(",", "");
  }
};

export const createPage = function (data, n) {
  let [...arr] = data;
  const res = [];
  while (arr.length) {
    res.push(arr.splice(0, n));
  }
  return res;
};

const addRecipes = async function (data) {
  try {
    await data.forEach((element) => {
      const quickRecipe = `<div class="quick-view" id="${element.id}">
    <div class="img-sec">
        <img src="${element.image_url}" alt="img">
    </div>
    <div class="details">
        <h2>${
          element.title.length <= 20
            ? element.title
            : `${element.title.slice(0, 20)}...`
        }</h2>
        <h3>${element.publisher}</h3> 
    </div>
    </div>`;
      recipeArea.insertAdjacentHTML("beforeend", quickRecipe);
    });
    document.querySelector(".loading").style.display = "none";
  } catch (err) {
    alert(err);
  }
};

const next = async function () {
  i++;
  document.querySelector(".valueOfInput").focus();
  document.querySelector(".loading").style.display = "inline-block";
  recipeArea.innerHTML = "";
  await addRecipes(pages[i]);

  if (i >= 1)
    document.querySelector(".btn-prev").style.display = "inline-block";
  if (i === pages.length - 1)
    document.querySelector(".btn-next").style.display = "none";
};

const prev = async function () {
  i--;

  document.querySelector(".valueOfInput").focus();
  document.querySelector(".loading").style.display = "inline-block";
  recipeArea.innerHTML = "";
  await addRecipes(pages[i]);
  if (i === 0) {
    document.querySelector(".btn-prev").style.display = "none";
  }
  if (i < pages.length - 1)
    document.querySelector(".btn-next").style.display = "inline-block";
};

const displayResult = async function (data) {
  i = 0;
  recipeArea = document.querySelector(".recipe--area");
  recipeArea.innerHTML = "";
  recipe = document.querySelector(".recipe");
  document.querySelector(".loading").style.display = "block";
  pages = createPage(data, 15);
  await addRecipes(pages[i]);
  recipe.insertAdjacentHTML("beforeend", addMoreBtn);
  if (pages.length === 1) {
    document.querySelector(".btn-next").style.display = "none";
    document.querySelector(".btn-prev").style.display = "none";
  } else {
    document.querySelector(".btn-next").style.display = "inline-block";
    document.querySelector(".btn-prev").style.display = "none";
  }
};
const inputValue = async function (e) {
  try {
    if (e.key === "Enter") {
      i = 0;
      document.querySelector(".loading").style.display = "block";
      const value = e.target.value.toLowerCase();
      e.target.value = "";
      const search = await fetchWithTimeout(
        `https://forkify-api.herokuapp.com/api/v2/recipes?search=${value}&key=e50becf6-02fa-4b7a-b410-9adbeb55cd54`,
        { timeout: 6000 }
      );
      if (!search.ok) {
        throw new Error(`${search.status} : ${search.message}`);
      }
      const searchData = await search.json();

      if (searchData.results === 0)
        throw new Error(`Cannot find any recipe. Sorry :(`);
      const searchDataResult = await searchData.data.recipes;

      await displayResult(searchDataResult);
      document.querySelector(".btn-next").addEventListener("click", next);
      document.querySelector(".btn-prev").addEventListener("click", prev);

      // clicking a recipe a modal will popup

      document.querySelector(".recipe--area").addEventListener("click", modal);
    }
  } catch (err) {
    alert(err.message);
  }
  document.querySelector(".loading").style.display = "none";
};

const searchFnc = function (entries, observer) {
  const [entry] = entries;
  const search = document.querySelector(".search-icon");
  if (!entry.isIntersecting) {
    search.classList.add("showBtn");
    search.addEventListener("click", function () {
      document
        .querySelector(".input-field")
        .scrollIntoView({ behavior: "smooth" });
      document.querySelector(".valueOfInput").focus();
      search.classList.remove("showBtn");
    });
  } else search.classList.remove("showBtn");
};

const searchObj = {
  root: document.querySelector(".recipe"),
  threshold: 0,
};

export const search = function (e, main) {
  try {
    main.style.gridTemplateColumns = "1fr 6fr 1fr";
    const element = e.target.parentNode;
    element.innerHTML = "";
    document.querySelector(".bookmark").innerHTML = "";
    history.pushState(null, "", `/`);
    element.insertAdjacentHTML("beforeend", searchBar);
    const searchInput = document.querySelector(".valueOfInput");
    searchInput.focus();
    searchInput.addEventListener("keydown", inputValue);
    const observeSearch = new IntersectionObserver(searchFnc, searchObj);
    observeSearch.observe(searchInput);

    document.querySelector(".modal-search").classList.add("hidden");
    document.querySelector(".modal-bookmark").classList.remove("hidden");
    document.querySelector(".modal-addRecipe").classList.remove("hidden");
    console.log(`hola new branch`);
  } catch (err) {
    alert(err.message);
  }
};

if (module.hot) {
  module.hot.accept();
}

// #TODO: search icon at bottom that take us back on top using intersection api. ✅
// #TODO: add next page icon at bottom. new page will fetch next 15 elements from api.✅
// #TODO: on clicking on recipe a big modal will open with all the details inside it ✅
// #TODO: add recipe ingredients half on each side ✅
// #TODO: add bookmark and servings-add-decrease icons.✅
// #TODO: click outside of modal to close ✅
// #TODO: implement decrease and increse servings featur✅
