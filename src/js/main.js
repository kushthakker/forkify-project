"use strict";
import { search } from "./search.js";
import { bookmark } from "./bookmark.js";
import { addRecipe } from "./addrecipe.js";
import "core-js/stable";
import "regenerator-runtime/runtime";
import { modal } from "./search.js";
import { takeBookmark } from "./search.js";
const main = document.querySelector(".main");

const open = function (e) {
  const element = e.target.parentNode.getAttribute("clicked");

  if (e.target.classList.contains("main-text")) {
    if (element === "0") {
      takeBookmark();
      bookmark(e, main);
    }
    if (element === "1") search(e, main);
    if (element === "2") addRecipe(e, main);
  } else {
    if (e.target.classList.contains("side-text")) {
      if (element === "0-b") {
        main.style.gridTemplateColumns = "5fr 2fr 1fr";
        document.querySelector(".add-recipe").innerHTML = "";
        document.querySelector(".modal-bookmark").classList.add("hidden");
        document.querySelector(".modal-search").classList.remove("hidden");
        document.querySelector(".modal-addRecipe").classList.remove("hidden");
        bookmark(e, main);
      }
      if (element === "1-b") {
        main.style.gridTemplateColumns = "1fr  6fr 1fr";

        document.querySelector(".add-recipe").innerHTML = "";
        document.querySelector(".bookmark").innerHTML = "";
        document.querySelector(".modal-search").classList.add("hidden");
        document.querySelector(".modal-bookmark").classList.remove("hidden");
        document.querySelector(".modal-addRecipe").classList.remove("hidden");
      }
      if (element === "2-b") {
        main.style.gridTemplateColumns = "1fr 2fr 5fr";
        document.querySelector(".bookmark").innerHTML = "";
        document.querySelector(".modal-search").classList.remove("hidden");
        document.querySelector(".modal-bookmark").classList.remove("hidden");
        document.querySelector(".modal-addRecipe").classList.add("hidden");
        addRecipe(e, main);
      }
    }
  }

  if (e.target.closest(".quick-view-bookmark")) {
    main.style.gridTemplateColumns = "1fr 6fr 1fr";
    document.querySelector(".modal-search").classList.add("hidden");
    document.querySelector(".modal-bookmark").classList.remove("hidden");
    document.querySelector(".modal-addRecipe").classList.remove("hidden");
    modal(e, "quick-view-bookmark");
    document.querySelector(".bookmark").innerHTML = "";
  }
};
main.addEventListener("click", open);

//#TODO: push our own recipe to loal storage
