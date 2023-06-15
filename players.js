// Getting the player container and new player form container elements from the DOM
const playerContainer = document.getElementById("all-players-container");
const newPlayerFormContainer = document.getElementById("new-player-form");

// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = "2302-ACC-PT-WEB-PT-A";
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/players`;

// helper function to toggle player visibility
function togglePlayerListVisibility(displayVal) {
  const playerElements = document.getElementsByClassName("player");
  for (const playerElement of playerElements) {
    playerElement.style.display = displayVal;
  }
  newPlayerFormContainer.style.display = displayVal;
}

// Fetch all players from the API
const fetchAllPlayers = async () => {
  try {
    const response = await fetch(APIURL);
    const data = await response.json();
    const players = data.data.players;
    // console.log(players)
    return players;
  } catch (error) {
    console.error("Uh oh, trouble fetching players!", error);
    throw error;
  }
};

// Fetch details of a single player by playerId
const fetchSinglePlayer = async (playerId) => {
  try {
    const response = await fetch(`${APIURL}/${playerId}`);
    const data = await response.json();
    const player = data.data.player;
    return player;
  } catch (error) {
    console.error(`Oh no, trouble fetching player #${playerId}!`, err);
  }
};

// Render details of a player by playerId
const renderPlayerDetails = async (playerId) => {
  try {
    const player = await fetchSinglePlayer(playerId);
    if (player) {
      // Display the player details
      console.log(player);
    }
  } catch (error) {
    console.error("Uh oh, trouble rendering player details!", error);
  }
};

// Add a new player to the roster
const addNewPlayer = async (playerObj) => {
  try {
    const response = await fetch(`${APIURL}`, {
      //creating a post to the server
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      //stringify converts json() to string
      body: JSON.stringify(playerObj),
    });
    // console.log(response);
    const playerData = await response.json();
    return playerData;
  } catch (err) {
    console.error("Oops, something went wrong with adding that player!", err);
  }
};

// Remove a player from the roster by playerId
const removePlayer = async (playerId) => {
  // send a DELETE api call by id
  console.log(playerId + "is going bye bye");
  try {
    const requestOptions = {
      method: "DELETE",
    };
    const response = await fetch(`${APIURL}/${playerId}`, requestOptions);
    const puppy = await response.json();
    return puppy;
  } catch (error) {
    console.error(
      `Whoops, trouble removing player #${playerId} from the roster!`,
      error
    );
  }
};

// Render all players in the player container
const renderAllPlayers = async (players) => {
  try {
    playerContainer.innerHTML = "";
    players.forEach((player) => {
      // Create a new player element
      const playerElement = document.createElement("div");
      playerElement.classList.add("player");
      playerElement.innerHTML = `
              <h2>${player.name}</h2>
              <p>${player.breed}</p>
              <p>${player.status}</p>
              <img src="${player.imageUrl}"/>
              <div class="button-container">
              <button class="details-button" data-id="${player.id}">See Details</button>
              <button class="removeButton" data-id="${player.id}">Remove From Roster</button>
              `;
      playerContainer.appendChild(playerElement);

      // Function to render details of a single player by playerId
      const renderSinglePlayerById = async (id) => {
        try {
          //fetch player details from server
          const player = await fetchSinglePlayer(id);

          //create a new HTML element to display player details
          const playerDetailsElememt = document.createElement("div");
          playerDetailsElememt.classList.add("player-details");
          playerDetailsElememt.innerHTML = `
                  <h2>${player.name}</h2>
                  <p><img src = "${player.imageUrl}"></p>
                  <p>ID:${player.id}</p>
                  <p>Breed:${player.breed}</p>
                  <p>Status:${player.status}</p>
                  <p>Created at:${player.createdAt}</p>
                  <p>Updated at:${player.updatedAt}</p>
                  <p>Team ID:${player.teamId}</p>
                  <p>Cohort ID:${player.cohortId}</p>
                  <button class="close-button">Close</button>
              `;

          playerContainer.appendChild(playerDetailsElememt);

          // add event listener to close button
          const closeButton =
            playerDetailsElememt.querySelector(".close-button");
            closeButton.addEventListener("click", () => {
            playerDetailsElememt.remove();
            togglePlayerListVisibility("flex");
          });
        } catch (err) {
          console.error(`Uh oh, trouble rendering player #${playerId}!`, err);
        }
      };

      // details button
      const detailsButton = playerElement.querySelector(".details-button");
      detailsButton.addEventListener("click", async (event) => {
        //hide the list of players (to create a clean slate for a detailed player to show)
        togglePlayerListVisibility("none");

        //show the details of the player clicked
        renderSinglePlayerById(event.target.dataset.id);
      });
      //remove button
      const removeButton = playerElement.querySelector(".removeButton");
      removeButton.addEventListener("click", async (event) => {
        const playerId = event.target.dataset.id;
        await removePlayer(playerId);
        event.target.closest("div.player").remove();
      });
    });
  } catch (error) {
    console.error("Uh oh, trouble rendering players!", error);
  }
};

// Render the form for adding a new player
const renderNewPlayerForm = () => {
  try {
    // createdAt and updatedAt should be created by the app, not the user. exclude them from the form
    let form = `
      
        <form id="add-player-form">
        <h3>Add Your Goodest Pupper to the Roster!!</h3>
          <label>Name: </label>
          <input type="text" name="name" placeholder="" required><br><br>
          <label for="input-breed">Breed: </label>
          <input type="text" id="input-breed" name="input-breed" placeholder="" required><br><br>
          <label>Status: </label>
          <select name="status">
            <option value="bench">Bench</option>
            <option value="field">Field</option>
          </select><br><br>
          <label>ImageUrl: </label>
          <input type="url" name="imageUrl" placeholder="" required><br><br>
          <label>TeamId: </label>
          <input type="number" name="teamId" placeholder="" required><br><br>
          <input type="submit" id="input-submit" value="Add new Player">
        </form>
        <div class = "welcome-statement">
        <header>
        <h1>Welcome to the 2023 Puppy Bowl!!!</h1> </header>
        <p class = "welcome-text"> Welcome to the Puppy Bowl 2023, the cutest sporting event of the year!
        <br>Come watch the fur and fluff collide in an epic battle for the title of the
        <br>Most Adorable Athlete.
        <br>Puppy Bowl 2023 is an event you won't want to miss! 
        <br>The stakes are high and the fur is fluffy.
        <br>Get ready for a barking good time!</p>
        </div>
      `;
    newPlayerFormContainer.innerHTML = form;

    // for submit events, add the event listener to the entire form
    const addPlayerForm = document.getElementById("add-player-form");
    const inputSubmit = document.getElementById("input-submit");
    inputSubmit.addEventListener("click", async (event) => {
      event.preventDefault();
      console.log("Player submit clicked");
      const playerName = addPlayerForm.elements.name.value;
      const playerBreed = addPlayerForm.elements["input-breed"].value;
      const playerStatus = addPlayerForm.elements.status.value;
      const playerImageUrl = addPlayerForm.elements.imageUrl.value;

      const newPlayer = {
        name: playerName,
        breed: playerBreed,
        status: playerStatus,
        imageUrl: playerImageUrl,
      };

      await addNewPlayer(newPlayer);
      console.log(newPlayer);
      location.reload();
    });
  } catch (err) {
    console.error("Uh oh, trouble rendering the new player form!", err);
  }
};

export {
  fetchAllPlayers,
  fetchSinglePlayer,
  renderPlayerDetails,
  addNewPlayer,
  removePlayer,
  renderAllPlayers,
  renderNewPlayerForm,
};
