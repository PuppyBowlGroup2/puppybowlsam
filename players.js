const playerContainer = document.getElementById("all-players-container");
const newPlayerFormContainer = document.getElementById("new-player-form");

// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = "2302-ACC-PT-WEB-PT-A";
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/players`;

// helper function to toggle player visibility
function togglePlayerListVisibility(displayVal,) {
  const playerElements = document.getElementsByClassName('player');
  for (const playerElement of playerElements) {
      playerElement.style.display = displayVal;
  }

  //also toggle the form
  newPlayerFormContainer.style.display = displayVal;
}

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

  const renderPlayerDetails = async (playerId) => {
    try {
      const player = await fetchSinglePlayer(playerId);
      if (player) {
        // Display the player details
        console.log(player);
        // Replace this with your code to render the player details in the DOM
      }
    } catch (error) {
      console.error("Uh oh, trouble rendering player details!", error);
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
              <img src="${player.imageUrl}"/>
              <div class="button-container">
              <button class="details-button" data-id="${player.id}">See Details</button>
              <button class="removeButton" data-id="${player.id}">Remove From Roster</button>
              `;
        playerContainer.appendChild(playerElement);
  
        const renderSinglePlayerById = async (id) => {
          try {
              //fetch player details from server
              const player = await fetchSinglePlayer(id);
      
              //create a new HTML element to display player details
              const playerDetailsElememt = document.createElement('div');
              playerDetailsElememt.classList.add('player-details'); 
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
              const closeButton = playerDetailsElememt.querySelector('.close-button');
              closeButton.addEventListener('click', () => {
                  playerDetailsElememt.remove();
                  togglePlayerListVisibility('flex');
              });
          } catch (err) {
              console.error(`Uh oh, trouble rendering player #${playerId}!`, err);
          }
      }
  
        // details button
        const detailsButton = playerElement.querySelector('.details-button');
        detailsButton.addEventListener('click', async (event) => {
            //hide the list of players (to create a clean slate for a detailed player to show)
            togglePlayerListVisibility('none');
  
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
  
  const renderNewPlayerForm = () => {
    try {
      // createdAt and updatedAt should be created by the app, not the user. exclude them from the form
      let form = `
      
        <form id="add-player-form">
        <h3>Add New Puppy Bowl Player</h3>
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
        <p class = "welcome-text"> Welcome to the Puppy Bowl 2023, the cutest sporting event of the year! Get ready for a paw-some
        display of puppy athleticism, where fur and fluff collide in an epic battle for the title of the Most Adorable
        Athlete.But don't be fooled by their innocent looks – these pups are fierce competitors. They'll go head-to-head,
        barking
        their way to victory, and proving that size doesn't matter when it comes to determination and puppy power.
        The halftime show promises to be an absolute treat, featuring the world-famous Puppy Marching Band and their
        adorable rendition of "Who Let the Dogs Out." And let's not forget the Puppy Bowl cheerleaders, bringing their
        infectious energy and tail-wagging enthusiasm to the sidelines.
        So grab your snacks, snuggle up with your favorite four-legged friend, and prepare to be overwhelmed by an
        avalanche of cuteness. Puppy Bowl 2023 is an event you won't want to miss, where the stakes are high, the fur is
        fluffy, and the "awwws" are in abundance. Get ready for a barking good time!</p>
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
    renderNewPlayerForm
  };