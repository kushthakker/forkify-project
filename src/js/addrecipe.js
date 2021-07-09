"use strict";

import { bookmarks, createPage, presistBookmark } from "./search.js";

export const addRecipe = async function (e, main) {
  try {
    main.style.gridTemplateColumns = "1fr 2fr 5fr";
    main.style.transition = "all 0.5s ease-in-out";

    document.querySelector(".modal-search").classList.remove("hidden");
    document.querySelector(".modal-bookmark").classList.remove("hidden");
    document.querySelector(".modal-addRecipe").classList.add("hidden");

    const element = document.querySelector(".add-recipe");
    element.innerHTML = "";

    element.insertAdjacentHTML(
      "beforeend",
      ` <form class="upload">
    <div class="upload__column upload__column-1">
        <h3>Recipe Data</h3>
        <div class="col">
        <label>Title</label>
        <input type="text" placeholder="Halo Infinite" required name="title" autocomplete=”off"/>
        </div>
        <div class="col">
        <label>url</label>
        <input type="text" placeholder="xbox.com"  required name="source_url" autocomplete=”off"/>
        </div>
        <div class="col">
        <label>Image url</label>
        <input type="text" placeholder="https://picsum.photos/200/300" required name="image_url" />
        </div>
        <div class="col">
        <label>Publisher</label>
        <input type="text" placeholder="Xbox Game Studios" required name="publisher" />
        </div>
        <div class="col">
        <label>Prep time</label>
        <input type="text" placeholder="in min" required name="cooking_time" maxlength="2"/>
        </div>
        <div class="col">
        <label>Servings</label>
        <input type="text" placeholder="4" required name="servings" maxlength="1"/>
        </div>
    </div>
    <div class="upload__column upload__column-2">
        <h3>Ingredients</h3>
        <div class="col-2">
        <label>Ingredient 1</label>
        <input type="text"  required name="ingredient-1-quantity"  placeholder="Quantity" />
        <input type="text"  required name="ingredient-1-unit"  placeholder="unit" />
        <input type="text"  required name="ingredient-1-dis"   placeholder="Description" class="dis" />
        </div>
        <div class="col-2">
        <label>Ingredient 2</label>
        <input type="text" required name="ingredient-2-quantity" placeholder="Quantity" />
        <input type="text" required name="ingredient-2-unit"  placeholder="unit" />
        <input type="text" required name="ingredient-2-dis"   placeholder="Description" class="dis"/>
        </div>
        <div class="col-2">
        <label>Ingredient 3</label>
        <input type="text" required name="ingredient-3-quantity" placeholder="Quantity" />
        <input type="text" required name="ingredient-3-unit"  placeholder="unit" />
        <input type="text" required name="ingredient-3-dis"   placeholder="Description" class="dis"/>
        </div>
        <div class="col-2">
        <label>Ingredient 4</label>
        <input type="text"  name="ingredient-4-quantity" placeholder="Quantity" />
        <input type="text"  name="ingredient-4-unit"  placeholder="unit" />
        <input type="text" required name="ingredient-4-dis"   placeholder="Description" class="dis"/>
        </div>
        <div class="col-2">
        <label>Ingredient 5</label>
        <input type="text"  name="ingredient-5-quantity" placeholder="Quality" />
        <input type="text"  name="ingredient-5-unit"  placeholder="unit" />
        <input type="text" required name="ingredient-5-dis"   placeholder="Description" class="dis"/>
        </div>
        <div class="col-2">
        <label>Ingredient 6</label>
        <input type="text"  name="ingredient-6-quantity" placeholder="Quality" />
        <input type="text"  name="ingredient-6-unit"  placeholder="unit" />
        <input type="text" required name="ingredient-6-dis"   placeholder="Description" class="dis"/>
        </div>
    </div>
    <button class="button btn">
            <span class="inner-btn">Submit</span>
            <div class="button__horizontal"></div>
            <div class="button__vertical"></div>
        </button>
        <p class="green"> Submitted!!</p>
</form>`
    );

    document
      .querySelector(".upload")
      .addEventListener("submit", async function (e) {
        e.preventDefault();
        const dataArr = [...new FormData(this)];
        const data = Object.fromEntries(dataArr);
        const ingObj = Object.entries(dataArr)
          .map((ele) => ele[1])
          .filter((entry) => entry[0].startsWith("ingredient"));

        const newArr = createPage(ingObj, 3).map((ele) =>
          ele.map((element) => element[1])
        );

        const ingredients = newArr
          .map((element) => element.join())
          .map((ing) => {
            const [quantity, unit, description] = ing
              .replaceAll(" ", "")
              .split(",");
            return {
              quantity: quantity ? +quantity : null,
              unit,
              description: description ? description : null,
            };
          });

        const recipe = {
          title: data.title,
          publisher: data.publisher,
          source_url: data.source_url,
          image_url: data.image_url,
          servings: +data.servings,
          cooking_time: +data.cooking_time,
          ingredients,
        };

        const fetchSend = await fetch(
          `https://forkify-api.herokuapp.com/api/v2/recipes?key=e50becf6-02fa-4b7a-b410-9adbeb55cd54`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json", // we will tell the server that it will be in json format
            },
            body: JSON.stringify(recipe),
          }
        );

        const dataVar = await fetchSend.json();
        if (!fetchSend.ok) {
          throw new Error(` ${dataVar.message} ${fetchSend.status}`);
        }

        bookmarks.push(dataVar.data.recipe.id);
        presistBookmark();
        document.querySelectorAll("input").forEach((ele) => (ele.value = ""));
        document.querySelector(".green").style.display = "block";
        const asyncFoo = async () => {
          await new Promise((resolve) => setTimeout(resolve, 2000));
          setTimeout(() => {
            document.querySelector(".green").style.display = "none";
          });
        };
        await asyncFoo();
      });
  } catch (err) {
    alert(err);
  }
};
