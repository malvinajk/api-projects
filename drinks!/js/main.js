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

        for(let i = 0; i < ingredientsList.length; i++){
            let name = ingredientsList[i].strIngredient1;
            const option = document.createElement("option")
            option.value = name
            option.innerText = name
            select.appendChild(option)
        }

    })

select.addEventListener("change", event => {
    const ingredient = event.target.value;

    // Fetch list of cocktails by ingredient
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${ingredient}`)
        .then(res => res.json())
        .then(data => {
            if (!data.drinks || data.drinks.length === 0) {
                console.log("No drinks found with that ingredient.");
                return;
            }

            // Fetch full details for each drink by ID
            const drinkDetailPromises = data.drinks.map(drink =>
                fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drink.idDrink}`)
                    .then(res => res.json())
                    .then(detailData => detailData.drinks[0]) // grab the full drink object
            );

            // Wait for all full drink data to load
            return Promise.all(drinkDetailPromises);
        })
        .then(fullDrinks => {
            if (!fullDrinks || fullDrinks.length === 0) return;

            drinks = fullDrinks;
            currentIndex = 0;
            displayDrink(currentIndex);
        })
        .catch(err => {
            console.log("Error fetching cocktail by ingredient:", err);
        });
});





