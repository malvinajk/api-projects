//The user will enter a cocktail. Get a cocktail name, photo, and instructions and place them in the DOM


let drinks = []

document.querySelector(".get-cocktail-button").addEventListener("click", getDrink)

function getDrink() {

    let userDrink = document.querySelector(".user-input").value
    let drinksUrl = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${userDrink}`


    fetch(drinksUrl)
        .then(res => {
            return res.json();
        })
        .then(data => {
            drinks = data.drinks
            console.log(drinks)
            assignImg()
            assignIngredients()
        })
        .catch(err => {
            console.log(`error: ${err}`)
        })

}

function assignImg() {
    document.getElementById("cocktail-img").src = drinks[0].strDrinkThumb
}

function assignIngredients() {
    let list = document.getElementById("ingredient-list")
    list.innerHTML = ""
    let drink = drinks[0]
    let listOfIngredients = []
    for (let i = 1; i <= 15; i++) {
        let ingredientName = "strIngredient" + i;
        let measure = "strMeasure" + i;
        if (drink[ingredientName] === null) continue
        if (drink[measure] === null) continue
        listOfIngredients.push(drink[ingredientName])
        let ing = document.createElement("li")
        ing.innerText = drink[measure] + drink[ingredientName]
        list.appendChild(ing)
    }
    
    console.log(listOfIngredients)
    
}





