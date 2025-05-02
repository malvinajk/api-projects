//The user will enter a cocktail. Get a cocktail name, photo, and instructions and place them in the DOM


let drinks = []
let currentIndex = 0;

document.querySelector(".get-cocktail-button").addEventListener("click", getDrinkFromSearch)
document.querySelector("#next").addEventListener("click", nextDrink)

function getDrinkFromSearch() {
    const userDrink = document.querySelector(".user-input").value;
    const url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${userDrink}`;
    fetch(url)
        .then(res => res.json())
        .then(data => {
            drinks = data.drinks;
            if (!drinks) {
                console.log("No drinks found.");
                return;
            }
            currentIndex = 0;
            displayDrink(currentIndex);
        })
        .catch(err => console.log(`Search error: ${err}`));
}

function getDrink(customUrl) {


    let userDrink = document.querySelector(".user-input").value
    let drinksUrl = customUrl;

    if (!customUrl) {
        let userDrink = document.querySelector(".user-input").value;
        drinksUrl = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${userDrink}`;
    }
    

    fetch(drinksUrl)
        .then(res => res.json())
        .then(data => {
            drinks = data.drinks;
            if (!drinks) {
                console.log("No drinks found.");
                return;
            }
            currentIndex = 0;
            displayDrink(currentIndex);
        })
        .catch(err => {
            console.log(`error: ${err}`);
        });
}

function nextDrink() {
    if (drinks.length === 0) return
    currentIndex = (currentIndex + 1) % drinks.length
    displayDrink(currentIndex)

}

function displayDrink(index) {
    assignImg(index)
    assignIngredients(index)
    assignName(index)
    assignInstructions(index)
}

function assignImg(currentIndex) {
    document.getElementById("cocktail-img").src = drinks[currentIndex].strDrinkThumb
}

function assignIngredients(currentIndex) {
    let list = document.getElementById("ingredient-list");
    list.innerHTML = "";
    let drink = drinks[currentIndex];
    // let listOfIngredients = [];

    for (let i = 1; i <= 15; i++) {
        let ingredientName = "strIngredient" + i;
        let measureName = "strMeasure" + i;

        let ingredient = drink[ingredientName];
        if (!ingredient) continue; // skip if ingredient is null or empty

        let measure = drink[measureName] || ""; // use empty string if measure is null
        let listItem = document.createElement("li");
        listItem.innerText = `${measure}${measure && " "}${ingredient}`; // adds space if measure exists
        list.appendChild(listItem);
        // listOfIngredients.push(ingredient);
    }

}

function assignName(currentIndex) {
    let name = document.getElementById("cocktail-name")
    name.innerHTML = drinks[currentIndex].strDrink
}

function assignInstructions(currentIndex) {
    let instructions = document.getElementById("directions-list")
    instructions.innerHTML = drinks[currentIndex].strInstructions
}

const ingredients = "https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list"
let ingredientsList = []
const select = document.getElementById("choose-ingredient")

fetch(ingredients)
    .then(res => {
        return res.json();
    })
    .then(data => {
        ingredientsList = data.drinks
        // console.log(ingredientsList)
        // const ingArray = [];
        for(let i = 0; i < ingredientsList.length; i++){
            let name = ingredientsList[i].strIngredient1
            // console.log(name)
            // ingArray.push(name);
            const option = document.createElement("option")
            option.value = name
            option.innerText = name
            select.appendChild(option)
        }

        // console.log(ingArray)
    })

select.addEventListener("change", event => {
    const ingredient = event.target.value;

    // First: fetch cocktails with that ingredient (basic info only)
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${ingredient}`)
        .then(res => res.json())
        .then(data => {
            if (!data.drinks || data.drinks.length === 0) {
                console.log("No drinks found with that ingredient.");
                return;
            }

            // Get the first drink's ID from the list
            const firstDrinkId = data.drinks[0].idDrink;

            // Now: fetch full cocktail details using that ID
            return fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${firstDrinkId}`);
        })
        .then(res => {
            if (!res) return;
            return res.json();
        })
        .then(data => {
            if (!data || !data.drinks) return;

            // Overwrite the global drinks array and display
            drinks = data.drinks;
            currentIndex = 0;
            displayDrink(currentIndex);
        })
        .catch(err => {
            console.log("Error fetching cocktail by ingredient:", err);
        });
});




