const playerContainer = document.getElementById("all-players-container");
const newPlayerFormContainer = document.getElementById("new-player-form");

// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = "2302-ACC-PT-WEB-PT-A";
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/players`;

/**
 * It fetches all players from the API and returns the
 * @returns An array of objects.
 */
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

const addNewPlayer = async (playerObj) => {
  try {
    const response = await fetch(`${APIURL}`, {
      //maybe this is wrong
      method: "POST", //creating a post to the server
      headers: {
        "Content-Type": "application/json", //This tells the server that the request body will be in JSON format
      },
      body: JSON.stringify(playerObj), //stringify converts json() to string
    });
    // console.log(response);
    const playerData = await response.json();
    return playerData;
  } catch (err) {
    console.error("Oops, something went wrong with adding that player!", err);
  }
};

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
const renderAllPlayers = async (players) => {
  try {
    playerContainer.innerHTML = "";
    players.forEach((player) => {
      const playerElement = document.createElement("div");
      playerElement.classList.add("player");
      playerElement.innerHTML = `
            <h2>${player.name}</h2>
            <p>${player.breed}</p>
            <p>${player.status}</p>
            <img src=${player.imageUrl}/>
            <div class="button-container">
            <button class="details-button" data-id="${player.id}">See Details</button>
           
            <button class="removeButton" data-id="${player.id}">Remove From Roster</button>
            `;
      playerContainer.appendChild(playerElement);

      // details button
      const detailsButton = playerElement.querySelector(".details-button");
      detailsButton.addEventListener("click", async (event) => {
        let playerId = event.currentTarget.dataset.id;
        await RenderPlayerById(playerId);
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

/**
 * It renders a form to the DOM, and when the form is submitted, it adds a new player to the database,
 * fetches all players from the database, and renders them to the DOM.
 */
const renderNewPlayerForm = () => {
  try {
    // createdAt and updatedAt should be created by the app, not the user. exclude them from the form
    let form = `
      <form id="add-player-form">
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
    `;
    newPlayerFormContainer.innerHTML = form;

    // for submit events, add the event listener to the entire form
    const addPlayerForm = document.getElementById("add-player-form");
    const inputSubmit = document.getElementById("input-submit");
    inputSubmit.addEventListener("click", async (event) => {
      event.preventDefault();
      console.log("Player submit clicked");
      const playerName = addPlayerForm.elements.name.value;
      const playerBreed = addPlayerForm.elements["input-breed"].value
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

const init = async () => {
  const players = await fetchAllPlayers();
  renderAllPlayers(players);
  renderNewPlayerForm();
};

init();
