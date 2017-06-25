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

//
function User(name, vote, votedFor) {
  this.name = name,
  this.vote = vote;
  this.votedFor = null;
  this.getName = function () {return name};
}

for (var i=0; i < numOfUsers; i++) {
  let currentUserName = prompt("Person" + JSON.stringify(i + 1) +  ": What is your name?");
  let currentUserObj = new User(currentUserName, 1, null);
  userArray.push(currentUserObj);
}
