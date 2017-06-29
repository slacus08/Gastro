/*
CENTRAL APP PROCESS

1 - Users input number of Users
2 - Users input specific City
3 - Users enter a meal type (Breakfast, Brunch, Lunch, Dinner, Snack)
4 - Each user adds a cultural style
    4.1 - App can suggest cultural style previously
          entered by pull data from Firebase DB of
          last known selections
    4.2 - Otherwise, users can input predefined array
          of available styles (ex. Mexican, Chinese, Thai, etc.)
5 - Users can upvote or downvote cultural styles that they prefer or don't fancy
6 - App assigns probabilities to cuisine style based on the number of
    upvotes / downvotes and randomly selects one food type to eat
7 - App queries google maps for restaurants in the city indicated
8 - App parses the ratings of restaurants array in order to select top three
    outputted restaurants based on their rating
    8.1 - If multiple restaurants are highly rated (ex. six 5 star restaurants)
          selects 3 restaurants at random from the top rated restaurants
9 - Present user with the randomly selected restaurant, along with its address.
    9.1 - If users disagree with the restaurant selected, presents user with the
          two other restaurants found in the "top three" list

POTENTIAL FEATURES:
- Incoporate price range option for user group for those more financially concious
- Display the path from current location to the restaurant using google maps waypoints
*/

/*
1 - Input Number of Users
--------------------------------------------------------------------------------
*/
// prompt the user for the number of users
let numOfUsers = prompt('how many users?');
let userArray = [];
let instance = {};

//
function User(name) {
  this.name = name
}

for (i=0; i < numOfUsers; i++) {
  let currentUserName = prompt("Person" + JSON.stringify(i + 1) + " : What is your name?");
  let currentUserObj = new User(currentUserName);
  userArray.push(currentUserObj);
}

instance.total_users = userArray.length;

/*
2 - Users input specific Radius and Price
--------------------------------------------------------------------------------
*/
let specifiedRadius = convertMilesToMeters(30);
let groupMinPrice = 1;
let groupMaxPrice = 3;


function convertMilesToMeters (miles) {
  let meters = Math.round(miles*(50000/31.0686));
  return meters
}

/*
3 - Users enter a meal type (Breakfast, Brunch, Lunch, Dinner, Snack)
--------------------------------------------------------------------------------
*/
let mealTypeArray = ["breakfast", "brunch", "lunch", "dinner", "snack"];
let specificMealType = 'lunch';

function determineMealType(arr) {
  let userMealInput = prompt("What type of meal do you plan to eat?").toLowerCase();
  if (arr.indexOf(userMealInput) !== -1) {
    return userMealInput;
  } else {
    return determineMealType(arr);
  }
}

/*
4 - Each user adds a cultural style
--------------------------------------------------------------------------------
*/
let cuisineArray = [
  "mexican",
  "italian",
  "arabic",
  "chinese",
  "deli",
  "indian",
  "french",
  "american",
  "german"
];

function determineCuisine(arr, input) {
  if (arr.indexOf(input) !== -1) {
    arr.push(input);
  }
  return input;
}

for (i=0; i < userArray.length; i++) {
  let cuisineInput = prompt(userArray[i].name + ": What type of meal do you plan to eat?").toLowerCase();
  let currentUserCuisine = determineCuisine(cuisineArray, cuisineInput);
  userArray[i].cuisine = currentUserCuisine;
}

instance.users = userArray;

/*
5 - Users can upvote or downvote cultural styles that they prefer or don't fancy
--------------------------------------------------------------------------------
*/

// create an array of objects with all of the user's cuisine styles and their
// corresponding number of votes;
function generateCuisineArray (arr) {
  let cuisineArray = []
  for (i=0; i < arr.length; i++) {
    cuisineArray.push(arr[i].cuisine);
  }
  return cuisineArray;
}

let selectedCuisineArray = generateCuisineArray(userArray);

let talliedVotes = selectedCuisineArray.reduce((acc, item) => {
  if (acc[item]) {
    acc[item]++;
  } else {
    acc[item] = 1;
  }
  return acc;
}, {});

instance.votes = talliedVotes;
/*FOR IN LOOP - USE SECOND DATA STRUCTURE*/
/*
// EXAMPLE DATA STRUCTURE ALTERNATIVE
let talliedVotesAltExample = {
  total: 6,
  votes: {
    "mexican": 1,
    "italian": 2,
    "chinese": 3
  }
}
*/

/*
6 - App assigns probabilities to cuisine style based on the number of
    upvotes / downvotes and randomly selects one food type to eat
--------------------------------------------------------------------------------
*/

let groupSelectedCuisine = selectCuisineAtRandom(selectedCuisineArray);

function selectCuisineAtRandom(arr) {
  let randNum = Math.floor(Math.random()*arr.length);
  return arr[randNum];
}

instance.cuisine_chosen = groupSelectedCuisine;
console.log(instance);

/*
7 - App queries google maps for restaurants in the city indicated
--------------------------------------------------------------------------------
*/

let searchField = document.getElementById("autoid");
let searchOptions = {
  types: ['(cities)']
};
let autocomplete = new google.maps.places.Autocomplete(searchField, searchOptions);

let placeName;
let placeLat;
let placeLong;

autocomplete.addListener('place_changed', function () {
  let placeObj = autocomplete.getPlace();
  placeName = placeObj.name;
  placeLat = placeObj.geometry.location.lat();
  placeLong = placeObj.geometry.location.lng();
});

const apiKey = "AIzaSyCxJI7ZR7nJGUMQXMo6ytx8Scjn443ffqc"

/*
function placeQuery(placeName, placeRadius, placeType, placeKeyword) {
  return {
    name: placeName,
    radius: placeRadius,
    type: placeType,
    keyword: placeKeyword,
    opennow: placeOpennow
  };
}
*/

document.getElementById("genObjButton").addEventListener("click",
 displayPlacesResults(placeLat, placeLong, specifiedRadius, groupSelectedCuisine, groupMinPrice, groupMaxPrice, apiKey));

function displayPlacesResults(pLatitude, pLongitude, pRadius, pKeyword, pMinprice, pMaxprice, pKey) {
  let queryURL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
  axios.get(queryURL, {
    params: {
      location: pLatitude+','+pLongitude,
      radius: pRadius,
      keyword: pKeyword,
      minprice: pMinprice,
      maxprice: pMaxprice,
      key: pKey
    }
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
}
